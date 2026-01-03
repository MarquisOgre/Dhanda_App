import { useState } from "react";
import { Download, Search, TrendingUp, TrendingDown, Package } from "lucide-react";
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

const itemPnLData = [
  { id: 1, name: "Laptop Dell Inspiron 15", sold: 45, revenue: 2025000, cost: 1575000, profit: 450000, margin: 22.2 },
  { id: 2, name: "Wireless Mouse Logitech", sold: 320, revenue: 272000, cost: 192000, profit: 80000, margin: 29.4 },
  { id: 3, name: "USB-C Hub 7-in-1", sold: 180, revenue: 216000, cost: 162000, profit: 54000, margin: 25.0 },
  { id: 4, name: "Keyboard Mechanical RGB", sold: 95, revenue: 332500, cost: 237500, profit: 95000, margin: 28.6 },
  { id: 5, name: "Monitor 24 inch LED", sold: 28, revenue: 336000, cost: 280000, profit: 56000, margin: 16.7 },
  { id: 6, name: "Printer Ink Cartridge", sold: 450, revenue: 292500, cost: 247500, profit: 45000, margin: 15.4 },
  { id: 7, name: "External SSD 500GB", sold: 65, revenue: 357500, cost: 292500, profit: 65000, margin: 18.2 },
];

export default function ItemWisePnL() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("profit");

  const filtered = itemPnLData
    .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "profit") return b.profit - a.profit;
      if (sortBy === "revenue") return b.revenue - a.revenue;
      if (sortBy === "margin") return b.margin - a.margin;
      if (sortBy === "sold") return b.sold - a.sold;
      return 0;
    });

  const totalRevenue = filtered.reduce((sum, i) => sum + i.revenue, 0);
  const totalCost = filtered.reduce((sum, i) => sum + i.cost, 0);
  const totalProfit = filtered.reduce((sum, i) => sum + i.profit, 0);
  const avgMargin = (totalProfit / totalRevenue) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Item Wise Profit & Loss</h1>
          <p className="text-muted-foreground">Analyze profitability by product</p>
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
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold mt-2">₹{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Cost</p>
            <TrendingDown className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold mt-2">₹{totalCost.toLocaleString()}</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Profit</p>
            <TrendingUp className="w-4 h-4 text-success" />
          </div>
          <p className="text-2xl font-bold mt-2 text-success">₹{totalProfit.toLocaleString()}</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Avg Margin</p>
            <Package className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold mt-2">{avgMargin.toFixed(1)}%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="profit">Highest Profit</SelectItem>
            <SelectItem value="revenue">Highest Revenue</SelectItem>
            <SelectItem value="margin">Highest Margin</SelectItem>
            <SelectItem value="sold">Most Sold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Data Table */}
      <div className="metric-card overflow-hidden p-0">
        <table className="data-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th className="text-center">Units Sold</th>
              <th className="text-right">Revenue</th>
              <th className="text-right">Cost</th>
              <th className="text-right">Profit</th>
              <th className="text-right">Margin</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td className="font-medium">{item.name}</td>
                <td className="text-center">{item.sold}</td>
                <td className="text-right">₹{item.revenue.toLocaleString()}</td>
                <td className="text-right text-muted-foreground">₹{item.cost.toLocaleString()}</td>
                <td className="text-right text-success font-medium">₹{item.profit.toLocaleString()}</td>
                <td className={cn("text-right", item.margin >= 20 ? "text-success" : item.margin >= 15 ? "text-warning" : "text-destructive")}>
                  {item.margin.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-muted/50 font-semibold">
              <td>Total</td>
              <td className="text-center">{filtered.reduce((sum, i) => sum + i.sold, 0)}</td>
              <td className="text-right">₹{totalRevenue.toLocaleString()}</td>
              <td className="text-right">₹{totalCost.toLocaleString()}</td>
              <td className="text-right text-success">₹{totalProfit.toLocaleString()}</td>
              <td className="text-right">{avgMargin.toFixed(1)}%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
