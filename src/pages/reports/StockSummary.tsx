import { useState } from "react";
import { Download, Search, Package, AlertTriangle, TrendingUp } from "lucide-react";
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

const stockData = [
  { id: 1, name: "Laptop Dell Inspiron 15", category: "Electronics", stock: 25, minStock: 10, value: 1125000, status: "in-stock" },
  { id: 2, name: "Wireless Mouse Logitech", category: "Accessories", stock: 150, minStock: 50, value: 127500, status: "in-stock" },
  { id: 3, name: "USB-C Hub 7-in-1", category: "Accessories", stock: 8, minStock: 20, value: 9600, status: "low" },
  { id: 4, name: "Keyboard Mechanical RGB", category: "Accessories", stock: 45, minStock: 15, value: 157500, status: "in-stock" },
  { id: 5, name: "Monitor 24 inch LED", category: "Electronics", stock: 0, minStock: 5, value: 0, status: "out" },
  { id: 6, name: "Printer Ink Cartridge", category: "Consumables", stock: 3, minStock: 25, value: 1950, status: "low" },
  { id: 7, name: "External SSD 500GB", category: "Storage", stock: 30, minStock: 10, value: 165000, status: "in-stock" },
];

export default function StockSummary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filtered = stockData.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalItems = stockData.length;
  const totalValue = stockData.reduce((sum, s) => sum + s.value, 0);
  const lowStockItems = stockData.filter((s) => s.status === "low").length;
  const outOfStock = stockData.filter((s) => s.status === "out").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-stock":
        return "bg-success/10 text-success";
      case "low":
        return "bg-warning/10 text-warning";
      case "out":
        return "bg-destructive/10 text-destructive";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Stock Summary</h1>
          <p className="text-muted-foreground">Overview of current inventory</p>
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
            <p className="text-sm text-muted-foreground">Total Items</p>
            <Package className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold mt-2">{totalItems}</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Stock Value</p>
            <TrendingUp className="w-4 h-4 text-success" />
          </div>
          <p className="text-2xl font-bold mt-2">₹{totalValue.toLocaleString()}</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Low Stock Items</p>
            <AlertTriangle className="w-4 h-4 text-warning" />
          </div>
          <p className="text-2xl font-bold mt-2 text-warning">{lowStockItems}</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Out of Stock</p>
            <AlertTriangle className="w-4 h-4 text-destructive" />
          </div>
          <p className="text-2xl font-bold mt-2 text-destructive">{outOfStock}</p>
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
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Electronics">Electronics</SelectItem>
            <SelectItem value="Accessories">Accessories</SelectItem>
            <SelectItem value="Consumables">Consumables</SelectItem>
            <SelectItem value="Storage">Storage</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Data Table */}
      <div className="metric-card overflow-hidden p-0">
        <table className="data-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Category</th>
              <th className="text-center">Current Stock</th>
              <th className="text-center">Min Stock</th>
              <th className="text-right">Stock Value</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td className="font-medium">{item.name}</td>
                <td className="text-muted-foreground">{item.category}</td>
                <td className="text-center">{item.stock}</td>
                <td className="text-center text-muted-foreground">{item.minStock}</td>
                <td className="text-right font-medium">₹{item.value.toLocaleString()}</td>
                <td>
                  <span className={cn("px-2 py-1 text-xs font-medium rounded-full capitalize", getStatusBadge(item.status))}>
                    {item.status === "in-stock" ? "In Stock" : item.status === "low" ? "Low Stock" : "Out of Stock"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-muted/50 font-semibold">
              <td colSpan={4}>Total</td>
              <td className="text-right">₹{filtered.reduce((sum, s) => sum + s.value, 0).toLocaleString()}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
