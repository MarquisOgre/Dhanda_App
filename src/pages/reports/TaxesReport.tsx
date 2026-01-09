import { useState, useEffect } from "react";
import { Download, IndianRupee, FileText, Calculator, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { DateRangeFilter, getDefaultDateRange, DateRange } from "@/components/DateRangeFilter";

interface TaxSummary { period: string; taxableValue: number; cgst: number; sgst: number; igst: number; total: number; }
interface TCSDetail { id: string; date: string; party: string; invoice: string; amount: number; tcsRate: number; tcsAmount: number; }

export default function TaxesReport() {
  const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange());
  const [gstData, setGstData] = useState<TaxSummary[]>([]);
  const [tcsData, setTcsData] = useState<TCSDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchTaxData(); }, [dateRange]);

  const fetchTaxData = async () => {
    try {
      setLoading(true);

      const { data: invoices } = await supabase.from('sale_invoices').select(`id, invoice_number, invoice_date, subtotal, tax_amount, total_amount, party_id, parties (name)`)
        .eq('is_deleted', false).gte('invoice_date', format(dateRange.from, 'yyyy-MM-dd')).lte('invoice_date', format(dateRange.to, 'yyyy-MM-dd')).order('invoice_date', { ascending: false });

      const monthlyTotals: { [key: string]: TaxSummary } = {};
      (invoices || []).forEach((inv: any) => {
        const monthKey = format(new Date(inv.invoice_date), 'MMM yyyy');
        if (!monthlyTotals[monthKey]) { monthlyTotals[monthKey] = { period: monthKey, taxableValue: 0, cgst: 0, sgst: 0, igst: 0, total: 0 }; }
        const taxAmount = inv.tax_amount || 0;
        monthlyTotals[monthKey].taxableValue += inv.subtotal || 0;
        monthlyTotals[monthKey].cgst += taxAmount / 2;
        monthlyTotals[monthKey].sgst += taxAmount / 2;
        monthlyTotals[monthKey].total += taxAmount;
      });
      setGstData(Object.values(monthlyTotals));

      const tcsDetails = (invoices || []).filter((inv: any) => (inv.total_amount || 0) >= 50000).map((inv: any) => ({
        id: inv.id, date: inv.invoice_date, party: inv.parties?.name || 'Unknown', invoice: inv.invoice_number, amount: inv.total_amount || 0, tcsRate: 0.1, tcsAmount: ((inv.total_amount || 0) * 0.1) / 100,
      }));
      setTcsData(tcsDetails);
    } catch (error) { console.error('Error fetching tax data:', error); } finally { setLoading(false); }
  };

  const totalTaxable = gstData.reduce((sum, g) => sum + g.taxableValue, 0);
  const totalGST = gstData.reduce((sum, g) => sum + g.total, 0);
  const totalTCS = tcsData.reduce((sum, t) => sum + t.tcsAmount, 0);

  if (loading) { return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>; }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Taxes Report (GST & TCS)</h1><p className="text-muted-foreground">Tax collection and liability summary</p></div>
        <Button variant="outline" className="gap-2"><Download className="w-4 h-4" />Export</Button>
      </div>

      <div className="flex flex-wrap gap-4 items-center"><DateRangeFilter dateRange={dateRange} onDateRangeChange={setDateRange} /></div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="metric-card"><div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">Total Taxable Value</p><IndianRupee className="w-4 h-4 text-primary" /></div><p className="text-2xl font-bold mt-2">₹{totalTaxable.toLocaleString()}</p></div>
        <div className="metric-card"><div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">GST Collected</p><Calculator className="w-4 h-4 text-success" /></div><p className="text-2xl font-bold mt-2 text-success">₹{totalGST.toLocaleString()}</p></div>
        <div className="metric-card"><div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">TCS Collected</p><FileText className="w-4 h-4 text-warning" /></div><p className="text-2xl font-bold mt-2 text-warning">₹{totalTCS.toLocaleString()}</p></div>
        <div className="metric-card"><div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">Total Tax Liability</p><IndianRupee className="w-4 h-4 text-destructive" /></div><p className="text-2xl font-bold mt-2">₹{(totalGST + totalTCS).toLocaleString()}</p></div>
      </div>

      <Tabs defaultValue="gst" className="space-y-6">
        <TabsList><TabsTrigger value="gst">GST Summary</TabsTrigger><TabsTrigger value="tcs">TCS Details</TabsTrigger></TabsList>
        <TabsContent value="gst">
          <div className="metric-card overflow-hidden p-0">
            <table className="data-table"><thead><tr><th>Period</th><th className="text-right">Taxable Value</th><th className="text-right">CGST</th><th className="text-right">SGST</th><th className="text-right">IGST</th><th className="text-right">Total GST</th></tr></thead>
              <tbody>{gstData.length === 0 ? <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No GST data found</td></tr> : gstData.map((gst, idx) => (<tr key={idx}><td className="font-medium">{gst.period}</td><td className="text-right">₹{gst.taxableValue.toLocaleString()}</td><td className="text-right">₹{gst.cgst.toLocaleString()}</td><td className="text-right">₹{gst.sgst.toLocaleString()}</td><td className="text-right">₹{gst.igst.toLocaleString()}</td><td className="text-right font-medium text-success">₹{gst.total.toLocaleString()}</td></tr>))}</tbody>
              {gstData.length > 0 && <tfoot><tr className="bg-muted/50 font-semibold"><td>Total</td><td className="text-right">₹{totalTaxable.toLocaleString()}</td><td className="text-right">₹{gstData.reduce((s, g) => s + g.cgst, 0).toLocaleString()}</td><td className="text-right">₹{gstData.reduce((s, g) => s + g.sgst, 0).toLocaleString()}</td><td className="text-right">₹0</td><td className="text-right text-success">₹{totalGST.toLocaleString()}</td></tr></tfoot>}
            </table>
          </div>
        </TabsContent>
        <TabsContent value="tcs">
          <div className="metric-card overflow-hidden p-0">
            <table className="data-table"><thead><tr><th>Date</th><th>Party</th><th>Invoice</th><th className="text-right">Invoice Amount</th><th className="text-center">TCS Rate</th><th className="text-right">TCS Amount</th></tr></thead>
              <tbody>{tcsData.length === 0 ? <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No TCS data found</td></tr> : tcsData.map((tcs) => (<tr key={tcs.id}><td className="text-muted-foreground">{format(new Date(tcs.date), 'dd MMM yyyy')}</td><td className="font-medium">{tcs.party}</td><td>{tcs.invoice}</td><td className="text-right">₹{tcs.amount.toLocaleString()}</td><td className="text-center">{tcs.tcsRate}%</td><td className="text-right font-medium text-warning">₹{tcs.tcsAmount.toLocaleString()}</td></tr>))}</tbody>
              {tcsData.length > 0 && <tfoot><tr className="bg-muted/50 font-semibold"><td colSpan={5}>Total TCS Collected</td><td className="text-right text-warning">₹{totalTCS.toLocaleString()}</td></tr></tfoot>}
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}