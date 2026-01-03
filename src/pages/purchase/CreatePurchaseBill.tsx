import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Save, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PartySelector } from "@/components/sale/PartySelector";
import { InvoiceItemsTable, InvoiceItem } from "@/components/sale/InvoiceItemsTable";
import { TaxSummary } from "@/components/sale/TaxSummary";
import { InvoicePreview } from "@/components/sale/InvoicePreview";

export default function CreatePurchaseBill() {
  const [billNumber] = useState("PUR-043");
  const [billDate, setBillDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedParty, setSelectedParty] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: 1, itemId: "", name: "", hsn: "", quantity: 1, unit: "pcs", rate: 0, discount: 0, taxRate: 18, amount: 0 },
  ]);
  const [notes, setNotes] = useState("");

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
            <h1 className="text-2xl font-bold">New Purchase Bill</h1>
            <p className="text-muted-foreground">Create a new purchase bill</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2" onClick={() => setShowPreview(true)}>
            <Printer className="w-4 h-4" />
            Preview
          </Button>
          <Button className="btn-gradient gap-2">
            <Save className="w-4 h-4" />
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
                <Input id="billNo" value={billNumber} readOnly className="bg-muted" />
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
                <Input id="dueDate" type="date" />
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
            <InvoiceItemsTable items={items} onItemsChange={setItems} />
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
          <TaxSummary items={items} />
        </div>
      </div>

      {/* Invoice Preview Dialog */}
      <InvoicePreview
        open={showPreview}
        onOpenChange={setShowPreview}
        documentType="Purchase Bill"
        documentNumber={billNumber}
        date={billDate}
        partyId={selectedParty}
        items={items}
        notes={notes}
      />
    </div>
  );
}
