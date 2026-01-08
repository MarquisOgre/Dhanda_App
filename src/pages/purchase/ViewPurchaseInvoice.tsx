import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Download, Printer, Loader2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { format } from "date-fns";
import { useBusinessSettings } from "@/contexts/BusinessContext";
import { generateInvoicePDF } from "@/lib/invoicePdf";

interface InvoiceItem {
  id: string;
  item_name: string;
  quantity: number;
  rate: number;
  tax_rate: number | null;
  tax_amount: number | null;
  discount_amount: number | null;
  total: number;
  hsn_code: string | null;
  unit: string | null;
}

interface Invoice {
  id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string | null;
  total_amount: number | null;
  paid_amount: number | null;
  subtotal: number | null;
  tax_amount: number | null;
  discount_amount: number | null;
  status: string | null;
  notes: string | null;
  terms: string | null;
  party_id: string | null;
  parties?: {
    name: string;
    phone: string | null;
    email: string | null;
    billing_address: string | null;
    gstin: string | null;
  } | null;
}

export default function ViewPurchaseInvoice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { businessSettings: settings } = useBusinessSettings();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && id) {
      fetchInvoice();
    }
  }, [user, id]);

  const fetchInvoice = async () => {
    try {
      const { data: invoiceData, error: invoiceError } = await supabase
        .from("purchase_invoices")
        .select("*, parties(name, phone, email, billing_address, gstin)")
        .eq("id", id)
        .single();

      if (invoiceError) throw invoiceError;
      setInvoice(invoiceData as unknown as Invoice);

      // Fetch items linked to this purchase invoice
      const { data: itemsData } = await supabase
        .from("invoice_items")
        .select("*")
        .eq("purchase_invoice_id", id);

      setItems(itemsData || []);
    } catch (error: any) {
      toast.error("Failed to fetch invoice: " + error.message);
      navigate("/purchase/bills");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    if (!invoice) return;
    generateInvoicePDF({
      invoice,
      items,
      settings,
      type: "purchase",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Invoice not found</p>
        <Button asChild className="mt-4">
          <Link to="/purchase/bills">Back to Purchase Invoices</Link>
        </Button>
      </div>
    );
  }

  const subtotal = invoice.subtotal || 0;
  const taxAmount = invoice.tax_amount || 0;
  const discountAmount = invoice.discount_amount || 0;
  const paidAmount = invoice.paid_amount || 0;
  
  // Calculate TCS
  const useTcs = settings?.enable_tcs ?? false;
  const tcsRate = settings?.tcs_percent ?? 0;
  const tcsAmount = useTcs && tcsRate > 0 
    ? ((subtotal - discountAmount + taxAmount) * tcsRate) / 100 
    : 0;
  
  const totalAmount = (invoice.total_amount || 0);
  const balanceDue = totalAmount - paidAmount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/purchase/bills")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Purchase Invoice {invoice.invoice_number}</h1>
            <p className="text-muted-foreground">View invoice details</p>
          </div>
        </div>
        <div className="flex gap-2">
          {balanceDue > 0 && (
            <Button 
              variant="default" 
              className="bg-warning hover:bg-warning/90 text-warning-foreground"
              onClick={() => navigate(`/purchase/payment-out/new?invoice=${id}`)}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Record Payment
            </Button>
          )}
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" onClick={handleDownloadPDF}>
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button onClick={() => navigate(`/purchase/bills/${id}/edit`)}>
            Edit Invoice
          </Button>
        </div>
      </div>

      {/* Invoice Content */}
      <div className="metric-card p-8 print:shadow-none print:border-none">
        {/* Header Row: Business (Left) | Logo (Center) | Invoice Details (Right) */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* Left Column - Business Details */}
          <div className="flex flex-col justify-center">
            <h2 className="text-xl font-bold text-primary">{settings?.business_name || "Your Business"}</h2>
            {settings?.business_address && <p className="text-muted-foreground text-sm mt-1">{settings.business_address}</p>}
            {settings?.phone && <p className="text-muted-foreground text-sm">Phone: {settings.phone}</p>}
            {settings?.gstin && <p className="text-muted-foreground text-sm">GSTIN: {settings.gstin}</p>}
          </div>

          {/* Center Column - Logo */}
          <div className="flex items-center justify-center">
            {settings?.logo_url && (
              <img 
                src={settings.logo_url} 
                alt="Business Logo" 
                className="w-24 h-24 object-contain rounded-xl"
              />
            )}
          </div>

          {/* Right Column - Invoice Details */}
          <div className="flex flex-col justify-center text-right">
            <h3 className="text-lg font-bold mb-1">PURCHASE INVOICE</h3>
            <p className="text-muted-foreground text-sm">Invoice #: {invoice.invoice_number}</p>
            <p className="text-muted-foreground text-sm">
              Date: {format(new Date(invoice.invoice_date), "dd MMM yyyy")}
            </p>
            {invoice.due_date && (
              <p className="text-muted-foreground text-sm">
                Due Date: {format(new Date(invoice.due_date), "dd MMM yyyy")}
              </p>
            )}
          </div>
        </div>

        {/* Supplier Info */}
        <div className="mb-8 p-4 bg-muted/30 rounded-lg">
          <h4 className="font-semibold mb-2">Supplier:</h4>
          <p className="font-medium">{invoice.parties?.name || "Unknown Supplier"}</p>
          {invoice.parties?.billing_address && <p className="text-muted-foreground">{invoice.parties.billing_address}</p>}
          {invoice.parties?.phone && <p className="text-muted-foreground">Phone: {invoice.parties.phone}</p>}
          {invoice.parties?.email && <p className="text-muted-foreground">Email: {invoice.parties.email}</p>}
          {invoice.parties?.gstin && <p className="text-muted-foreground">GSTIN: {invoice.parties.gstin}</p>}
        </div>

        {/* Items Table */}
        <table className="w-full mb-8">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-2">#</th>
              <th className="text-left py-3 px-2">Item</th>
              <th className="text-left py-3 px-2">HSN</th>
              <th className="text-right py-3 px-2">Qty</th>
              <th className="text-right py-3 px-2">Rate</th>
              <th className="text-right py-3 px-2">Tax</th>
              <th className="text-right py-3 px-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id} className="border-b">
                <td className="py-3 px-2">{index + 1}</td>
                <td className="py-3 px-2">
                  <p className="font-medium">{item.item_name}</p>
                  {item.unit && <p className="text-xs text-muted-foreground">{item.unit}</p>}
                </td>
                <td className="py-3 px-2 text-muted-foreground">{item.hsn_code || "-"}</td>
                <td className="py-3 px-2 text-right">{item.quantity}</td>
                <td className="py-3 px-2 text-right">₹{item.rate.toLocaleString()}</td>
                <td className="py-3 px-2 text-right">
                  {item.tax_rate ? `${item.tax_rate}%` : "-"}
                  {item.tax_amount ? <span className="block text-xs text-muted-foreground">₹{item.tax_amount.toLocaleString()}</span> : null}
                </td>
                <td className="py-3 px-2 text-right font-medium">₹{item.total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-72 space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal:</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-success">
                <span>Discount:</span>
                <span>-₹{discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax:</span>
              <span>₹{taxAmount.toLocaleString()}</span>
            </div>
            {useTcs && tcsAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">TCS @ {tcsRate}%:</span>
                <span>₹{tcsAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total:</span>
              <span>₹{totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-success">
              <span>Paid:</span>
              <span>₹{paidAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-destructive border-t pt-2">
              <span>Balance Due:</span>
              <span>₹{balanceDue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Notes & Terms */}
        {(invoice.notes || invoice.terms) && (
          <div className="mt-8 pt-8 border-t grid grid-cols-2 gap-8">
            {invoice.notes && (
              <div>
                <h4 className="font-semibold mb-2">Notes:</h4>
                <p className="text-muted-foreground text-sm">{invoice.notes}</p>
              </div>
            )}
            {invoice.terms && (
              <div>
                <h4 className="font-semibold mb-2">Terms & Conditions:</h4>
                <p className="text-muted-foreground text-sm">{invoice.terms}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
