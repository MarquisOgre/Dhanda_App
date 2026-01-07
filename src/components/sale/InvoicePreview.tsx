import { useState, useEffect } from "react";
import { FileText, Printer, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { calculateTotals } from "./TaxSummary";
import { supabase } from "@/integrations/supabase/client";

// Generic base item interface that works for both sale and purchase
interface BaseItem {
  id: number;
  itemId: string;
  name: string;
  hsn: string;
  quantity: number;
  unit: string;
  rate: number;
  discount: number;
  taxRate: number;
  amount: number;
}

interface InvoicePreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentType: string;
  documentNumber: string;
  date: string;
  dueDate?: string;
  partyId: string;
  items: BaseItem[];
  notes?: string;
}

interface Party {
  id: string;
  name: string;
  gstin: string | null;
  phone: string | null;
  billing_address: string | null;
}

export function InvoicePreview({
  open,
  onOpenChange,
  documentType,
  documentNumber,
  date,
  dueDate,
  partyId,
  items,
  notes,
}: InvoicePreviewProps) {
  const [party, setParty] = useState<Party | null>(null);
  const { subtotal, totalTax, grandTotal } = calculateTotals(items);

  useEffect(() => {
    if (partyId && open) {
      fetchParty();
    }
  }, [partyId, open]);

  const fetchParty = async () => {
    const { data } = await supabase
      .from("parties")
      .select("id, name, gstin, phone, billing_address")
      .eq("id", partyId)
      .maybeSingle();
    if (data) setParty(data);
  };

  const totalDiscount = items.reduce((acc, item) => {
    const itemSubtotal = item.quantity * item.rate;
    return acc + (itemSubtotal * item.discount) / 100;
  }, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Preview {documentType}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Printer className="w-4 h-4" />
                Print
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="bg-white border border-border rounded-lg p-8 text-foreground">
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">AccuBooks</h1>
                  <p className="text-sm text-muted-foreground">Accounting Software</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-primary uppercase">{documentType}</h2>
              <div className="mt-4 space-y-1 text-sm">
                <p><span className="text-muted-foreground">Number:</span> <span className="font-medium">{documentNumber}</span></p>
                <p><span className="text-muted-foreground">Date:</span> <span className="font-medium">{date}</span></p>
                {dueDate && <p><span className="text-muted-foreground">Due Date:</span> <span className="font-medium">{dueDate}</span></p>}
              </div>
            </div>
          </div>

          <div className="mb-8 p-4 bg-muted/30 rounded-lg">
            <p className="text-sm font-medium text-muted-foreground mb-2">Bill To:</p>
            {party ? (
              <div>
                <p className="font-bold text-lg">{party.name}</p>
                <p className="text-sm text-muted-foreground">{party.billing_address || "N/A"}</p>
                <p className="text-sm text-muted-foreground">GSTIN: {party.gstin || "N/A"}</p>
                <p className="text-sm text-muted-foreground">Phone: {party.phone || "N/A"}</p>
              </div>
            ) : (
              <p className="text-muted-foreground">No party selected</p>
            )}
          </div>

          <div className="mb-8 border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left py-3 px-4 font-medium">#</th>
                  <th className="text-left py-3 px-4 font-medium">Item</th>
                  <th className="text-left py-3 px-4 font-medium">HSN</th>
                  <th className="text-center py-3 px-4 font-medium">Qty</th>
                  <th className="text-right py-3 px-4 font-medium">Rate</th>
                  <th className="text-right py-3 px-4 font-medium">Tax</th>
                  <th className="text-right py-3 px-4 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.filter(item => item.itemId).map((item, index) => (
                  <tr key={item.id} className="border-t border-border">
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4 font-medium">{item.name}</td>
                    <td className="py-3 px-4">{item.hsn}</td>
                    <td className="py-3 px-4 text-center">{item.quantity} {item.unit}</td>
                    <td className="py-3 px-4 text-right">₹{item.rate.toLocaleString("en-IN")}</td>
                    <td className="py-3 px-4 text-right">{item.taxRate}%</td>
                    <td className="py-3 px-4 text-right font-medium">₹{item.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <div className="w-80 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{(subtotal + totalDiscount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Discount</span>
                  <span>-₹{totalDiscount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (GST)</span>
                <span>₹{totalTax.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                <span>Grand Total</span>
                <span className="text-primary">₹{grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {notes && (
            <div className="mt-8 pt-4 border-t border-border">
              <p className="text-sm font-medium text-muted-foreground mb-1">Notes:</p>
              <p className="text-sm">{notes}</p>
            </div>
          )}

          <div className="mt-12 pt-4 border-t border-border flex justify-between">
            <div className="text-sm text-muted-foreground">
              <p>Terms & Conditions Apply</p>
              <p>Thank you for your business!</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-8">Authorized Signature</p>
              <div className="w-32 h-0.5 bg-border"></div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
