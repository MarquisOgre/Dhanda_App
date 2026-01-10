import { useBusinessSettings } from "@/contexts/BusinessContext";

// Generic item interface that works for both sale and purchase
interface BaseInvoiceItem {
  quantity: number;
  rate: number;
  discount: number;
  taxRate: number;
}

interface TaxSummaryProps {
  items: BaseInvoiceItem[];
  additionalCharges?: number;
  roundOff?: boolean;
  enableTcs?: boolean;
  tcsPercent?: number;
  enableTds?: boolean;
  tdsPercent?: number;
  invoiceType?: "sale" | "purchase";
}

interface TaxBreakdown {
  rate: number;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
}

export function TaxSummary({ 
  items, 
  additionalCharges = 0, 
  roundOff = true,
  enableTcs,
  tcsPercent,
  enableTds,
  tdsPercent,
  invoiceType = "sale"
}: TaxSummaryProps) {
  const { businessSettings } = useBusinessSettings();
  
  // Use props if provided, otherwise fall back to business settings
  const useTcs = enableTcs ?? businessSettings?.enable_tcs ?? false;
  const useTds = enableTds ?? businessSettings?.enable_tds ?? false;
  const tcsRate = tcsPercent ?? (businessSettings as any)?.tcs_percent ?? 0;
  const tdsRate = tdsPercent ?? (businessSettings as any)?.tds_percent ?? 0;
  
  // Calculate subtotal (before discount)
  const grossSubtotal = items.reduce((acc, item) => {
    return acc + (item.quantity * item.rate);
  }, 0);

  // Calculate total discount
  const totalDiscount = items.reduce((acc, item) => {
    const itemSubtotal = item.quantity * item.rate;
    return acc + (itemSubtotal * item.discount) / 100;
  }, 0);

  // Taxable amount = subtotal - discount
  const taxableAmount = grossSubtotal - totalDiscount;

  // Calculate GST on taxable amount
  // Use weighted average tax rate based on item values
  let weightedTaxAmount = 0;
  const taxBreakdown: TaxBreakdown[] = [];
  const taxGroups = new Map<number, number>();
  
  items.forEach((item) => {
    const itemSubtotal = item.quantity * item.rate;
    const discountAmount = (itemSubtotal * item.discount) / 100;
    const itemTaxable = itemSubtotal - discountAmount;
    
    if (taxGroups.has(item.taxRate)) {
      taxGroups.set(item.taxRate, (taxGroups.get(item.taxRate) || 0) + itemTaxable);
    } else {
      taxGroups.set(item.taxRate, itemTaxable);
    }
    
    weightedTaxAmount += (itemTaxable * item.taxRate) / 100;
  });

  taxGroups.forEach((taxableAmt, rate) => {
    const totalTax = (taxableAmt * rate) / 100;
    taxBreakdown.push({
      rate,
      taxableAmount: taxableAmt,
      cgst: totalTax / 2,
      sgst: totalTax / 2,
      igst: 0,
      total: totalTax,
    });
  });

  const totalTax = weightedTaxAmount;
  
  // Calculate TCS - applies to both sale and purchase invoices
  const tcsAmount = useTcs && tcsRate > 0 
    ? ((taxableAmount + totalTax) * tcsRate) / 100 
    : 0;
  
  // Calculate TDS (on purchase invoices) - on taxable amount
  const tdsAmount = useTds && invoiceType === "purchase" && tdsRate > 0 
    ? (taxableAmount * tdsRate) / 100 
    : 0;

  const grandTotalBeforeRound = taxableAmount + totalTax + additionalCharges + tcsAmount - tdsAmount;
  const roundOffAmount = roundOff ? Math.round(grandTotalBeforeRound) - grandTotalBeforeRound : 0;
  const grandTotal = roundOff ? Math.round(grandTotalBeforeRound) : grandTotalBeforeRound;

  return (
    <div className="space-y-4">
      {/* Tax Breakdown */}
      {taxBreakdown.length > 0 && taxBreakdown.some(t => t.rate > 0) && (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left py-2 px-3 font-medium">Tax (GST) Rate</th>
                <th className="text-right py-2 px-3 font-medium">Taxable Amt</th>
                <th className="text-right py-2 px-3 font-medium">CGST</th>
                <th className="text-right py-2 px-3 font-medium">SGST</th>
                <th className="text-right py-2 px-3 font-medium">Total Tax</th>
              </tr>
            </thead>
            <tbody>
              {taxBreakdown.filter(t => t.rate > 0).map((tax) => (
                <tr key={tax.rate} className="border-t border-border">
                  <td className="py-2 px-3">GST @ {tax.rate}%</td>
                  <td className="py-2 px-3 text-right">₹{tax.taxableAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                  <td className="py-2 px-3 text-right">₹{tax.cgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                  <td className="py-2 px-3 text-right">₹{tax.sgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                  <td className="py-2 px-3 text-right font-medium">₹{tax.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary */}
      <div className="bg-muted/30 rounded-lg p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>₹{grossSubtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
        </div>
        {totalDiscount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Discount</span>
            <span className="text-success">-₹{totalDiscount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Taxable Amount</span>
          <span>₹{taxableAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total Tax (GST)</span>
          <span>₹{totalTax.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
        </div>
        {useTcs && tcsAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">TCS @ {tcsRate}%</span>
            <span>₹{tcsAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
          </div>
        )}
        {useTds && tdsAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">TDS @ {tdsRate}%</span>
            <span className="text-success">-₹{tdsAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
          </div>
        )}
        {additionalCharges > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Additional Charges</span>
            <span>₹{additionalCharges.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
          </div>
        )}
        {roundOff && roundOffAmount !== 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Round Off</span>
            <span>{roundOffAmount >= 0 ? "+" : ""}₹{roundOffAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
          <span>Grand Total</span>
          <span className="text-primary">₹{grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>
  );
}

export function calculateTotals(items: BaseInvoiceItem[], additionalCharges = 0) {
  const subtotal = items.reduce((acc, item) => {
    const itemSubtotal = item.quantity * item.rate;
    const discountAmount = (itemSubtotal * item.discount) / 100;
    return acc + (itemSubtotal - discountAmount);
  }, 0);

  const totalTax = items.reduce((acc, item) => {
    const itemSubtotal = item.quantity * item.rate;
    const discountAmount = (itemSubtotal * item.discount) / 100;
    const taxableAmount = itemSubtotal - discountAmount;
    return acc + (taxableAmount * item.taxRate) / 100;
  }, 0);

  const grandTotal = Math.round(subtotal + totalTax + additionalCharges);

  return { subtotal, totalTax, grandTotal };
}
