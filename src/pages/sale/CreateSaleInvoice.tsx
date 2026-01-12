import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Eye, Calendar, Loader2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { PartySelector } from "@/components/sale/PartySelector";
import { SaleInvoiceItemsTable, type InvoiceItem } from "@/components/sale/SaleInvoiceItemsTable";
import { TaxSummary } from "@/components/sale/TaxSummary";
import { InvoicePreview } from "@/components/sale/InvoicePreview";
import { useInvoiceSave } from "@/hooks/useInvoiceSave";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CreateSaleInvoice() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { saveInvoice, loading } = useInvoiceSave();
  
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date>(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
  const [selectedParty, setSelectedParty] = useState("");
  const [notes, setNotes] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [paymentMode, setPaymentMode] = useState<string>("");
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  // Generate next invoice number on mount
  useEffect(() => {
    const generateInvoiceNumber = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from("sale_invoices")
        .select("invoice_number")
        .eq("user_id", user.id)
        .eq("invoice_type", "sale_invoice")
        .order("created_at", { ascending: false })
        .limit(1);
      
      if (data && data.length > 0) {
        const lastNumber = data[0].invoice_number;
        const match = lastNumber.match(/(\d+)$/);
        if (match) {
          const nextNum = parseInt(match[1]) + 1;
          const prefix = lastNumber.replace(/\d+$/, "");
          setInvoiceNumber(`${prefix}${String(nextNum).padStart(3, "0")}`);
        } else {
          setInvoiceNumber("INV-001");
        }
      } else {
        setInvoiceNumber("INV-001");
      }
    };
    
    generateInvoiceNumber();
  }, [user]);
  
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: 1,
      itemId: "",
      name: "",
      hsn: "",
      quantity: 1,
      availableStock: 0,
      closingStock: 0,
      unit: "pcs",
      rate: 0,
      discount: 0,
      taxRate: 0,
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
            <h2 className="text-lg font-semibold mb-4">Sales Invoice Details</h2>
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
            <h2 className="text-lg font-semibold mb-4">Sales Invoice Items</h2>
            <SaleInvoiceItemsTable items={items} onItemsChange={setItems} />
          </div>

          {/* Payment */}
          <div className="metric-card">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment (Optional)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Payment Mode</Label>
                <Select value={paymentMode} onValueChange={setPaymentMode}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Payment</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Payment Amount</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  disabled={!paymentMode || paymentMode === "none"}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              If payment is received, select the mode and enter amount. Leave empty for credit invoice.
            </p>
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
            <h2 className="text-lg font-semibold mb-4">Sales Invoice Summary</h2>
            <TaxSummary items={items} invoiceType="sale" paymentAmount={paymentAmount} />
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
