import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Eye, Calendar, ClipboardList, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { PartySelector } from "@/components/sale/PartySelector";
import { SaleInvoiceItemsTable, type InvoiceItem } from "@/components/sale/SaleInvoiceItemsTable";
import { TaxSummary } from "@/components/sale/TaxSummary";
import { InvoicePreview } from "@/components/sale/InvoicePreview";
import { useInvoiceSave } from "@/hooks/useInvoiceSave";

export default function CreateSaleOrder() {
  const navigate = useNavigate();
  const { saveInvoice, loading } = useInvoiceSave();
  
  const [orderNumber, setOrderNumber] = useState("SO-001");
  const [orderDate, setOrderDate] = useState<Date>(new Date());
  const [deliveryDate, setDeliveryDate] = useState<Date>(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const [selectedParty, setSelectedParty] = useState("");
  const [notes, setNotes] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: 1, itemId: "", name: "", hsn: "", quantity: 1, availableStock: 0, closingStock: 0, unit: "pcs", rate: 0, discount: 0, taxRate: 0, amount: 0 },
  ]);

  const handleSave = async () => {
    const result = await saveInvoice({
      invoiceType: "sale_order",
      invoiceNumber: orderNumber,
      invoiceDate: orderDate,
      dueDate: deliveryDate,
      partyId: selectedParty,
      items,
      notes,
    });

    if (result) {
      navigate("/sale/order");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/sale/order"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <ClipboardList className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold">Create Sale Order</h1>
            </div>
            <p className="text-muted-foreground">Create a new sales order from customer</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPreview(true)} className="gap-2">
            <Eye className="w-4 h-4" />Preview
          </Button>
          <Button onClick={handleSave} className="btn-gradient gap-2" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Order
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="metric-card">
            <h2 className="text-lg font-semibold mb-4">Order Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Order Number</Label>
                <Input value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Order Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <Calendar className="mr-2 h-4 w-4" />{format(orderDate, "dd MMM yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent mode="single" selected={orderDate} onSelect={(d) => d && setOrderDate(d)} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Expected Delivery</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <Calendar className="mr-2 h-4 w-4" />{format(deliveryDate, "dd MMM yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent mode="single" selected={deliveryDate} onSelect={(d) => d && setDeliveryDate(d)} initialFocus />
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
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            <SaleInvoiceItemsTable items={items} onItemsChange={setItems} />
          </div>

          <div className="metric-card">
            <h2 className="text-lg font-semibold mb-4">Terms & Notes</h2>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add order terms or notes..." rows={3} />
          </div>
        </div>

        <div className="metric-card sticky top-6 h-fit">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <TaxSummary items={items} />
        </div>
      </div>

      <InvoicePreview open={showPreview} onOpenChange={setShowPreview} documentType="Sale Order" documentNumber={orderNumber} date={format(orderDate, "dd MMM yyyy")} dueDate={format(deliveryDate, "dd MMM yyyy")} partyId={selectedParty} items={items} notes={notes} />
    </div>
  );
}
