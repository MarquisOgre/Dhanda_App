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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const originalBills = [
  { id: "PUR-042", party: "Metro Suppliers", date: "02 Jan 2026", amount: 28500 },
  { id: "PUR-041", party: "ABC Wholesalers", date: "01 Jan 2026", amount: 65200 },
  { id: "PUR-040", party: "Tech Distributors", date: "30 Dec 2025", amount: 125000 },
];

export default function CreatePurchaseReturn() {
  const [returnNumber] = useState("PR-008");
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedParty, setSelectedParty] = useState("");
  const [originalBill, setOriginalBill] = useState("");
  const [returnReason, setReturnReason] = useState("");
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
            <Link to="/purchase/return">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Purchase Return / Debit Note</h1>
            <p className="text-muted-foreground">Create a return for purchased items</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2" onClick={() => setShowPreview(true)}>
            <Printer className="w-4 h-4" />
            Preview
          </Button>
          <Button className="btn-gradient gap-2">
            <Save className="w-4 h-4" />
            Save Return
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Return Details */}
          <div className="metric-card">
            <h3 className="font-semibold mb-4">Return Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="returnNo">Debit Note No.</Label>
                <Input id="returnNo" value={returnNumber} readOnly className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="returnDate">Return Date</Label>
                <Input
                  id="returnDate"
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Original Bill</Label>
                <Select value={originalBill} onValueChange={setOriginalBill}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select original bill" />
                  </SelectTrigger>
                  <SelectContent>
                    {originalBills.map((bill) => (
                      <SelectItem key={bill.id} value={bill.id}>
                        {bill.id} - {bill.party}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

          {/* Return Reason */}
          <div className="metric-card">
            <h3 className="font-semibold mb-4">Return Reason</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Reason</Label>
                <Select value={returnReason} onValueChange={setReturnReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="defective">Defective Product</SelectItem>
                    <SelectItem value="wrong">Wrong Item Received</SelectItem>
                    <SelectItem value="damaged">Damaged in Transit</SelectItem>
                    <SelectItem value="quality">Quality Issues</SelectItem>
                    <SelectItem value="excess">Excess Quantity</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="metric-card">
            <h3 className="font-semibold mb-4">Return Items</h3>
            <InvoiceItemsTable items={items} onItemsChange={setItems} />
          </div>

          {/* Notes */}
          <div className="metric-card">
            <h3 className="font-semibold mb-4">Notes</h3>
            <Textarea
              placeholder="Add any notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          <TaxSummary items={items} />

          <div className="metric-card bg-warning/10 border-warning/20">
            <h3 className="font-semibold mb-2 text-warning">Debit Note</h3>
            <p className="text-sm text-muted-foreground">
              This debit note will reduce your payable amount to the supplier.
            </p>
          </div>
        </div>
      </div>

      {/* Invoice Preview Dialog */}
      <InvoicePreview
        open={showPreview}
        onOpenChange={setShowPreview}
        documentType="Purchase Return / Debit Note"
        documentNumber={returnNumber}
        date={returnDate}
        partyId={selectedParty}
        items={items}
        notes={notes}
      />
    </div>
  );
}
