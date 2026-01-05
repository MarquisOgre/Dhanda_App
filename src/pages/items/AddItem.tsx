import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export default function AddItem() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    salePrice: "",
    purchasePrice: "",
    unit: "PCS",
    openingStock: "",
    minStock: "",
    hsn: "",
    gst: "18",
  });

  useEffect(() => {
    if (user) {
      fetchCategories();
    }
  }, [user]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("id, name")
      .order("name");
    if (data) setCategories(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to add an item");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("Item name is required");
      return;
    }

    setLoading(true);
    try {
      const openingStock = formData.openingStock ? parseFloat(formData.openingStock) : 0;
      
      const { error } = await supabase.from("items").insert({
        user_id: user.id,
        name: formData.name.trim(),
        category_id: formData.categoryId || null,
        sale_price: formData.salePrice ? parseFloat(formData.salePrice) : 0,
        purchase_price: formData.purchasePrice ? parseFloat(formData.purchasePrice) : 0,
        unit: formData.unit,
        opening_stock: openingStock,
        current_stock: openingStock,
        low_stock_alert: formData.minStock ? parseFloat(formData.minStock) : 10,
        hsn_code: formData.hsn || null,
        tax_rate: parseFloat(formData.gst),
      });

      if (error) throw error;
      toast.success("Item added successfully!");
      navigate("/items");
    } catch (error: any) {
      toast.error(error.message || "Failed to add item");
    } finally {
      setLoading(false);
    }
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
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => handleChange("categoryId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
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
                    <SelectItem value="PCS">Pieces (Pcs)</SelectItem>
                    <SelectItem value="KG">Kilograms (Kg)</SelectItem>
                    <SelectItem value="LTR">Liters (Ltr)</SelectItem>
                    <SelectItem value="MTR">Meters (Mtr)</SelectItem>
                    <SelectItem value="BOX">Box</SelectItem>
                    <SelectItem value="DOZEN">Dozen</SelectItem>
                  </SelectContent>
                </Select>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4 border-t border-border">
            <Button type="submit" className="btn-gradient gap-2" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
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
