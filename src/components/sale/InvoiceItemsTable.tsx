import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useBusinessSettings } from "@/contexts/BusinessContext";

export interface InvoiceItem {
  id: number;
  itemId: string;
  name: string;
  hsn: string;
  quantity: number;
  availableStock: number;
  closingStock: number;
  unit: string;
  rate: number;
  discount: number;
  taxRate: number;
  amount: number;
}

interface InvoiceItemsTableProps {
  items: InvoiceItem[];
  onItemsChange: (items: InvoiceItem[]) => void;
}

interface DbItem {
  id: string;
  name: string;
  hsn_code: string | null;
  sale_price: number | null;
  current_stock: number | null;
  unit: string | null;
  tax_rate: number | null;
}

export function InvoiceItemsTable({ items, onItemsChange }: InvoiceItemsTableProps) {
  const { user } = useAuth();
  const { businessSettings } = useBusinessSettings();
  const defaultTaxRate = businessSettings?.default_tax_rate ?? 0;
  const [dbItems, setDbItems] = useState<DbItem[]>([]);

  useEffect(() => {
    if (user) {
      fetchItems();
    }
  }, [user]);

  const fetchItems = async () => {
    const { data } = await supabase
      .from("items")
      .select("id, name, hsn_code, sale_price, current_stock, unit, tax_rate")
      .eq("is_deleted", false)
      .order("name");
    if (data) {
      setDbItems(data);
    }
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now(),
      itemId: "",
      name: "",
      hsn: "",
      quantity: 1,
      availableStock: 0,
      closingStock: 0,
      unit: "pcs",
      rate: 0,
      discount: 0,
      taxRate: defaultTaxRate,
      amount: 0,
    };
    onItemsChange([...items, newItem]);
  };

  const updateItem = (id: number, field: keyof InvoiceItem, value: string | number) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // If item selection changed, update related fields
        if (field === "itemId") {
          const selectedItem = dbItems.find((i) => i.id === value);
          if (selectedItem) {
            updatedItem.name = selectedItem.name;
            updatedItem.hsn = selectedItem.hsn_code || "";
            updatedItem.rate = selectedItem.sale_price || 0;
            updatedItem.availableStock = selectedItem.current_stock || 0;
            // Default closing stock = available stock (no sale yet), quantity = 0
            updatedItem.closingStock = selectedItem.current_stock || 0;
            updatedItem.quantity = 0;
            updatedItem.unit = selectedItem.unit || "pcs";
            // Always use the app default GST (from Settings) when creating invoices
            updatedItem.taxRate = defaultTaxRate;
          }
        }
        
        // When closing stock changes, calculate quantity = available - closing
        if (field === "closingStock") {
          const closingVal = Math.max(0, Math.min(value as number, updatedItem.availableStock));
          updatedItem.closingStock = closingVal;
          updatedItem.quantity = Math.max(0, updatedItem.availableStock - closingVal);
        }
        
        // Recalculate amount (without item-level tax - tax on subtotal)
        const subtotal = updatedItem.quantity * updatedItem.rate;
        const discountAmount = (subtotal * updatedItem.discount) / 100;
        updatedItem.amount = subtotal - discountAmount;
        
        return updatedItem;
      }
      return item;
    });
    onItemsChange(updated);
  };

  const removeItem = (id: number) => {
    onItemsChange(items.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 font-medium text-muted-foreground">#</th>
              <th className="text-left py-3 px-2 font-medium text-muted-foreground min-w-[200px]">Item</th>
              <th className="text-left py-3 px-2 font-medium text-muted-foreground">HSN</th>
              <th className="text-left py-3 px-2 font-medium text-muted-foreground">Avl. Stock</th>
              <th className="text-left py-3 px-2 font-medium text-muted-foreground">Cls. Stock</th>
              <th className="text-left py-3 px-2 font-medium text-muted-foreground">Sale Qty</th>
              <th className="text-left py-3 px-2 font-medium text-muted-foreground">Unit</th>
              <th className="text-left py-3 px-2 font-medium text-muted-foreground">Rate</th>
              <th className="text-left py-3 px-2 font-medium text-muted-foreground">Disc %</th>
              <th className="text-right py-3 px-2 font-medium text-muted-foreground">Amount</th>
              <th className="py-3 px-2"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id} className="border-b border-border/50">
                <td className="py-2 px-2 text-muted-foreground">{index + 1}</td>
                <td className="py-2 px-2">
                  <Select
                    value={item.itemId}
                    onValueChange={(value) => updateItem(item.id, "itemId", value)}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select item" />
                    </SelectTrigger>
                    <SelectContent>
                      {dbItems.map((si) => (
                        <SelectItem key={si.id} value={si.id}>
                          {si.name}
                        </SelectItem>
                      ))}
                      {dbItems.length === 0 && (
                        <div className="py-2 px-3 text-sm text-muted-foreground">
                          No items found. Add items first.
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </td>
                <td className="py-2 px-2">
                  <Input
                    value={item.hsn}
                    onChange={(e) => updateItem(item.id, "hsn", e.target.value)}
                    className="h-9 w-20"
                  />
                </td>
                <td className="py-2 px-2 text-center">
                  <span className="text-muted-foreground font-medium">
                    {item.availableStock}
                  </span>
                </td>
                <td className="py-2 px-2">
                  <Input
                    type="number"
                    value={item.closingStock}
                    onChange={(e) => updateItem(item.id, "closingStock", Number(e.target.value))}
                    className="h-9 w-20"
                    min={0}
                    max={item.availableStock}
                  />
                </td>
                <td className="py-2 px-2 text-center">
                  <span className={item.quantity > 0 ? "text-primary font-medium" : "text-muted-foreground"}>
                    {item.quantity}
                  </span>
                </td>
                <td className="py-2 px-2">
                  <Select
                    value={item.unit || "Bottles"}
                    onValueChange={(value) => updateItem(item.id, "unit", value)}
                  >
                    <SelectTrigger className="h-9 w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bottles">Bottles</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="py-2 px-2">
                  <Input
                    type="number"
                    value={item.rate}
                    onChange={(e) => updateItem(item.id, "rate", Number(e.target.value))}
                    className="h-9 w-24"
                    min={0}
                  />
                </td>
                <td className="py-2 px-2">
                  <Input
                    type="number"
                    value={item.discount}
                    onChange={(e) => updateItem(item.id, "discount", Number(e.target.value))}
                    className="h-9 w-16"
                    min={0}
                    max={100}
                  />
                </td>
                <td className="py-2 px-2 text-right font-medium">
                  ₹{item.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </td>
                <td className="py-2 px-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button variant="outline" onClick={addItem} className="gap-2">
        <Plus className="w-4 h-4" />
        Add Item
      </Button>
    </div>
  );
}
