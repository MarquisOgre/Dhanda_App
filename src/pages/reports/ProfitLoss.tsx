import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { PrintButton } from "@/components/PrintButton";
import { generateReportPDF, downloadPDF } from "@/lib/pdf";
import { printTable } from "@/lib/print";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { DateRangeFilter, getDefaultDateRange, DateRange } from "@/components/DateRangeFilter";

interface PLData {
  // Revenue / Receipts (+)
  sale: number;
  debitNote: number;
  paymentOut: number;
  closingStock: number;
  gstReceivable: number;
  tcsReceivable: number;
  tdsReceivable: number;
  otherIncomes: number;
  // Expenses / Payments (-)
  purchase: number;
  creditNote: number;
  paymentIn: number;
  openingStock: number;
  gstPayable: number;
  tcsPayable: number;
  tdsPayable: number;
  otherExpense: number;
}

export default function ProfitLoss() {
  const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange());
  const [loading, setLoading] = useState(true);
  const [plData, setPlData] = useState<PLData>({
    sale: 0,
    debitNote: 0,
    paymentOut: 0,
    closingStock: 0,
    gstReceivable: 0,
    tcsReceivable: 0,
    tdsReceivable: 0,
    otherIncomes: 0,
    purchase: 0,
    creditNote: 0,
    paymentIn: 0,
    openingStock: 0,
    gstPayable: 0,
    tcsPayable: 0,
    tdsPayable: 0,
    otherExpense: 0,
  });

  useEffect(() => {
    fetchProfitLossData();
  }, [dateRange]);

  const fetchProfitLossData = async () => {
    try {
      setLoading(true);
      const startDate = format(dateRange.from, 'yyyy-MM-dd');
      const endDate = format(dateRange.to, 'yyyy-MM-dd');

      // Get sales data
      const { data: salesInvoices } = await supabase
        .from('sale_invoices')
        .select('total_amount, tax_amount, tcs_amount')
        .eq('is_deleted', false)
        .gte('invoice_date', startDate)
        .lte('invoice_date', endDate);

      const saleTotal = (salesInvoices || []).reduce((sum, inv) => sum + (inv.total_amount || 0), 0);
      const saleTcsReceivable = (salesInvoices || []).reduce((sum, inv) => sum + (inv.tcs_amount || 0), 0);

      // Get purchase data
      const { data: purchaseInvoices } = await supabase
        .from('purchase_invoices')
        .select('total_amount, tax_amount, tcs_amount')
        .eq('is_deleted', false)
        .gte('invoice_date', startDate)
        .lte('invoice_date', endDate);

      const purchaseTotal = (purchaseInvoices || []).reduce((sum, inv) => sum + (inv.total_amount || 0), 0);
      const purchaseTdsPayable = (purchaseInvoices || []).reduce((sum, inv) => sum + (inv.tcs_amount || 0), 0);

      // Get payment in (received from customers)
      const { data: paymentsIn } = await supabase
        .from('payments')
        .select('amount')
        .eq('payment_type', 'payment_in')
        .gte('payment_date', startDate)
        .lte('payment_date', endDate);

      const paymentInTotal = (paymentsIn || []).reduce((sum, p) => sum + (p.amount || 0), 0);

      // Get payment out (paid to suppliers)
      const { data: paymentsOut } = await supabase
        .from('payments')
        .select('amount')
        .eq('payment_type', 'payment_out')
        .gte('payment_date', startDate)
        .lte('payment_date', endDate);

      const paymentOutTotal = (paymentsOut || []).reduce((sum, p) => sum + (p.amount || 0), 0);

      // Get other expenses
      const { data: expenses } = await supabase
        .from('expenses')
        .select('amount')
        .gte('expense_date', startDate)
        .lte('expense_date', endDate);

      const expenseTotal = (expenses || []).reduce((sum, e) => sum + (e.amount || 0), 0);

      // Get stock values - Opening stock is current_stock at start, Closing stock is current value
      const { data: items } = await supabase
        .from('items')
        .select('current_stock, purchase_price, opening_stock')
        .eq('is_deleted', false);

      const closingStockValue = (items || []).reduce((sum, item) => {
        return sum + ((item.current_stock || 0) * (item.purchase_price || 0));
      }, 0);

      const openingStockValue = (items || []).reduce((sum, item) => {
        return sum + ((item.opening_stock || 0) * (item.purchase_price || 0));
      }, 0);

      setPlData({
        sale: saleTotal,
        debitNote: 0, // Purchase returns (not implemented yet)
        paymentOut: paymentOutTotal,
        closingStock: closingStockValue,
        gstReceivable: 0, // GST receivable (input credit)
        tcsReceivable: saleTcsReceivable,
        tdsReceivable: 0, // TDS receivable
        otherIncomes: 0,
        purchase: purchaseTotal,
        creditNote: 0, // Sale returns (not implemented yet)
        paymentIn: paymentInTotal,
        openingStock: openingStockValue,
        gstPayable: 0, // GST payable (output tax)
        tcsPayable: 0,
        tdsPayable: purchaseTdsPayable,
        otherExpense: expenseTotal,
      });
    } catch (error) {
      console.error('Error fetching P&L data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = plData.sale + plData.debitNote + plData.paymentOut + 
    plData.closingStock + plData.gstReceivable + plData.tcsReceivable + 
    plData.tdsReceivable + plData.otherIncomes;

  const totalExpenses = plData.purchase + plData.creditNote + plData.paymentIn + 
    plData.openingStock + plData.gstPayable + plData.tcsPayable + 
    plData.tdsPayable + plData.otherExpense;

  const netProfit = totalRevenue - totalExpenses;

  const dateRangeLabel = `${format(dateRange.from, 'dd MMM yyyy')} - ${format(dateRange.to, 'dd MMM yyyy')}`;

  const revenueItems = [
    { label: "Sale", amount: plData.sale },
    { label: "Debit Note / Purchase Return", amount: plData.debitNote },
    { label: "Payment Out", amount: plData.paymentOut },
    { label: "Closing Stock", amount: plData.closingStock },
    { label: "GST Receivable", amount: plData.gstReceivable },
    { label: "TCS Receivable", amount: plData.tcsReceivable },
    { label: "TDS Receivable", amount: plData.tdsReceivable },
    { label: "Other Incomes", amount: plData.otherIncomes },
  ];

  const expenseItems = [
    { label: "Purchase", amount: plData.purchase },
    { label: "Credit Note / Sale Return", amount: plData.creditNote },
    { label: "Payment In", amount: plData.paymentIn },
    { label: "Opening Stock", amount: plData.openingStock },
    { label: "GST Payable", amount: plData.gstPayable },
    { label: "TCS Payable", amount: plData.tcsPayable },
    { label: "TDS Payable", amount: plData.tdsPayable },
    { label: "Other Expense", amount: plData.otherExpense },
  ];

  const handlePrint = () => {
    const allRows: (string | number)[][] = [];
    
    // Build rows matching the side-by-side format
    for (let i = 0; i < Math.max(revenueItems.length, expenseItems.length); i++) {
      const rev = revenueItems[i] || { label: "", amount: 0 };
      const exp = expenseItems[i] || { label: "", amount: 0 };
      allRows.push([
        rev.label,
        rev.amount > 0 ? `₹${rev.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "0",
        exp.label,
        exp.amount > 0 ? `₹${exp.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "0",
      ]);
    }

    // Add totals
    allRows.push([
      "Total Revenue / Receipts",
      `₹${totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
      "Total Expenses / Payments",
      `₹${totalExpenses.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
    ]);

    allRows.push([
      "",
      "",
      "Net Profit",
      `₹${netProfit.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
    ]);

    printTable({
      title: "Profit & Loss Report",
      subtitle: dateRangeLabel,
      columns: ["Revenue / Receipts (+)", "Amount (₹)", "Expenses / Payments (−)", "Amount (₹)"],
      rows: allRows,
      summary: []
    });
  };

  const handleExportPDF = () => {
    const allRows: (string | number)[][] = [];
    
    for (let i = 0; i < Math.max(revenueItems.length, expenseItems.length); i++) {
      const rev = revenueItems[i] || { label: "", amount: 0 };
      const exp = expenseItems[i] || { label: "", amount: 0 };
      allRows.push([
        rev.label,
        rev.amount > 0 ? `₹${rev.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "0",
        exp.label,
        exp.amount > 0 ? `₹${exp.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "0",
      ]);
    }

    allRows.push([
      "Total Revenue / Receipts",
      `₹${totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
      "Total Expenses / Payments",
      `₹${totalExpenses.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
    ]);

    allRows.push([
      "",
      "",
      "Net Profit",
      `₹${netProfit.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
    ]);

    const doc = generateReportPDF({
      title: "Profit & Loss Report",
      subtitle: "Dhandha App",
      dateRange: dateRangeLabel,
      columns: ["Revenue / Receipts (+)", "Amount (₹)", "Expenses / Payments (−)", "Amount (₹)"],
      rows: allRows,
      summary: []
    });
    downloadPDF(doc, `profit-loss-${new Date().toISOString().split('T')[0]}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Profit & Loss Report</h1>
          <p className="text-muted-foreground">Financial performance overview</p>
        </div>
        <div className="flex gap-3">
          <PrintButton onPrint={handlePrint} onExportPDF={handleExportPDF} />
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="flex flex-wrap gap-4 items-center">
        <DateRangeFilter dateRange={dateRange} onDateRangeChange={setDateRange} />
      </div>

      {/* P&L Statement Table */}
      <div className="metric-card overflow-hidden p-0">
        <div className="bg-muted/50 py-3 px-4 text-center font-semibold border-b border-border">
          Profit & Loss Report
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left py-3 px-4 font-medium w-1/4">Revenue / Receipts (+)</th>
              <th className="text-right py-3 px-4 font-medium w-1/4">Amount (₹)</th>
              <th className="text-left py-3 px-4 font-medium w-1/4">Expenses / Payments (−)</th>
              <th className="text-right py-3 px-4 font-medium w-1/4">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {revenueItems.map((rev, idx) => {
              const exp = expenseItems[idx] || { label: "", amount: 0 };
              return (
                <tr key={idx} className="border-b border-border">
                  <td className="py-2.5 px-4">{rev.label}</td>
                  <td className="py-2.5 px-4 text-right font-mono">
                    {rev.amount > 0 ? rev.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "0"}
                  </td>
                  <td className="py-2.5 px-4">{exp.label}</td>
                  <td className="py-2.5 px-4 text-right font-mono">
                    {exp.amount > 0 ? exp.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "0"}
                  </td>
                </tr>
              );
            })}
            {/* Totals Row */}
            <tr className="border-b border-border bg-muted/50 font-semibold">
              <td className="py-3 px-4">Total Revenue / Receipts</td>
              <td className="py-3 px-4 text-right font-mono text-success">
                {totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </td>
              <td className="py-3 px-4">Total Expenses / Payments</td>
              <td className="py-3 px-4 text-right font-mono text-destructive">
                {totalExpenses.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </td>
            </tr>
            {/* Net Profit Row */}
            <tr className="bg-primary/10">
              <td colSpan={2}></td>
              <td className="py-4 px-4 font-bold text-lg">Net Profit</td>
              <td className={`py-4 px-4 text-right font-bold text-lg font-mono ${netProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                {netProfit.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}