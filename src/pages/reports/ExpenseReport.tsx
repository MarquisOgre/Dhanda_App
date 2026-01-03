import { useState } from "react";
import { Download, Filter, TrendingUp, TrendingDown, Wallet, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const expenseData = [
  { id: 1, date: "02 Jan 2026", category: "Rent", description: "Office rent - January", amount: 25000 },
  { id: 2, date: "02 Jan 2026", category: "Utilities", description: "Electricity bill", amount: 4500 },
  { id: 3, date: "01 Jan 2026", category: "Salaries", description: "Staff salaries - December", amount: 85000 },
  { id: 4, date: "30 Dec 2025", category: "Marketing", description: "Google Ads campaign", amount: 12000 },
  { id: 5, date: "28 Dec 2025", category: "Office Supplies", description: "Stationery and supplies", amount: 3500 },
  { id: 6, date: "25 Dec 2025", category: "Travel", description: "Client meeting - travel expenses", amount: 5800 },
  { id: 7, date: "22 Dec 2025", category: "Maintenance", description: "Equipment maintenance", amount: 8000 },
];

const categoryTotals = [
  { category: "Salaries", amount: 320000, percent: 46.4 },
  { category: "Rent", amount: 150000, percent: 21.7 },
  { category: "Utilities", amount: 54000, percent: 7.8 },
  { category: "Marketing", amount: 72000, percent: 10.4 },
  { category: "Office Supplies", amount: 28000, percent: 4.1 },
  { category: "Travel", amount: 35000, percent: 5.1 },
  { category: "Maintenance", amount: 31000, percent: 4.5 },
];

export default function ExpenseReport() {
  const [dateRange, setDateRange] = useState("this-month");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filtered = expenseData.filter((e) => 
    categoryFilter === "all" || e.category === categoryFilter
  );

  const totalExpenses = expenseData.reduce((sum, e) => sum + e.amount, 0);
  const avgPerDay = totalExpenses / 30;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Expense Report</h1>
          <p className="text-muted-foreground">Track and analyze business expenses</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <Wallet className="w-4 h-4 text-destructive" />
          </div>
          <p className="text-2xl font-bold mt-2">₹{totalExpenses.toLocaleString()}</p>
          <p className="text-xs text-destructive mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +8.2% from last month
          </p>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Avg Per Day</p>
            <TrendingDown className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold mt-2">₹{avgPerDay.toFixed(0).toLocaleString()}</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Categories</p>
            <PieChart className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold mt-2">{categoryTotals.length}</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Transactions</p>
            <Wallet className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold mt-2">{expenseData.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown */}
        <div className="metric-card">
          <h3 className="font-semibold mb-4">Category Breakdown</h3>
          <div className="space-y-3">
            {categoryTotals.map((cat, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{cat.category}</span>
                  <span className="font-medium">₹{cat.amount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${cat.percent}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{cat.percent}% of total</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="lg:col-span-2">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center mb-4">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="this-quarter">This Quarter</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Rent">Rent</SelectItem>
                <SelectItem value="Utilities">Utilities</SelectItem>
                <SelectItem value="Salaries">Salaries</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                <SelectItem value="Travel">Travel</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="metric-card overflow-hidden p-0">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((expense) => (
                  <tr key={expense.id}>
                    <td className="text-muted-foreground">{expense.date}</td>
                    <td>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-muted">
                        {expense.category}
                      </span>
                    </td>
                    <td className="font-medium">{expense.description}</td>
                    <td className="text-right font-medium">₹{expense.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-muted/50 font-semibold">
                  <td colSpan={3}>Total</td>
                  <td className="text-right">₹{filtered.reduce((s, e) => s + e.amount, 0).toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
