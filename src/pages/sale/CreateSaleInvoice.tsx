import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Eye, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { PartySelector } from "@/components/sale/PartySelector";
import { InvoiceItemsTable, type InvoiceItem } from "@/components/sale/InvoiceItemsTable";
import { TaxSummary } from "@/components/sale/TaxSummary";
import { InvoicePreview } from "@/components/sale/InvoicePreview";
import { useInvoiceSave } from "@/hooks/useInvoiceSave";

export default function CreateSaleInvoice() {
  const navigate = useNavigate();
  const { saveInvoice, loading } = useInvoiceSave();
  
  const [invoiceNumber, setInvoiceNumber] = useState("INV-006");
  const [invoiceDate, setInvoiceDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date>(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
  const [selectedParty, setSelectedParty] = useState("");
  const [notes, setNotes] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: 1,
      itemId: "",
      name: "",
      hsn: "",
      quantity: 1,
      unit: "pcs",
      rate: 0,
      discount: 0,
      taxRate: 18,
      amount: 0,
    },
  ]);

  const handleSave = async () => {
    const result = await saveInvoice({
      invoiceType: "sale_invoice",
      invoiceNumber,
      invoiceDate,
      dueDate,
      partyId: selectedParty,
      items,
      notes,
    });

    if (result) {
      navigate("/sale/invoices");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/sale/invoices">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create Sale Invoice</h1>
            <p className="text-muted-foreground">Generate a new tax invoice for your customer</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPreview(true)} className="gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </Button>
          <Button onClick={handleSave} className="btn-gradient gap-2" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Details */}
          <div className="metric-card">
            <h2 className="text-lg font-semibold mb-4">Invoice Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Invoice Number</Label>
                <Input
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="INV-001"
                />
              </div>
              <div className="space-y-2">
                <Label>Invoice Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !invoiceDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {invoiceDate ? format(invoiceDate, "dd MMM yyyy") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={invoiceDate}
                      onSelect={(date) => date && setInvoiceDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dueDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, "dd MMM yyyy") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={dueDate}
                      onSelect={(date) => date && setDueDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Party Selection */}
          <div className="metric-card">
            <h2 className="text-lg font-semibold mb-4">Customer Details</h2>
            <PartySelector
              value={selectedParty}
              onChange={setSelectedParty}
              partyType="customer"
              label="Select Customer"
            />
          </div>

          {/* Items */}
          <div className="metric-card">
            <h2 className="text-lg font-semibold mb-4">Invoice Items</h2>
            <InvoiceItemsTable items={items} onItemsChange={setItems} />
          </div>

          {/* Notes */}
          <div className="metric-card">
            <h2 className="text-lg font-semibold mb-4">Additional Notes</h2>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter any notes or terms & conditions..."
              rows={3}
            />
          </div>
        </div>

        {/* Sidebar - Tax Summary */}
        <div className="space-y-6">
          <div className="metric-card sticky top-6">
            <h2 className="text-lg font-semibold mb-4">Invoice Summary</h2>
            <TaxSummary items={items} />
          </div>
        </div>
      </div>

      {/* Preview Dialog */}
      <InvoicePreview
        open={showPreview}
        onOpenChange={setShowPreview}
        documentType="Tax Invoice"
        documentNumber={invoiceNumber}
        date={format(invoiceDate, "dd MMM yyyy")}
        dueDate={format(dueDate, "dd MMM yyyy")}
        partyId={selectedParty}
        items={items}
        notes={notes}
      />
    </div>
  );
}
