import { useState } from "react";
import { Download, Filter, Calendar, TrendingUp, TrendingDown, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const salesData = [
  { id: 1, invoice: "INV-001", date: "02 Jan 2026", party: "Rahul Electronics", items: 5, amount: 45000, profit: 8500 },
  { id: 2, invoice: "INV-002", date: "02 Jan 2026", party: "Sharma Traders", items: 3, amount: 12500, profit: 2100 },
  { id: 3, invoice: "INV-003", date: "01 Jan 2026", party: "Quick Mart", items: 8, amount: 78000, profit: 12400 },
  { id: 4, invoice: "INV-004", date: "31 Dec 2025", party: "Global Systems", items: 2, amount: 25000, profit: 4500 },
  { id: 5, invoice: "INV-005", date: "30 Dec 2025", party: "Tech Solutions", items: 4, amount: 35600, profit: 6200 },
];

export default function SaleReport() {
  const [dateRange, setDateRange] = useState("this-month");
  
  const totalSales = salesData.reduce((sum, s) => sum + s.amount, 0);
  const totalProfit = salesData.reduce((sum, s) => sum + s.profit, 0);
  const avgOrderValue = totalSales / salesData.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sale Report</h1>
          <p className="text-muted-foreground">Analyze your sales performance</p>
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
            <p className="text-sm text-muted-foreground">Total Sales</p>
            <IndianRupee className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold mt-2">₹{totalSales.toLocaleString()}</p>
          <p className="text-xs text-success mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12.5% from last month
          </p>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Profit</p>
            <TrendingUp className="w-4 h-4 text-success" />
          </div>
          <p className="text-2xl font-bold mt-2 text-success">₹{totalProfit.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">Profit Margin: {((totalProfit / totalSales) * 100).toFixed(1)}%</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Invoices</p>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold mt-2">{salesData.length}</p>
          <p className="text-xs text-muted-foreground mt-1">This period</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Avg Order Value</p>
            <IndianRupee className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold mt-2">₹{avgOrderValue.toLocaleString()}</p>
          <p className="text-xs text-success mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +5.2% from last month
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="this-week">This Week</SelectItem>
            <SelectItem value="this-month">This Month</SelectItem>
            <SelectItem value="this-quarter">This Quarter</SelectItem>
            <SelectItem value="this-year">This Year</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
        <Input type="date" className="w-[150px]" />
        <Input type="date" className="w-[150px]" />
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          More Filters
        </Button>
      </div>

      {/* Data Table */}
      <div className="metric-card overflow-hidden p-0">
        <table className="data-table">
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Date</th>
              <th>Party</th>
              <th className="text-center">Items</th>
              <th className="text-right">Amount</th>
              <th className="text-right">Profit</th>
              <th className="text-right">Margin</th>
            </tr>
          </thead>
          <tbody>
            {salesData.map((sale) => (
              <tr key={sale.id}>
                <td className="font-medium">{sale.invoice}</td>
                <td className="text-muted-foreground">{sale.date}</td>
                <td>{sale.party}</td>
                <td className="text-center">{sale.items}</td>
                <td className="text-right font-medium">₹{sale.amount.toLocaleString()}</td>
                <td className="text-right text-success">₹{sale.profit.toLocaleString()}</td>
                <td className="text-right text-muted-foreground">{((sale.profit / sale.amount) * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-muted/50 font-semibold">
              <td colSpan={4}>Total</td>
              <td className="text-right">₹{totalSales.toLocaleString()}</td>
              <td className="text-right text-success">₹{totalProfit.toLocaleString()}</td>
              <td className="text-right">{((totalProfit / totalSales) * 100).toFixed(1)}%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
