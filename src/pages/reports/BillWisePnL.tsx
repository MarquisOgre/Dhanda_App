import { useState } from "react";
import { Download, Filter, TrendingUp, TrendingDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const billData = [
  { id: 1, invoice: "INV-001", date: "02 Jan 2026", party: "Rahul Electronics", sale: 45000, cost: 36500, profit: 8500, margin: 18.9 },
  { id: 2, invoice: "INV-002", date: "02 Jan 2026", party: "Sharma Traders", sale: 12500, cost: 10400, profit: 2100, margin: 16.8 },
  { id: 3, invoice: "INV-003", date: "01 Jan 2026", party: "Quick Mart", sale: 78000, cost: 65600, profit: 12400, margin: 15.9 },
  { id: 4, invoice: "INV-004", date: "31 Dec 2025", party: "Global Systems", sale: 25000, cost: 20500, profit: 4500, margin: 18.0 },
  { id: 5, invoice: "INV-005", date: "30 Dec 2025", party: "Tech Solutions", sale: 35600, cost: 29400, profit: 6200, margin: 17.4 },
  { id: 6, invoice: "INV-006", date: "28 Dec 2025", party: "Star Enterprises", sale: 52000, cost: 48100, profit: 3900, margin: 7.5 },
  { id: 7, invoice: "INV-007", date: "27 Dec 2025", party: "Prime Retail", sale: 18500, cost: 19200, profit: -700, margin: -3.8 },
];

export default function BillWisePnL() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("this-month");

  const filtered = billData.filter(
    (b) => b.invoice.toLowerCase().includes(searchQuery.toLowerCase()) ||
           b.party.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSale = filtered.reduce((sum, b) => sum + b.sale, 0);
  const totalCost = filtered.reduce((sum, b) => sum + b.cost, 0);
  const totalProfit = filtered.reduce((sum, b) => sum + b.profit, 0);
  const avgMargin = (totalProfit / totalSale) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bill Wise Profit & Loss</h1>
          <p className="text-muted-foreground">Analyze profit on each invoice</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <p className="text-sm text-muted-foreground">Total Sales</p>
          <p className="text-2xl font-bold mt-2">₹{totalSale.toLocaleString()}</p>
        </div>
        <div className="metric-card">
          <p className="text-sm text-muted-foreground">Total Cost</p>
          <p className="text-2xl font-bold mt-2">₹{totalCost.toLocaleString()}</p>
        </div>
        <div className="metric-card">
          <p className="text-sm text-muted-foreground">Total Profit</p>
          <p className={cn("text-2xl font-bold mt-2", totalProfit >= 0 ? "text-success" : "text-destructive")}>
            ₹{Math.abs(totalProfit).toLocaleString()}
          </p>
        </div>
        <div className="metric-card">
          <p className="text-sm text-muted-foreground">Avg Margin</p>
          <p className={cn("text-2xl font-bold mt-2", avgMargin >= 0 ? "text-success" : "text-destructive")}>
            {avgMargin.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search invoices or parties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="this-week">This Week</SelectItem>
            <SelectItem value="this-month">This Month</SelectItem>
            <SelectItem value="this-quarter">This Quarter</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filters
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
              <th className="text-right">Sale Amount</th>
              <th className="text-right">Cost</th>
              <th className="text-right">Profit/Loss</th>
              <th className="text-right">Margin</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((bill) => (
              <tr key={bill.id}>
                <td className="font-medium">{bill.invoice}</td>
                <td className="text-muted-foreground">{bill.date}</td>
                <td>{bill.party}</td>
                <td className="text-right">₹{bill.sale.toLocaleString()}</td>
                <td className="text-right">₹{bill.cost.toLocaleString()}</td>
                <td className={cn("text-right font-medium", bill.profit >= 0 ? "text-success" : "text-destructive")}>
                  <div className="flex items-center justify-end gap-1">
                    {bill.profit >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    ₹{Math.abs(bill.profit).toLocaleString()}
                  </div>
                </td>
                <td className={cn("text-right", bill.margin >= 0 ? "text-success" : "text-destructive")}>
                  {bill.margin.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-muted/50 font-semibold">
              <td colSpan={3}>Total</td>
              <td className="text-right">₹{totalSale.toLocaleString()}</td>
              <td className="text-right">₹{totalCost.toLocaleString()}</td>
              <td className={cn("text-right", totalProfit >= 0 ? "text-success" : "text-destructive")}>
                ₹{Math.abs(totalProfit).toLocaleString()}
              </td>
              <td className={cn("text-right", avgMargin >= 0 ? "text-success" : "text-destructive")}>
                {avgMargin.toFixed(1)}%
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
