import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Save, Printer, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PartySelector } from "@/components/sale/PartySelector";
import { InvoiceItemsTable, InvoiceItem } from "@/components/sale/InvoiceItemsTable";
import { TaxSummary } from "@/components/sale/TaxSummary";
import { InvoicePreview } from "@/components/sale/InvoicePreview";

export default function CreatePurchaseOrder() {
  const [orderNumber] = useState("PO-028");
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split("T")[0]);
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
            <Link to="/purchase/order">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">New Purchase Order</h1>
            <p className="text-muted-foreground">Create a purchase order for supplier</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2" onClick={() => setShowPreview(true)}>
            <Printer className="w-4 h-4" />
            Preview
          </Button>
          <Button variant="outline" className="gap-2">
            <Send className="w-4 h-4" />
            Send to Supplier
          </Button>
          <Button className="btn-gradient gap-2">
            <Save className="w-4 h-4" />
            Save Order
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Details */}
          <div className="metric-card">
            <h3 className="font-semibold mb-4">Order Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="orderNo">Order Number</Label>
                <Input id="orderNo" value={orderNumber} readOnly className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orderDate">Order Date</Label>
                <Input
                  id="orderDate"
                  type="date"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryDate">Expected Delivery</Label>
                <Input id="deliveryDate" type="date" />
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

          {/* Terms & Notes */}
          <div className="metric-card">
            <h3 className="font-semibold mb-4">Terms & Notes</h3>
            <Textarea
              placeholder="Add terms, conditions, or notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          <TaxSummary items={items} />
          
          <div className="metric-card">
            <h3 className="font-semibold mb-4">Order Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm">Status</span>
                <span className="text-sm font-medium text-yellow-500">Draft</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm">Supplier Confirmed</span>
                <span className="text-sm font-medium text-muted-foreground">Pending</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Preview Dialog */}
      <InvoicePreview
        open={showPreview}
        onOpenChange={setShowPreview}
        documentType="Purchase Order"
        documentNumber={orderNumber}
        date={orderDate}
        partyId={selectedParty}
        items={items}
        notes={notes}
      />
    </div>
  );
}
