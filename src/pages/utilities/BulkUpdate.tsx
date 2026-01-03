import { useState } from "react";
import { Search, Edit2, Save, Package, Filter, CheckSquare, Square } from "lucide-react";
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

const itemsData = [
  { id: 1, name: "Laptop Dell Inspiron 15", category: "Electronics", salePrice: 45000, purchasePrice: 35000, stock: 25, selected: false },
  { id: 2, name: "Wireless Mouse Logitech", category: "Accessories", salePrice: 850, purchasePrice: 600, stock: 150, selected: false },
  { id: 3, name: "USB-C Hub 7-in-1", category: "Accessories", salePrice: 1200, purchasePrice: 900, stock: 8, selected: false },
  { id: 4, name: "Keyboard Mechanical RGB", category: "Accessories", salePrice: 3500, purchasePrice: 2500, stock: 45, selected: false },
  { id: 5, name: "Monitor 24 inch LED", category: "Electronics", salePrice: 12000, purchasePrice: 10000, stock: 0, selected: false },
  { id: 6, name: "Printer Ink Cartridge", category: "Consumables", salePrice: 650, purchasePrice: 550, stock: 3, selected: false },
  { id: 7, name: "External SSD 500GB", category: "Storage", salePrice: 5500, purchasePrice: 4500, stock: 30, selected: false },
];

export default function BulkUpdate() {
  const [items, setItems] = useState(itemsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [bulkAction, setBulkAction] = useState("");
  const [bulkValue, setBulkValue] = useState("");
  const [editingField, setEditingField] = useState<{ id: number; field: string } | null>(null);

  const selectedCount = items.filter(i => i.selected).length;

  const toggleSelect = (id: number) => {
    setItems(items.map(i => i.id === id ? { ...i, selected: !i.selected } : i));
  };

  const toggleSelectAll = () => {
    const allSelected = items.every(i => i.selected);
    setItems(items.map(i => ({ ...i, selected: !allSelected })));
  };

  const filtered = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const applyBulkUpdate = () => {
    if (!bulkAction || !bulkValue) return;

    const numValue = parseFloat(bulkValue);
    
    setItems(items.map(item => {
      if (!item.selected) return item;
      
      switch (bulkAction) {
        case "increase-sale-percent":
          return { ...item, salePrice: Math.round(item.salePrice * (1 + numValue / 100)) };
        case "decrease-sale-percent":
          return { ...item, salePrice: Math.round(item.salePrice * (1 - numValue / 100)) };
        case "set-category":
          return { ...item, category: bulkValue };
        default:
          return item;
      }
    }));

    setBulkAction("");
    setBulkValue("");
  };

  const updateItemField = (id: number, field: string, value: number) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
    setEditingField(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Update Items in Bulk</h1>
          <p className="text-muted-foreground">Edit multiple items at once</p>
        </div>
        <Button className="btn-gradient gap-2">
          <Save className="w-4 h-4" />
          Save All Changes
        </Button>
      </div>

      {/* Bulk Actions */}
      <div className="metric-card">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">{selectedCount} items selected</span>
          </div>
          
          <Select value={bulkAction} onValueChange={setBulkAction}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Bulk action..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="increase-sale-percent">Increase Sale Price %</SelectItem>
              <SelectItem value="decrease-sale-percent">Decrease Sale Price %</SelectItem>
              <SelectItem value="set-category">Change Category</SelectItem>
            </SelectContent>
          </Select>

          {bulkAction && (
            <>
              <Input
                placeholder={bulkAction.includes("category") ? "Category name" : "Percentage"}
                value={bulkValue}
                onChange={(e) => setBulkValue(e.target.value)}
                className="w-[150px]"
              />
              <Button onClick={applyBulkUpdate} disabled={!bulkValue}>
                Apply
              </Button>
            </>
          )}
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

      {/* Items Table */}
      <div className="metric-card overflow-hidden p-0">
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-12">
                <button onClick={toggleSelectAll} className="p-1">
                  {items.every(i => i.selected) ? (
                    <CheckSquare className="w-5 h-5 text-primary" />
                  ) : (
                    <Square className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
              </th>
              <th>Item Name</th>
              <th>Category</th>
              <th className="text-right">Sale Price</th>
              <th className="text-right">Purchase Price</th>
              <th className="text-center">Stock</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className={cn(item.selected && "bg-primary/5")}>
                <td>
                  <button onClick={() => toggleSelect(item.id)} className="p-1">
                    {item.selected ? (
                      <CheckSquare className="w-5 h-5 text-primary" />
                    ) : (
                      <Square className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                </td>
                <td className="font-medium">{item.name}</td>
                <td>{item.category}</td>
                <td className="text-right">
                  {editingField?.id === item.id && editingField?.field === "salePrice" ? (
                    <Input
                      type="number"
                      defaultValue={item.salePrice}
                      className="w-24 h-8 text-right"
                      autoFocus
                      onBlur={(e) => updateItemField(item.id, "salePrice", Number(e.target.value))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          updateItemField(item.id, "salePrice", Number((e.target as HTMLInputElement).value));
                        }
                      }}
                    />
                  ) : (
                    <span
                      className="cursor-pointer hover:text-primary"
                      onClick={() => setEditingField({ id: item.id, field: "salePrice" })}
                    >
                      ₹{item.salePrice.toLocaleString()}
                    </span>
                  )}
                </td>
                <td className="text-right">
                  {editingField?.id === item.id && editingField?.field === "purchasePrice" ? (
                    <Input
                      type="number"
                      defaultValue={item.purchasePrice}
                      className="w-24 h-8 text-right"
                      autoFocus
                      onBlur={(e) => updateItemField(item.id, "purchasePrice", Number(e.target.value))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          updateItemField(item.id, "purchasePrice", Number((e.target as HTMLInputElement).value));
                        }
                      }}
                    />
                  ) : (
                    <span
                      className="cursor-pointer hover:text-primary text-muted-foreground"
                      onClick={() => setEditingField({ id: item.id, field: "purchasePrice" })}
                    >
                      ₹{item.purchasePrice.toLocaleString()}
                    </span>
                  )}
                </td>
                <td className="text-center">{item.stock}</td>
                <td>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
