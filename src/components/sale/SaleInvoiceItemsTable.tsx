import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useBusinessSettings } from "@/contexts/BusinessContext";
import { SearchableItemSelect } from "@/components/invoice/SearchableItemSelect";

export interface InvoiceItem {
  id: number;
  itemId: string;
  categoryId: string;
  name: string;
  hsn: string;
  quantity: number;
  availableStock: number;
  closingStock: number;
  unit: string;
  rate: number;
  discount: number;
  taxRate: number;
  amount: number;
}

interface SaleInvoiceItemsTableProps {
  items: InvoiceItem[];
  onItemsChange: (items: InvoiceItem[]) => void;
}

interface DbItem {
  id: string;
  name: string;
  hsn_code: string | null;
  sale_price: number | null;
  current_stock: number | null;
  unit: string | null;
  category_id: string | null;
}

interface Category {
  id: string;
  name: string;
}

interface UnitOption {
  id: string;
  name: string;
}

export function SaleInvoiceItemsTable({ items, onItemsChange }: SaleInvoiceItemsTableProps) {
  const { user } = useAuth();
  const { businessSettings } = useBusinessSettings();
  const defaultTaxRate = businessSettings?.gst_receivable ?? 0;
  const [dbItems, setDbItems] = useState<DbItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [unitOptions, setUnitOptions] = useState<UnitOption[]>([]);

  useEffect(() => {
    if (user) {
      fetchItems();
      fetchCategories();
      fetchUnits();
    }
  }, [user]);

  const fetchItems = async () => {
    const { data } = await supabase
      .from("items")
      .select("id, name, hsn_code, sale_price, current_stock, unit, category_id")
      .eq("is_deleted", false)
      .order("name");
    if (data) {
      setDbItems(data);
    }
  };

  const fetchCategories = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("categories")
      .select("id, name")
      .eq("user_id", user.id)
      .order("name");
    if (data) {
      setCategories(data);
    }
  };

  const fetchUnits = async () => {
    // Fetch all units (global for all users)
    const { data } = await supabase
      .from("units")
      .select("id, name")
      .order("name");
    if (data && data.length > 0) {
      setUnitOptions(data);
    } else {
      setUnitOptions([{ id: 'default', name: 'Bottles' }]);
    }
  };

  const addItem = () => {
    const defaultUnit = unitOptions.length > 0 ? unitOptions[0].name : "Bottles";
    const newItem: InvoiceItem = {
      id: Date.now(),
      itemId: "",
      categoryId: "",
      name: "",
      hsn: "",
      quantity: 0,
      availableStock: 0,
      closingStock: 0,
      unit: defaultUnit,
      rate: 0,
      discount: 0,
      taxRate: defaultTaxRate,
      amount: 0,
    };
    onItemsChange([...items, newItem]);
  };

  const getFilteredItems = (categoryId: string) => {
    if (!categoryId) return dbItems;
    return dbItems.filter(item => item.category_id === categoryId);
  };

  const updateItem = (id: number, field: keyof InvoiceItem, value: string | number) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // If category changed, reset item selection
        if (field === "categoryId") {
          updatedItem.itemId = "";
          updatedItem.name = "";
          updatedItem.hsn = "";
          updatedItem.rate = 0;
          updatedItem.availableStock = 0;
          updatedItem.closingStock = 0;
          updatedItem.quantity = 0;
          updatedItem.amount = 0;
        }
        
        // If item selection changed, update related fields
        if (field === "itemId") {
          const selectedItem = dbItems.find((i) => i.id === value);
          if (selectedItem) {
            updatedItem.name = selectedItem.name;
            updatedItem.hsn = selectedItem.hsn_code || "";
            updatedItem.rate = selectedItem.sale_price || 0;
            updatedItem.availableStock = selectedItem.current_stock || 0;
            updatedItem.closingStock = selectedItem.current_stock || 0;
            updatedItem.quantity = 0;
            updatedItem.unit = selectedItem.unit || "Bottles";
            updatedItem.categoryId = selectedItem.category_id || "";
            updatedItem.taxRate = defaultTaxRate;
          }
        }
        
        // When closing stock changes, calculate quantity = available - closing
        if (field === "closingStock") {
          const closingVal = Math.max(0, Math.min(value as number, updatedItem.availableStock));
          updatedItem.closingStock = closingVal;
          updatedItem.quantity = Math.max(0, updatedItem.availableStock - closingVal);
        }
        
        // Recalculate amount (without item-level tax - tax on subtotal)
        const subtotal = updatedItem.quantity * updatedItem.rate;
        const discountAmount = (subtotal * updatedItem.discount) / 100;
        updatedItem.amount = subtotal - discountAmount;
        
        return updatedItem;
      }
      return item;
    });
    onItemsChange(updated);
  };

  const removeItem = (id: number) => {
    onItemsChange(items.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 font-medium text-muted-foreground">#</th>
              <th className="text-left py-3 px-2 font-medium text-muted-foreground min-w-[140px]">Category</th>
              <th className="text-left py-3 px-2 font-medium text-muted-foreground min-w-[180px]">Item</th>
              <th className="text-left py-3 px-2 font-medium text-muted-foreground">HSN</th>
              <th className="text-left py-3 px-2 font-medium text-muted-foreground">Avl. Stock</th>
              <th className="text-left py-3 px-2 font-medium text-muted-foreground">Cls. Stock</th>
              <th className="text-left py-3 px-2 font-medium text-muted-foreground">Sale Qty</th>
              <th className="text-left py-3 px-2 font-medium text-muted-foreground">Unit</th>
              <th className="text-left py-3 px-2 font-medium text-muted-foreground">Rate</th>
              <th className="text-left py-3 px-2 font-medium text-muted-foreground">Disc %</th>
              <th className="text-right py-3 px-2 font-medium text-muted-foreground">Amount</th>
              <th className="py-3 px-2"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id} className="border-b border-border/50">
                <td className="py-2 px-2 text-muted-foreground">{index + 1}</td>
                <td className="py-2 px-2">
                  <Select
                    value={item.categoryId || "all"}
                    onValueChange={(value) => updateItem(item.id, "categoryId", value === "all" ? "" : value)}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="py-2 px-2">
                  <SearchableItemSelect
                    items={getFilteredItems(item.categoryId).map((si) => ({
                      id: si.id,
                      name: si.name,
                    }))}
                    value={item.itemId}
                    onSelect={(value) => updateItem(item.id, "itemId", value)}
                    placeholder="Select item"
                    emptyText="No items found."
                    className="w-full min-w-[150px]"
                  />
                </td>
                <td className="py-2 px-2">
                  <Input
                    value={item.hsn}
                    onChange={(e) => updateItem(item.id, "hsn", e.target.value)}
                    className="h-9 w-20"
                  />
                </td>
                <td className="py-2 px-2 text-center">
                  <span className="text-muted-foreground font-medium">
                    {item.availableStock}
                  </span>
                </td>
                <td className="py-2 px-2">
                  <Input
                    type="number"
                    value={item.closingStock === 0 ? "" : item.closingStock}
                    onChange={(e) => updateItem(item.id, "closingStock", Number(e.target.value) || 0)}
                    onFocus={(e) => {
                      if (e.target.value === "0" || e.target.value === "") {
                        e.target.value = "";
                      }
                    }}
                    placeholder="0"
                    className="h-9 w-20"
                    min={0}
                    max={item.availableStock}
                  />
                </td>
                <td className="py-2 px-2 text-center">
                  <span className={item.quantity > 0 ? "text-primary font-medium" : "text-muted-foreground"}>
                    {item.quantity}
                  </span>
                </td>
                <td className="py-2 px-2">
                  <Select
                    value={item.unit || (unitOptions[0]?.name || "Bottles")}
                    onValueChange={(value) => updateItem(item.id, "unit", value)}
                  >
                    <SelectTrigger className="h-9 w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {unitOptions.map((unit) => (
                        <SelectItem key={unit.id} value={unit.name}>
                          {unit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="py-2 px-2">
                  <Input
                    type="number"
                    value={item.rate || ""}
                    onChange={(e) => updateItem(item.id, "rate", Number(e.target.value))}
                    onFocus={(e) => e.target.value === "0" && (e.target.value = "")}
                    className="h-9 w-24"
                    min={0}
                  />
                </td>
                <td className="py-2 px-2">
                  <Input
                    type="number"
                    value={item.discount || ""}
                    onChange={(e) => updateItem(item.id, "discount", Number(e.target.value))}
                    onFocus={(e) => e.target.value === "0" && (e.target.value = "")}
                    className="h-9 w-16"
                    min={0}
                    max={100}
                  />
                </td>
                <td className="py-2 px-2 text-right font-medium">
                  ₹{item.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </td>
                <td className="py-2 px-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
          {items.length > 0 && (
            <tfoot>
              <tr className="bg-muted/50 font-semibold border-t">
                <td colSpan={4} className="py-2 px-2 text-right">Totals:</td>
                <td className="py-2 px-2 text-center">{items.reduce((sum, item) => sum + item.availableStock, 0)}</td>
                <td className="py-2 px-2 text-center">{items.reduce((sum, item) => sum + item.closingStock, 0)}</td>
                <td className="py-2 px-2 text-center text-primary">{items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                <td colSpan={3}></td>
                <td className="py-2 px-2 text-right">₹{items.reduce((sum, item) => sum + item.amount, 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      <Button variant="outline" onClick={addItem} className="gap-2">
        <Plus className="w-4 h-4" />
        Add Item
      </Button>
    </div>
  );
}
