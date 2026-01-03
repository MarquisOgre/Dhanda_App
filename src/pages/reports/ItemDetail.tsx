import { useState } from "react";
import { Download, Search, Package, TrendingUp, IndianRupee, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const itemsData = [
  { id: 1, name: "Laptop Dell Inspiron 15", hsn: "8471", category: "Electronics", stock: 25, purchaseRate: 35000, saleRate: 45000, lastPurchase: "01 Jan 2026", lastSale: "02 Jan 2026" },
  { id: 2, name: "Wireless Mouse Logitech", hsn: "8471", category: "Accessories", stock: 150, purchaseRate: 600, saleRate: 850, lastPurchase: "28 Dec 2025", lastSale: "02 Jan 2026" },
  { id: 3, name: "USB-C Hub 7-in-1", hsn: "8471", category: "Accessories", stock: 8, purchaseRate: 900, saleRate: 1200, lastPurchase: "25 Dec 2025", lastSale: "01 Jan 2026" },
  { id: 4, name: "Keyboard Mechanical RGB", hsn: "8471", category: "Accessories", stock: 45, purchaseRate: 2500, saleRate: 3500, lastPurchase: "31 Dec 2025", lastSale: "30 Dec 2025" },
  { id: 5, name: "Monitor 24 inch LED", hsn: "8528", category: "Electronics", stock: 0, purchaseRate: 10000, saleRate: 12000, lastPurchase: "15 Dec 2025", lastSale: "30 Dec 2025" },
  { id: 6, name: "Printer Ink Cartridge", hsn: "8443", category: "Consumables", stock: 3, purchaseRate: 550, saleRate: 650, lastPurchase: "20 Dec 2025", lastSale: "28 Dec 2025" },
  { id: 7, name: "External SSD 500GB", hsn: "8471", category: "Storage", stock: 30, purchaseRate: 4500, saleRate: 5500, lastPurchase: "30 Dec 2025", lastSale: "29 Dec 2025" },
];

export default function ItemDetail() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filtered = itemsData.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.hsn.includes(searchQuery);
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalItems = itemsData.length;
  const totalStockValue = itemsData.reduce((sum, i) => sum + (i.stock * i.purchaseRate), 0);
  const avgMargin = itemsData.reduce((sum, i) => sum + ((i.saleRate - i.purchaseRate) / i.purchaseRate * 100), 0) / totalItems;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Item Detail Report</h1>
          <p className="text-muted-foreground">Comprehensive item information</p>
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
            <IndianRupee className="w-4 h-4 text-success" />
          </div>
          <p className="text-2xl font-bold mt-2">₹{totalStockValue.toLocaleString()}</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Avg Margin</p>
            <TrendingUp className="w-4 h-4 text-success" />
          </div>
          <p className="text-2xl font-bold mt-2 text-success">{avgMargin.toFixed(1)}%</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Categories</p>
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold mt-2">4</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or HSN..."
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
              <th>HSN</th>
              <th>Category</th>
              <th className="text-center">Stock</th>
              <th className="text-right">Purchase Rate</th>
              <th className="text-right">Sale Rate</th>
              <th className="text-right">Margin</th>
              <th>Last Purchase</th>
              <th>Last Sale</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => {
              const margin = ((item.saleRate - item.purchaseRate) / item.purchaseRate * 100).toFixed(1);
              return (
                <tr key={item.id}>
                  <td className="font-medium">{item.name}</td>
                  <td className="text-muted-foreground">{item.hsn}</td>
                  <td>{item.category}</td>
                  <td className="text-center">{item.stock}</td>
                  <td className="text-right">₹{item.purchaseRate.toLocaleString()}</td>
                  <td className="text-right">₹{item.saleRate.toLocaleString()}</td>
                  <td className="text-right text-success">{margin}%</td>
                  <td className="text-muted-foreground text-sm">{item.lastPurchase}</td>
                  <td className="text-muted-foreground text-sm">{item.lastSale}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
