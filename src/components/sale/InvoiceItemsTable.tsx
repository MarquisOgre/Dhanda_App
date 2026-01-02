import { useState } from "react";
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

export interface InvoiceItem {
  id: number;
  itemId: string;
  name: string;
  hsn: string;
  quantity: number;
  unit: string;
  rate: number;
  discount: number;
  taxRate: number;
  amount: number;
}

interface InvoiceItemsTableProps {
  items: InvoiceItem[];
  onItemsChange: (items: InvoiceItem[]) => void;
}

const sampleItems = [
  { id: "1", name: "Laptop Dell Inspiron 15", hsn: "8471", rate: 45000, unit: "pcs" },
  { id: "2", name: "Wireless Mouse Logitech", hsn: "8471", rate: 850, unit: "pcs" },
  { id: "3", name: "USB-C Hub 7-in-1", hsn: "8471", rate: 1200, unit: "pcs" },
  { id: "4", name: "Keyboard Mechanical RGB", hsn: "8471", rate: 3500, unit: "pcs" },
  { id: "5", name: "Monitor 24 inch LED", hsn: "8528", rate: 12000, unit: "pcs" },
  { id: "6", name: "Printer Ink Cartridge", hsn: "8443", rate: 650, unit: "pcs" },
  { id: "7", name: "External SSD 500GB", hsn: "8471", rate: 5500, unit: "pcs" },
];

export function InvoiceItemsTable({ items, onItemsChange }: InvoiceItemsTableProps) {
  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now(),
      itemId: "",
      name: "",
      hsn: "",
      quantity: 1,
      unit: "pcs",
      rate: 0,
      discount: 0,
      taxRate: 18,
      amount: 0,
    };
    onItemsChange([...items, newItem]);
  };

  const updateItem = (id: number, field: keyof InvoiceItem, value: string | number) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // If item selection changed, update related fields
        if (field === "itemId") {
          const selectedItem = sampleItems.find((i) => i.id === value);
          if (selectedItem) {
            updatedItem.name = selectedItem.name;
            updatedItem.hsn = selectedItem.hsn;
            updatedItem.rate = selectedItem.rate;
            updatedItem.unit = selectedItem.unit;
          }
        }
        
        // Recalculate amount
        const subtotal = updatedItem.quantity * updatedItem.rate;
        const discountAmount = (subtotal * updatedItem.discount) / 100;
        const taxableAmount = subtotal - discountAmount;
        const taxAmount = (taxableAmount * updatedItem.taxRate) / 100;
        updatedItem.amount = taxableAmount + taxAmount;
        
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
              <th className="text-left py-3 px-2 font-medium text-muted-foreground min-w-[200px]">Item</th>
              <th className="text-left py-3 px-2 font-medium text-muted-foreground">HSN</th>
              <th className="text-left py-3 px-2 font-medium text-muted-foreground">Qty</th>
              <th className="text-left py-3 px-2 font-medium text-muted-foreground">Unit</th>
              <th className="text-left py-3 px-2 font-medium text-muted-foreground">Rate</th>
              <th className="text-left py-3 px-2 font-medium text-muted-foreground">Disc %</th>
              <th className="text-left py-3 px-2 font-medium text-muted-foreground">Tax %</th>
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
                    value={item.itemId}
                    onValueChange={(value) => updateItem(item.id, "itemId", value)}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select item" />
                    </SelectTrigger>
                    <SelectContent>
                      {sampleItems.map((si) => (
                        <SelectItem key={si.id} value={si.id}>
                          {si.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="py-2 px-2">
                  <Input
                    value={item.hsn}
                    onChange={(e) => updateItem(item.id, "hsn", e.target.value)}
                    className="h-9 w-20"
                  />
                </td>
                <td className="py-2 px-2">
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                    className="h-9 w-16"
                    min={1}
                  />
                </td>
                <td className="py-2 px-2">
                  <Select
                    value={item.unit}
                    onValueChange={(value) => updateItem(item.id, "unit", value)}
                  >
                    <SelectTrigger className="h-9 w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pcs">Pcs</SelectItem>
                      <SelectItem value="kg">Kg</SelectItem>
                      <SelectItem value="ltr">Ltr</SelectItem>
                      <SelectItem value="mtr">Mtr</SelectItem>
                      <SelectItem value="box">Box</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="py-2 px-2">
                  <Input
                    type="number"
                    value={item.rate}
                    onChange={(e) => updateItem(item.id, "rate", Number(e.target.value))}
                    className="h-9 w-24"
                    min={0}
                  />
                </td>
                <td className="py-2 px-2">
                  <Input
                    type="number"
                    value={item.discount}
                    onChange={(e) => updateItem(item.id, "discount", Number(e.target.value))}
                    className="h-9 w-16"
                    min={0}
                    max={100}
                  />
                </td>
                <td className="py-2 px-2">
                  <Select
                    value={String(item.taxRate)}
                    onValueChange={(value) => updateItem(item.id, "taxRate", Number(value))}
                  >
                    <SelectTrigger className="h-9 w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0%</SelectItem>
                      <SelectItem value="5">5%</SelectItem>
                      <SelectItem value="12">12%</SelectItem>
                      <SelectItem value="18">18%</SelectItem>
                      <SelectItem value="28">28%</SelectItem>
                    </SelectContent>
                  </Select>
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
        </table>
      </div>

      <Button variant="outline" onClick={addItem} className="gap-2">
        <Plus className="w-4 h-4" />
        Add Item
      </Button>
    </div>
  );
}
