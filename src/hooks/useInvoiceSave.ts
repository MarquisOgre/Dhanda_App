import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Generic item interface for both sale and purchase
interface BaseInvoiceItem {
  itemId: string;
  name: string;
  hsn?: string;
  quantity: number;
  unit: string;
  rate: number;
  discount: number;
  taxRate: number;
}

interface SaveInvoiceParams {
  invoiceType: string;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate?: Date;
  partyId: string;
  items: BaseInvoiceItem[];
  notes?: string;
}

export function useInvoiceSave() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const saveInvoice = async ({
    invoiceType,
    invoiceNumber,
    invoiceDate,
    dueDate,
    partyId,
    items,
    notes,
  }: SaveInvoiceParams) => {
    if (!user) {
      toast.error("Please login to save");
      return null;
    }

    if (!partyId) {
      toast.error("Please select a party");
      return null;
    }

    const validItems = items.filter((item) => item.itemId);
    if (validItems.length === 0) {
      toast.error("Please add at least one item");
      return null;
    }

    // Validate that all items have quantity > 0
    for (const item of validItems) {
      if (item.quantity <= 0) {
        toast.error(`Quantity must be greater than 0 for "${item.name || 'selected item'}"`);
        return null;
      }
    }

    // Stock validation for sale invoices
    if (invoiceType === "sale_invoice") {
      for (const item of validItems) {
        const { data: itemData } = await supabase
          .from("items")
          .select("current_stock, name")
          .eq("id", item.itemId)
          .single();
        
        if (itemData && item.quantity > (itemData.current_stock || 0)) {
          toast.error(`Insufficient stock for "${itemData.name}". Available: ${itemData.current_stock || 0}, Requested: ${item.quantity}`);
          return null;
        }
      }
    }

    setLoading(true);
    try {
      // Get business settings for TCS
      const { data: settings } = await supabase
        .from("business_settings")
        .select("enable_tcs, tcs_percent")
        .eq("user_id", user.id)
        .maybeSingle();

      // Calculate totals
      let subtotal = 0;
      let taxAmount = 0;
      let discountAmount = 0;

      validItems.forEach((item) => {
        const itemSubtotal = item.quantity * item.rate;
        const itemDiscount = (itemSubtotal * item.discount) / 100;
        const taxableAmount = itemSubtotal - itemDiscount;
        const itemTax = (taxableAmount * item.taxRate) / 100;
        
        subtotal += itemSubtotal;
        discountAmount += itemDiscount;
        taxAmount += itemTax;
      });

      // Calculate TCS - applies to both sale and purchase invoices
      const useTcs = settings?.enable_tcs ?? false;
      const tcsRate = settings?.tcs_percent ?? 0;
      const taxableAmount = subtotal - discountAmount;
      const tcsAmount = useTcs && tcsRate > 0 
        ? ((taxableAmount + taxAmount) * tcsRate) / 100 
        : 0;

      const totalAmount = Math.round(taxableAmount + taxAmount + tcsAmount);

      // Determine which table to use based on invoice type
      const isSaleType = ["sale", "sale_invoice", "sale_return", "sale_order", "estimation", "proforma", "delivery_challan"].includes(invoiceType);
      const tableName = isSaleType ? "sale_invoices" : "purchase_invoices";

      // Insert invoice into appropriate table
      const { data: invoice, error: invoiceError } = await supabase
        .from(tableName)
        .insert({
          user_id: user.id,
          invoice_type: invoiceType,
          invoice_number: invoiceNumber,
          invoice_date: invoiceDate.toISOString().split("T")[0],
          due_date: dueDate ? dueDate.toISOString().split("T")[0] : null,
          party_id: partyId,
          subtotal,
          tax_amount: taxAmount,
          discount_amount: discountAmount,
          tcs_amount: tcsAmount,
          total_amount: totalAmount,
          balance_due: totalAmount,
          notes: notes || null,
          status: "unpaid",
        })
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      // Insert invoice items into the appropriate table
      const invoiceItems = validItems.map((item) => {
        const itemSubtotal = item.quantity * item.rate;
        const itemDiscount = (itemSubtotal * item.discount) / 100;
        const taxableAmount = itemSubtotal - itemDiscount;
        const itemTax = (taxableAmount * item.taxRate) / 100;

        const baseItem = {
          item_id: item.itemId,
          item_name: item.name,
          hsn_code: item.hsn || null,
          quantity: item.quantity,
          unit: item.unit,
          rate: item.rate,
          discount_percent: item.discount,
          discount_amount: itemDiscount,
          tax_rate: item.taxRate,
          tax_amount: itemTax,
          total: taxableAmount + itemTax,
        };

        return isSaleType 
          ? { ...baseItem, sale_invoice_id: invoice.id }
          : { ...baseItem, purchase_invoice_id: invoice.id };
      });

      // Use the appropriate items table
      const itemsTable = isSaleType ? "sale_invoice_items" : "purchase_invoice_items";
      const { error: itemsError } = await supabase
        .from(itemsTable)
        .insert(invoiceItems);

      if (itemsError) throw itemsError;

      // Update stock for sale invoices (deduct) and purchase invoices (add)
      if (invoiceType === "sale_invoice") {
        // Deduct stock for each item sold
        for (const item of validItems) {
          // Get current stock and calculate new value
          const { data: itemData } = await supabase
            .from("items")
            .select("current_stock")
            .eq("id", item.itemId)
            .single();
          
          if (itemData) {
            const newStock = Math.max(0, (itemData.current_stock || 0) - item.quantity);
            await supabase
              .from("items")
              .update({ current_stock: newStock })
              .eq("id", item.itemId);
          }
        }
      } else if (invoiceType === "purchase_bill") {
        // Add stock for each item purchased
        for (const item of validItems) {
          const { data: itemData } = await supabase
            .from("items")
            .select("current_stock")
            .eq("id", item.itemId)
            .single();
          
          if (itemData) {
            const newStock = (itemData.current_stock || 0) + item.quantity;
            await supabase
              .from("items")
              .update({ current_stock: newStock })
              .eq("id", item.itemId);
          }
        }
      }

      const displayType = invoiceType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      toast.success(`${displayType} saved successfully!`);
      return invoice;
    } catch (error: any) {
      toast.error(error.message || "Failed to save");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { saveInvoice, loading };
}
