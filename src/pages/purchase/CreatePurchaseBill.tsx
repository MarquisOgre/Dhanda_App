import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Printer, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PartySelector } from "@/components/sale/PartySelector";
import { PurchaseInvoiceItemsTable, PurchaseInvoiceItem } from "@/components/purchase/PurchaseInvoiceItemsTable";
import { TaxSummary } from "@/components/sale/TaxSummary";
import { InvoicePreview } from "@/components/sale/InvoicePreview";
import { useInvoiceSave } from "@/hooks/useInvoiceSave";
import { useAuth } from "@/contexts/AuthContext";
import { useBusinessSettings } from "@/contexts/BusinessContext";
import { supabase } from "@/integrations/supabase/client";
import { addDays, format } from "date-fns";

export default function CreatePurchaseBill() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { businessSettings } = useBusinessSettings();
  const { saveInvoice, loading } = useInvoiceSave();
  
  const today = new Date();
  const [billNumber, setBillNumber] = useState("");
  const [billDate, setBillDate] = useState(format(today, "yyyy-MM-dd"));
  const [dueDate, setDueDate] = useState(format(addDays(today, 30), "yyyy-MM-dd"));
  const [selectedParty, setSelectedParty] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [items, setItems] = useState<PurchaseInvoiceItem[]>([
    { id: 1, itemId: "", name: "", hsn: "", quantity: 1, unit: "Bottles", rate: 0, discount: 0, taxRate: 0, amount: 0 },
  ]);
  const [notes, setNotes] = useState("");

  // Generate bill number on mount
  useEffect(() => {
    if (user) {
      generateBillNumber();
    }
  }, [user]);

  // Update due date when bill date changes
  useEffect(() => {
    if (billDate) {
      const newDueDate = addDays(new Date(billDate), businessSettings?.default_payment_terms || 30);
      setDueDate(format(newDueDate, "yyyy-MM-dd"));
    }
  }, [billDate, businessSettings?.default_payment_terms]);

  const generateBillNumber = async () => {
    try {
      const prefix = businessSettings?.purchase_prefix || "PUR-";
      
      // Get the highest invoice number from purchase_invoices
      const { data: existingInvoices } = await supabase
        .from("purchase_invoices")
        .select("invoice_number")
        .ilike("invoice_number", `${prefix}%`)
        .order("created_at", { ascending: false })
        .limit(1);

      let nextNumber = 1;
      if (existingInvoices && existingInvoices.length > 0) {
        const lastInvoice = existingInvoices[0].invoice_number;
        const lastNumber = parseInt(lastInvoice.replace(prefix, "")) || 0;
        nextNumber = lastNumber + 1;
      }

      setBillNumber(`${prefix}${nextNumber.toString().padStart(3, "0")}`);
    } catch (error) {
      console.error("Error generating bill number:", error);
      setBillNumber("PUR-001");
    }
  };

  const handleSave = async () => {
    const result = await saveInvoice({
      invoiceType: "purchase_bill",
      invoiceNumber: billNumber,
      invoiceDate: new Date(billDate),
      dueDate: dueDate ? new Date(dueDate) : undefined,
      partyId: selectedParty,
      items,
      notes,
    });

    if (result) {
      navigate("/purchase/bills");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/purchase/bills">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">New Purchase Invoice</h1>
            <p className="text-muted-foreground">Create a new purchase invoice</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2" onClick={() => setShowPreview(true)}>
            <Printer className="w-4 h-4" />
            Preview
          </Button>
          <Button className="btn-gradient gap-2" onClick={handleSave} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Bill
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bill Details */}
          <div className="metric-card">
            <h3 className="font-semibold mb-4">Bill Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="billNo">Bill Number</Label>
                <Input id="billNo" value={billNumber} onChange={(e) => setBillNumber(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billDate">Bill Date</Label>
                <Input
                  id="billDate"
                  type="date"
                  value={billDate}
                  onChange={(e) => setBillDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Supplier Selection */}
          <div className="metric-card">
            <h3 className="font-semibold mb-4">Supplier Details</h3>
            <PartySelector
              value={selectedParty}
              onChange={setSelectedParty}
              partyType="supplier"
              label="Select Supplier"
            />
          </div>

          {/* Items Table */}
          <div className="metric-card">
            <h3 className="font-semibold mb-4">Items</h3>
            <PurchaseInvoiceItemsTable items={items} onItemsChange={setItems} />
          </div>

          {/* Notes */}
          <div className="metric-card">
            <h3 className="font-semibold mb-4">Notes</h3>
            <Textarea
              placeholder="Add any notes or terms..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          <TaxSummary items={items} invoiceType="purchase" />
        </div>
      </div>

      {/* Invoice Preview Dialog */}
      <InvoicePreview
        open={showPreview}
        onOpenChange={setShowPreview}
        documentType="Purchase Invoice"
        documentNumber={billNumber}
        date={billDate}
        partyId={selectedParty}
        items={items}
        notes={notes}
      />
    </div>
  );
}
