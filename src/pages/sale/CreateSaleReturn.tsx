import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Eye, Calendar, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { PartySelector } from "@/components/sale/PartySelector";
import { InvoiceItemsTable, type InvoiceItem } from "@/components/sale/InvoiceItemsTable";
import { TaxSummary } from "@/components/sale/TaxSummary";
import { InvoicePreview } from "@/components/sale/InvoicePreview";
import { useToast } from "@/hooks/use-toast";

const originalInvoices = [
  { id: "INV-001", date: "02 Jan 2026", party: "Rahul Electronics", amount: 45000 },
  { id: "INV-004", date: "30 Dec 2025", party: "Global Systems", amount: 125000 },
  { id: "INV-005", date: "28 Dec 2025", party: "Tech Solutions", amount: 67500 },
];

export default function CreateSaleReturn() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [creditNoteNumber, setCreditNoteNumber] = useState("CN-001");
  const [creditNoteDate, setCreditNoteDate] = useState<Date>(new Date());
  const [originalInvoice, setOriginalInvoice] = useState("");
  const [returnReason, setReturnReason] = useState("");
  const [selectedParty, setSelectedParty] = useState("");
  const [notes, setNotes] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: 1, itemId: "", name: "", hsn: "", quantity: 1, unit: "pcs", rate: 0, discount: 0, taxRate: 18, amount: 0 },
  ]);

  const handleSave = () => {
    if (!selectedParty) {
      toast({ title: "Error", description: "Please select a party", variant: "destructive" });
      return;
    }
    if (items.filter((i) => i.itemId).length === 0) {
      toast({ title: "Error", description: "Please add at least one item", variant: "destructive" });
      return;
    }
    toast({ title: "Success", description: "Credit Note created successfully!" });
    navigate("/sale/return");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/sale/return"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-6 h-6 text-destructive" />
              <h1 className="text-2xl font-bold">Sale Return / Credit Note</h1>
            </div>
            <p className="text-muted-foreground">Create credit note for returned goods</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPreview(true)} className="gap-2">
            <Eye className="w-4 h-4" />Preview
          </Button>
          <Button onClick={handleSave} className="btn-gradient gap-2">
            <Save className="w-4 h-4" />Save Credit Note
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="metric-card">
            <h2 className="text-lg font-semibold mb-4">Credit Note Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Credit Note Number</Label>
                <Input value={creditNoteNumber} onChange={(e) => setCreditNoteNumber(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <Calendar className="mr-2 h-4 w-4" />{format(creditNoteDate, "dd MMM yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent mode="single" selected={creditNoteDate} onSelect={(d) => d && setCreditNoteDate(d)} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Original Invoice</Label>
                <Select value={originalInvoice} onValueChange={setOriginalInvoice}>
                  <SelectTrigger><SelectValue placeholder="Select invoice" /></SelectTrigger>
                  <SelectContent>
                    {originalInvoices.map((inv) => (
                      <SelectItem key={inv.id} value={inv.id}>
                        {inv.id} - {inv.party}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <h2 className="text-lg font-semibold mb-4">Return Reason</h2>
            <div className="space-y-2">
              <Label>Reason for Return</Label>
              <Select value={returnReason} onValueChange={setReturnReason}>
                <SelectTrigger><SelectValue placeholder="Select reason" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="defective">Defective Product</SelectItem>
                  <SelectItem value="wrong-item">Wrong Item Delivered</SelectItem>
                  <SelectItem value="damaged">Damaged in Transit</SelectItem>
                  <SelectItem value="quality">Quality Issue</SelectItem>
                  <SelectItem value="excess">Excess Quantity</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="metric-card">
            <h2 className="text-lg font-semibold mb-4">Customer Details</h2>
            <PartySelector value={selectedParty} onChange={setSelectedParty} partyType="customer" />
          </div>

          <div className="metric-card">
            <h2 className="text-lg font-semibold mb-4">Returned Items</h2>
            <InvoiceItemsTable items={items} onItemsChange={setItems} />
          </div>

          <div className="metric-card">
            <h2 className="text-lg font-semibold mb-4">Additional Notes</h2>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add notes about the return..." rows={3} />
          </div>
        </div>

        <div className="metric-card sticky top-6 h-fit">
          <h2 className="text-lg font-semibold mb-4">Credit Note Summary</h2>
          <TaxSummary items={items} />
          <div className="mt-4 p-3 bg-destructive/10 rounded-lg">
            <p className="text-sm text-destructive font-medium">This amount will be credited to the customer's account</p>
          </div>
        </div>
      </div>

      <InvoicePreview open={showPreview} onOpenChange={setShowPreview} documentType="Credit Note" documentNumber={creditNoteNumber} date={format(creditNoteDate, "dd MMM yyyy")} partyId={selectedParty} items={items} notes={notes} />
    </div>
  );
}
