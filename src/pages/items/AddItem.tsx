import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const categories = [
  "Electronics",
  "Mobiles",
  "Computers",
  "Accessories",
  "Printers",
  "Home Appliances",
];

export default function AddItem() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    description: "",
    salePrice: "",
    purchasePrice: "",
    unit: "Pcs",
    openingStock: "",
    minStock: "",
    hsn: "",
    gst: "18",
    cess: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Item added successfully!");
    navigate("/items");
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/items">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Add New Item</h1>
          <p className="text-muted-foreground">Create a new product or service</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="metric-card space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter item name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU / Item Code</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => handleChange("sku", e.target.value)}
                  placeholder="e.g., SAM-TV-43"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleChange("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) => handleChange("unit", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pcs">Pieces (Pcs)</SelectItem>
                    <SelectItem value="Kg">Kilograms (Kg)</SelectItem>
                    <SelectItem value="Ltr">Liters (Ltr)</SelectItem>
                    <SelectItem value="Mtr">Meters (Mtr)</SelectItem>
                    <SelectItem value="Box">Box</SelectItem>
                    <SelectItem value="Dozen">Dozen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Enter item description"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salePrice">Sale Price *</Label>
                <Input
                  id="salePrice"
                  type="number"
                  value={formData.salePrice}
                  onChange={(e) => handleChange("salePrice", e.target.value)}
                  placeholder="₹0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchasePrice">Purchase Price</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  value={formData.purchasePrice}
                  onChange={(e) => handleChange("purchasePrice", e.target.value)}
                  placeholder="₹0"
                />
              </div>
            </div>
          </div>

          {/* Stock */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Stock</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="openingStock">Opening Stock</Label>
                <Input
                  id="openingStock"
                  type="number"
                  value={formData.openingStock}
                  onChange={(e) => handleChange("openingStock", e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minStock">Minimum Stock Level</Label>
                <Input
                  id="minStock"
                  type="number"
                  value={formData.minStock}
                  onChange={(e) => handleChange("minStock", e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Tax Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Tax Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hsn">HSN/SAC Code</Label>
                <Input
                  id="hsn"
                  value={formData.hsn}
                  onChange={(e) => handleChange("hsn", e.target.value)}
                  placeholder="e.g., 8528"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gst">GST Rate (%)</Label>
                <Select
                  value={formData.gst}
                  onValueChange={(value) => handleChange("gst", value)}
                >
                  <SelectTrigger>
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="cess">Cess (%)</Label>
                <Input
                  id="cess"
                  type="number"
                  value={formData.cess}
                  onChange={(e) => handleChange("cess", e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4 border-t border-border">
            <Button type="submit" className="btn-gradient gap-2">
              <Save className="w-4 h-4" />
              Save Item
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link to="/items">Cancel</Link>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
