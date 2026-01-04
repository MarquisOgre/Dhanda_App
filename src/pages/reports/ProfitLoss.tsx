import { TrendingUp, TrendingDown, IndianRupee } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { PrintButton } from "@/components/PrintButton";
import { generateReportPDF, downloadPDF } from "@/lib/pdf";
import { printTable } from "@/lib/print";

export default function ProfitLoss() {
  const [period, setPeriod] = useState("this-year");

  const incomeData = [
    { category: "Sales Revenue", amount: 2850000 },
    { category: "Other Income", amount: 25000 },
    { category: "Interest Earned", amount: 12000 },
  ];

  const expenseData = [
    { category: "Cost of Goods Sold", amount: 1850000 },
    { category: "Operating Expenses", amount: 245000 },
    { category: "Salaries & Wages", amount: 320000 },
    { category: "Rent & Utilities", amount: 85000 },
    { category: "Marketing & Advertising", amount: 45000 },
    { category: "Depreciation", amount: 35000 },
    { category: "Other Expenses", amount: 28000 },
  ];

  const totalIncome = incomeData.reduce((sum, i) => sum + i.amount, 0);
  const totalExpenses = expenseData.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalIncome - totalExpenses;
  const profitMargin = ((netProfit / totalIncome) * 100).toFixed(1);

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
      subtitle: "This Year (FY 2024-25)",
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
      dateRange: "This Year (FY 2024-25)",
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Profit & Loss Statement</h1>
          <p className="text-muted-foreground">Financial performance overview</p>
        </div>
        <div className="flex gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="this-quarter">This Quarter</SelectItem>
              <SelectItem value="this-year">This Year (FY 2024-25)</SelectItem>
              <SelectItem value="last-year">Last Year (FY 2023-24)</SelectItem>
            </SelectContent>
          </Select>
          <PrintButton onPrint={handlePrint} onExportPDF={handleExportPDF} />
        </div>
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
            {incomeData.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                <span className="text-muted-foreground">{item.category}</span>
                <span className="font-medium">₹{item.amount.toLocaleString()}</span>
              </div>
            ))}
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
            {expenseData.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                <span className="text-muted-foreground">{item.category}</span>
                <span className="font-medium">₹{item.amount.toLocaleString()}</span>
              </div>
            ))}
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
