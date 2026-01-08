import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, IndianRupee, Loader2 } from "lucide-react";
import { PrintButton } from "@/components/PrintButton";
import { generateReportPDF, downloadPDF } from "@/lib/pdf";
import { printTable } from "@/lib/print";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { DateRangeFilter, getDefaultDateRange, DateRange } from "@/components/DateRangeFilter";

export default function ProfitLoss() {
  const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange());
  const [loading, setLoading] = useState(true);
  const [incomeData, setIncomeData] = useState<{ category: string; amount: number }[]>([]);
  const [expenseData, setExpenseData] = useState<{ category: string; amount: number }[]>([]);

  useEffect(() => {
    fetchProfitLossData();
  }, [dateRange]);

  const fetchProfitLossData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get sales revenue from sale_invoices within date range
      const { data: salesInvoices } = await supabase
        .from('sale_invoices')
        .select('total_amount, subtotal, invoice_date')
        .eq('user_id', user.id)
        .eq('is_deleted', false)
        .gte('invoice_date', format(dateRange.from, 'yyyy-MM-dd'))
        .lte('invoice_date', format(dateRange.to, 'yyyy-MM-dd'));

      const salesRevenue = (salesInvoices || []).reduce((sum, inv) => sum + (inv.total_amount || 0), 0);
      const costOfGoods = (salesInvoices || []).reduce((sum, inv) => sum + (inv.subtotal || 0), 0);

      // Get purchase costs from purchase_invoices within date range
      const { data: purchaseInvoices } = await supabase
        .from('purchase_invoices')
        .select('total_amount, invoice_date')
        .eq('user_id', user.id)
        .eq('is_deleted', false)
        .gte('invoice_date', format(dateRange.from, 'yyyy-MM-dd'))
        .lte('invoice_date', format(dateRange.to, 'yyyy-MM-dd'));

      const purchaseCost = (purchaseInvoices || []).reduce((sum, inv) => sum + (inv.total_amount || 0), 0);

      // Get expenses by category within date range
      const { data: expenses } = await supabase
        .from('expenses')
        .select('category, amount, expense_date')
        .eq('user_id', user.id)
        .gte('expense_date', format(dateRange.from, 'yyyy-MM-dd'))
        .lte('expense_date', format(dateRange.to, 'yyyy-MM-dd'));

      const expensesByCategory: { [key: string]: number } = {};
      (expenses || []).forEach(exp => {
        if (!expensesByCategory[exp.category]) {
          expensesByCategory[exp.category] = 0;
        }
        expensesByCategory[exp.category] += exp.amount;
      });

      // Set income data
      setIncomeData([
        { category: "Sales Revenue", amount: salesRevenue },
      ]);

      // Set expense data
      const expenseItems = [
        { category: "Cost of Goods Sold", amount: costOfGoods || purchaseCost },
        ...Object.entries(expensesByCategory).map(([category, amount]) => ({
          category,
          amount,
        })),
      ];
      setExpenseData(expenseItems);
    } catch (error) {
      console.error('Error fetching P&L data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalIncome = incomeData.reduce((sum, i) => sum + i.amount, 0);
  const totalExpenses = expenseData.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalIncome - totalExpenses;
  const profitMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : "0";

  const dateRangeLabel = `${format(dateRange.from, 'dd MMM yyyy')} - ${format(dateRange.to, 'dd MMM yyyy')}`;

  const handlePrint = () => {
    const allRows = [
      ["INCOME", "", ""],
      ...incomeData.map(i => ["", i.category, `₹${i.amount.toLocaleString()}`]),
      ["", "Total Income", `₹${totalIncome.toLocaleString()}`],
      ["", "", ""],
      ["EXPENSES", "", ""],
      ...expenseData.map(e => ["", e.category, `₹${e.amount.toLocaleString()}`]),
      ["", "Total Expenses", `₹${totalExpenses.toLocaleString()}`],
      ["", "", ""],
      ["NET PROFIT", "", `₹${netProfit.toLocaleString()}`],
    ];

    printTable({
      title: "Profit & Loss Statement",
      subtitle: dateRangeLabel,
      columns: ["Section", "Particulars", "Amount"],
      rows: allRows,
      summary: [
        { label: "Total Income", value: `₹${totalIncome.toLocaleString()}` },
        { label: "Total Expenses", value: `₹${totalExpenses.toLocaleString()}` },
        { label: "Net Profit", value: `₹${netProfit.toLocaleString()}` },
        { label: "Profit Margin", value: `${profitMargin}%` },
      ]
    });
  };

  const handleExportPDF = () => {
    const allRows = [
      ["INCOME", "", ""],
      ...incomeData.map(i => ["", i.category, `₹${i.amount.toLocaleString()}`]),
      ["", "Total Income", `₹${totalIncome.toLocaleString()}`],
      ["", "", ""],
      ["EXPENSES", "", ""],
      ...expenseData.map(e => ["", e.category, `₹${e.amount.toLocaleString()}`]),
      ["", "Total Expenses", `₹${totalExpenses.toLocaleString()}`],
      ["", "", ""],
      ["NET PROFIT", "", `₹${netProfit.toLocaleString()}`],
    ];

    const doc = generateReportPDF({
      title: "Profit & Loss Statement",
      subtitle: "Dhandha App",
      dateRange: dateRangeLabel,
      columns: ["Section", "Particulars", "Amount"],
      rows: allRows,
      summary: [
        { label: "Total Income", value: `₹${totalIncome.toLocaleString()}` },
        { label: "Total Expenses", value: `₹${totalExpenses.toLocaleString()}` },
        { label: "Net Profit", value: `₹${netProfit.toLocaleString()}` },
        { label: "Profit Margin", value: `${profitMargin}%` },
      ]
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
          <h1 className="text-2xl font-bold">Profit & Loss Statement</h1>
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Income</p>
            <TrendingUp className="w-4 h-4 text-success" />
          </div>
          <p className="text-2xl font-bold mt-2 text-success">₹{totalIncome.toLocaleString()}</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <TrendingDown className="w-4 h-4 text-destructive" />
          </div>
          <p className="text-2xl font-bold mt-2 text-destructive">₹{totalExpenses.toLocaleString()}</p>
        </div>
        <div className="metric-card bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Net Profit</p>
            <IndianRupee className="w-4 h-4 text-primary" />
          </div>
          <p className={`text-2xl font-bold mt-2 ${netProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
            ₹{Math.abs(netProfit).toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Profit Margin: {profitMargin}%</p>
        </div>
      </div>

      {/* P&L Statement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income */}
        <div className="metric-card">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-success" />
            Income
          </h3>
          <div className="space-y-3">
            {incomeData.length === 0 ? (
              <p className="text-muted-foreground py-4">No income recorded</p>
            ) : (
              incomeData.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                  <span className="text-muted-foreground">{item.category}</span>
                  <span className="font-medium">₹{item.amount.toLocaleString()}</span>
                </div>
              ))
            )}
            <div className="flex justify-between items-center py-3 bg-success/10 rounded-lg px-3 mt-4">
              <span className="font-semibold">Total Income</span>
              <span className="font-bold text-success">₹{totalIncome.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Expenses */}
        <div className="metric-card">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-destructive" />
            Expenses
          </h3>
          <div className="space-y-3">
            {expenseData.length === 0 ? (
              <p className="text-muted-foreground py-4">No expenses recorded</p>
            ) : (
              expenseData.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                  <span className="text-muted-foreground">{item.category}</span>
                  <span className="font-medium">₹{item.amount.toLocaleString()}</span>
                </div>
              ))
            )}
            <div className="flex justify-between items-center py-3 bg-destructive/10 rounded-lg px-3 mt-4">
              <span className="font-semibold">Total Expenses</span>
              <span className="font-bold text-destructive">₹{totalExpenses.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Net Result */}
      <div className="metric-card bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold">Net {netProfit >= 0 ? 'Profit' : 'Loss'}</h3>
            <p className="text-sm text-muted-foreground">Total Income - Total Expenses</p>
          </div>
          <div className="text-right">
            <p className={`text-3xl font-bold ${netProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
              ₹{Math.abs(netProfit).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Margin: {profitMargin}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}