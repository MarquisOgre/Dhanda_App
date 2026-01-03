import { useState } from "react";
import { Download, Search, ArrowUpCircle, ArrowDownCircle, Package } from "lucide-react";
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

const stockMovements = [
  { id: 1, date: "02 Jan 2026", item: "Laptop Dell Inspiron 15", type: "sale", qty: 2, balance: 25, reference: "INV-001" },
  { id: 2, date: "02 Jan 2026", item: "Wireless Mouse Logitech", type: "sale", qty: 5, balance: 150, reference: "INV-001" },
  { id: 3, date: "01 Jan 2026", item: "Laptop Dell Inspiron 15", type: "purchase", qty: 10, balance: 27, reference: "PUR-041" },
  { id: 4, date: "01 Jan 2026", item: "USB-C Hub 7-in-1", type: "sale", qty: 3, balance: 8, reference: "INV-002" },
  { id: 5, date: "31 Dec 2025", item: "Keyboard Mechanical RGB", type: "purchase", qty: 20, balance: 45, reference: "PUR-040" },
  { id: 6, date: "30 Dec 2025", item: "Monitor 24 inch LED", type: "sale", qty: 5, balance: 0, reference: "INV-003" },
  { id: 7, date: "30 Dec 2025", item: "External SSD 500GB", type: "purchase", qty: 15, balance: 30, reference: "PUR-039" },
  { id: 8, date: "28 Dec 2025", item: "Printer Ink Cartridge", type: "sale", qty: 12, balance: 3, reference: "INV-004" },
];

export default function StockDetail() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateRange, setDateRange] = useState("this-month");

  const filtered = stockMovements.filter((m) => {
    const matchesSearch = m.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || m.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalIn = filtered.filter((m) => m.type === "purchase").reduce((sum, m) => sum + m.qty, 0);
  const totalOut = filtered.filter((m) => m.type === "sale").reduce((sum, m) => sum + m.qty, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Stock Detail</h1>
          <p className="text-muted-foreground">Track stock movements in detail</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Stock In</p>
            <ArrowUpCircle className="w-4 h-4 text-success" />
          </div>
          <p className="text-2xl font-bold mt-2 text-success">{totalIn} units</p>
          <p className="text-xs text-muted-foreground mt-1">From purchases</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Stock Out</p>
            <ArrowDownCircle className="w-4 h-4 text-destructive" />
          </div>
          <p className="text-2xl font-bold mt-2 text-destructive">{totalOut} units</p>
          <p className="text-xs text-muted-foreground mt-1">From sales</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Net Movement</p>
            <Package className="w-4 h-4 text-primary" />
          </div>
          <p className={cn("text-2xl font-bold mt-2", totalIn - totalOut >= 0 ? "text-success" : "text-destructive")}>
            {totalIn - totalOut >= 0 ? "+" : ""}{totalIn - totalOut} units
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search items or reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="purchase">Stock In</SelectItem>
            <SelectItem value="sale">Stock Out</SelectItem>
          </SelectContent>
        </Select>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="this-week">This Week</SelectItem>
            <SelectItem value="this-month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Data Table */}
      <div className="metric-card overflow-hidden p-0">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Item</th>
              <th>Type</th>
              <th>Reference</th>
              <th className="text-center">Quantity</th>
              <th className="text-center">Balance</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((movement) => (
              <tr key={movement.id}>
                <td className="text-muted-foreground">{movement.date}</td>
                <td className="font-medium">{movement.item}</td>
                <td>
                  <span className={cn(
                    "inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full",
                    movement.type === "purchase" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                  )}>
                    {movement.type === "purchase" ? <ArrowUpCircle className="w-3 h-3" /> : <ArrowDownCircle className="w-3 h-3" />}
                    {movement.type === "purchase" ? "Stock In" : "Stock Out"}
                  </span>
                </td>
                <td className="font-medium">{movement.reference}</td>
                <td className={cn("text-center font-medium", movement.type === "purchase" ? "text-success" : "text-destructive")}>
                  {movement.type === "purchase" ? "+" : "-"}{movement.qty}
                </td>
                <td className="text-center">{movement.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
