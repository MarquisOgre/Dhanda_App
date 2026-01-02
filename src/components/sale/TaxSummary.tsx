import type { InvoiceItem } from "./InvoiceItemsTable";

interface TaxSummaryProps {
  items: InvoiceItem[];
  additionalCharges?: number;
  roundOff?: boolean;
}

interface TaxBreakdown {
  rate: number;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
}

export function TaxSummary({ items, additionalCharges = 0, roundOff = true }: TaxSummaryProps) {
  // Calculate totals
  const subtotal = items.reduce((acc, item) => {
    const itemSubtotal = item.quantity * item.rate;
    const discountAmount = (itemSubtotal * item.discount) / 100;
    return acc + (itemSubtotal - discountAmount);
  }, 0);

  const totalDiscount = items.reduce((acc, item) => {
    const itemSubtotal = item.quantity * item.rate;
    return acc + (itemSubtotal * item.discount) / 100;
  }, 0);

  // Group taxes by rate
  const taxBreakdown: TaxBreakdown[] = [];
  const taxGroups = new Map<number, number>();
  
  items.forEach((item) => {
    const itemSubtotal = item.quantity * item.rate;
    const discountAmount = (itemSubtotal * item.discount) / 100;
    const taxableAmount = itemSubtotal - discountAmount;
    
    if (taxGroups.has(item.taxRate)) {
      taxGroups.set(item.taxRate, (taxGroups.get(item.taxRate) || 0) + taxableAmount);
    } else {
      taxGroups.set(item.taxRate, taxableAmount);
    }
  });

  taxGroups.forEach((taxableAmount, rate) => {
    const totalTax = (taxableAmount * rate) / 100;
    taxBreakdown.push({
      rate,
      taxableAmount,
      cgst: totalTax / 2,
      sgst: totalTax / 2,
      igst: 0, // Would depend on state selection
      total: totalTax,
    });
  });

  const totalTax = taxBreakdown.reduce((acc, tax) => acc + tax.total, 0);
  const grandTotalBeforeRound = subtotal + totalTax + additionalCharges;
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
                <th className="text-left py-2 px-3 font-medium">Tax Rate</th>
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
          <span>₹{(subtotal + totalDiscount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
        </div>
        {totalDiscount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Discount</span>
            <span className="text-success">-₹{totalDiscount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Taxable Amount</span>
          <span>₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total Tax (GST)</span>
          <span>₹{totalTax.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
        </div>
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

export function calculateTotals(items: InvoiceItem[], additionalCharges = 0) {
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
