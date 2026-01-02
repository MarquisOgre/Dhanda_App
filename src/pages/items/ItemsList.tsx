import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  MoreHorizontal,
  Package,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const items = [
  {
    id: 1,
    name: "Samsung LED TV 43\"",
    sku: "SAM-TV-43",
    category: "Electronics",
    salePrice: 32999,
    purchasePrice: 28000,
    stock: 2,
    minStock: 5,
    unit: "Pcs",
    hsn: "8528",
    gst: 18,
  },
  {
    id: 2,
    name: "iPhone 15 Pro Max 256GB",
    sku: "APL-IP15PM",
    category: "Mobiles",
    salePrice: 159900,
    purchasePrice: 142000,
    stock: 1,
    minStock: 3,
    unit: "Pcs",
    hsn: "8517",
    gst: 12,
  },
  {
    id: 3,
    name: "Sony WH-1000XM5 Headphones",
    sku: "SNY-WH1000",
    category: "Accessories",
    salePrice: 29990,
    purchasePrice: 24000,
    stock: 3,
    minStock: 10,
    unit: "Pcs",
    hsn: "8518",
    gst: 18,
  },
  {
    id: 4,
    name: "Dell Inspiron 15 Laptop",
    sku: "DEL-INS15",
    category: "Computers",
    salePrice: 54990,
    purchasePrice: 48000,
    stock: 8,
    minStock: 5,
    unit: "Pcs",
    hsn: "8471",
    gst: 18,
  },
  {
    id: 5,
    name: "Logitech MX Master 3 Mouse",
    sku: "LOG-MXM3",
    category: "Accessories",
    salePrice: 9995,
    purchasePrice: 7500,
    stock: 15,
    minStock: 10,
    unit: "Pcs",
    hsn: "8471",
    gst: 18,
  },
  {
    id: 6,
    name: "HP LaserJet Printer",
    sku: "HP-LJ-M126",
    category: "Printers",
    salePrice: 18500,
    purchasePrice: 15000,
    stock: 4,
    minStock: 3,
    unit: "Pcs",
    hsn: "8443",
    gst: 18,
  },
];

export default function ItemsList() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Items</h1>
          <p className="text-muted-foreground">Manage your products and services</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link to="/items/categories">Categories</Link>
          </Button>
          <Button asChild className="btn-gradient gap-2">
            <Link to="/items/add">
              <Plus className="w-4 h-4" />
              Add Item
            </Link>
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, SKU, or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Items Table */}
      <div className="metric-card overflow-hidden p-0">
        <table className="data-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th className="text-right">Sale Price</th>
              <th className="text-right">Purchase Price</th>
              <th className="text-right">Stock</th>
              <th className="text-right">GST</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id} className="group">
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <Package className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.sku}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-muted">
                    {item.category}
                  </span>
                </td>
                <td className="text-right font-medium">
                  ₹{item.salePrice.toLocaleString()}
                </td>
                <td className="text-right text-muted-foreground">
                  ₹{item.purchasePrice.toLocaleString()}
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {item.stock <= item.minStock && (
                      <AlertTriangle className="w-4 h-4 text-warning" />
                    )}
                    <span
                      className={cn(
                        "font-medium",
                        item.stock <= item.minStock && "text-warning",
                        item.stock === 0 && "text-destructive"
                      )}
                    >
                      {item.stock} {item.unit}
                    </span>
                  </div>
                </td>
                <td className="text-right text-muted-foreground">{item.gst}%</td>
                <td>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Item</DropdownMenuItem>
                      <DropdownMenuItem>Adjust Stock</DropdownMenuItem>
                      <DropdownMenuItem>View Transactions</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
