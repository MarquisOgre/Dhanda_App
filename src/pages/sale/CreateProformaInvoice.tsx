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
import { PartySelector } from "@/components/sale/PartySelector";
import { InvoiceItemsTable, type InvoiceItem } from "@/components/sale/InvoiceItemsTable";
import { TaxSummary } from "@/components/sale/TaxSummary";
import { InvoicePreview } from "@/components/sale/InvoicePreview";
import { useInvoiceSave } from "@/hooks/useInvoiceSave";

export default function CreateProformaInvoice() {
  const navigate = useNavigate();
  const { saveInvoice, loading } = useInvoiceSave();
  
  const [proformaNumber, setProformaNumber] = useState("PI-001");
  const [proformaDate, setProformaDate] = useState<Date>(new Date());
  const [validUntil, setValidUntil] = useState<Date>(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
  const [selectedParty, setSelectedParty] = useState("");
  const [notes, setNotes] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: 1, itemId: "", name: "", hsn: "", quantity: 1, unit: "pcs", rate: 0, discount: 0, taxRate: 18, amount: 0 },
  ]);

  const handleSave = async () => {
    const result = await saveInvoice({
      invoiceType: "proforma_invoice",
      invoiceNumber: proformaNumber,
      invoiceDate: proformaDate,
      dueDate: validUntil,
      partyId: selectedParty,
      items,
      notes,
    });

    if (result) {
      navigate("/sale/proforma");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/sale/proforma"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create Proforma Invoice</h1>
            <p className="text-muted-foreground">Generate a preliminary invoice before final sale</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPreview(true)} className="gap-2">
            <Eye className="w-4 h-4" />Preview
          </Button>
          <Button onClick={handleSave} className="btn-gradient gap-2" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="metric-card">
            <h2 className="text-lg font-semibold mb-4">Proforma Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Proforma Number</Label>
                <Input value={proformaNumber} onChange={(e) => setProformaNumber(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <Calendar className="mr-2 h-4 w-4" />{format(proformaDate, "dd MMM yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent mode="single" selected={proformaDate} onSelect={(d) => d && setProformaDate(d)} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Valid Until</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <Calendar className="mr-2 h-4 w-4" />{format(validUntil, "dd MMM yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent mode="single" selected={validUntil} onSelect={(d) => d && setValidUntil(d)} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <h2 className="text-lg font-semibold mb-4">Customer Details</h2>
            <PartySelector value={selectedParty} onChange={setSelectedParty} partyType="customer" />
          </div>

          <div className="metric-card">
            <h2 className="text-lg font-semibold mb-4">Items</h2>
            <InvoiceItemsTable items={items} onItemsChange={setItems} />
          </div>

          <div className="metric-card">
            <h2 className="text-lg font-semibold mb-4">Notes</h2>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add notes or terms..." rows={3} />
          </div>
        </div>

        <div className="metric-card sticky top-6 h-fit">
          <h2 className="text-lg font-semibold mb-4">Summary</h2>
          <TaxSummary items={items} />
        </div>
      </div>

      <InvoicePreview open={showPreview} onOpenChange={setShowPreview} documentType="Proforma Invoice" documentNumber={proformaNumber} date={format(proformaDate, "dd MMM yyyy")} dueDate={format(validUntil, "dd MMM yyyy")} partyId={selectedParty} items={items} notes={notes} />
    </div>
  );
}
