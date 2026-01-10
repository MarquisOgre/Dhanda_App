import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  MoreHorizontal,
  Package,
  AlertTriangle,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Item {
  id: string;
  name: string;
  hsn_code: string | null;
  unit: string | null;
  sale_price: number | null;
  purchase_price: number | null;
  current_stock: number | null;
  low_stock_alert: number | null;
  tax_rate: number | null;
  category_id: string | null;
  tcs_rate: number | null;
  tds_rate: number | null;
}

export default function ItemsList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showAdjustStock, setShowAdjustStock] = useState(false);
  const [stockAdjustment, setStockAdjustment] = useState({ type: "add", quantity: 0, notes: "" });

  useEffect(() => {
    if (user) {
      fetchItems();
    }
  }, [user]);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch items: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    
    try {
      const { error } = await supabase
        .from("items")
        .update({ is_deleted: true, deleted_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
      toast.success("Item deleted successfully");
      fetchItems();
    } catch (error: any) {
      toast.error("Failed to delete item: " + error.message);
    }
  };

  const handleAdjustStock = async () => {
    if (!selectedItem) return;
    
    const adjustment = stockAdjustment.type === "add" 
      ? stockAdjustment.quantity 
      : -stockAdjustment.quantity;
    
    const newStock = (selectedItem.current_stock || 0) + adjustment;
    
    try {
      const { error } = await supabase
        .from("items")
        .update({ current_stock: newStock })
        .eq("id", selectedItem.id);
      
      if (error) throw error;
      toast.success("Stock adjusted successfully");
      setShowAdjustStock(false);
      setStockAdjustment({ type: "add", quantity: 0, notes: "" });
      fetchItems();
    } catch (error: any) {
      toast.error("Failed to adjust stock: " + error.message);
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.hsn_code && item.hsn_code.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
          <Button variant="outline" asChild>
            <Link to="/utilities/import">Bulk Import</Link>
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
          placeholder="Search by name or HSN code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Items Table */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No items found</p>
          <Button asChild className="mt-4">
            <Link to="/items/add">Add your first item</Link>
          </Button>
        </div>
      ) : (
        <div className="metric-card overflow-hidden p-0">
          <table className="data-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>HSN</th>
                <th className="text-right">Sale Price</th>
                <th className="text-right">Purchase Price</th>
                <th className="text-right">Stock</th>
                <th className="text-right">GST</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const stock = item.current_stock || 0;
                const minStock = item.low_stock_alert || 10;
                
                return (
                  <tr key={item.id} className="group">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <Package className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.unit || "PCS"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-muted-foreground">{item.hsn_code || "-"}</td>
                    <td className="text-right font-medium">
                      ₹{(item.sale_price || 0).toLocaleString()}
                    </td>
                    <td className="text-right text-muted-foreground">
                      ₹{(item.purchase_price || 0).toLocaleString()}
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {stock <= minStock && (
                          <AlertTriangle className="w-4 h-4 text-warning" />
                        )}
                        <span
                          className={cn(
                            "font-medium",
                            stock <= minStock && "text-warning",
                            stock === 0 && "text-destructive"
                          )}
                        >
                          {stock} {item.unit || "PCS"}
                        </span>
                      </div>
                    </td>
                    <td className="text-right text-muted-foreground">{item.tax_rate || 0}%</td>
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
                          <DropdownMenuItem onClick={() => {
                            setSelectedItem(item);
                            setShowDetails(true);
                          }}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/items/edit/${item.id}`)}>
                            Edit Item
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedItem(item);
                            setShowAdjustStock(true);
                          }}>
                            Adjust Stock
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDelete(item.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* View Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Item Details</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                  <Package className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{selectedItem.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedItem.unit || "PCS"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">HSN Code</p>
                  <p className="font-medium">{selectedItem.hsn_code || "N/A"}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">GST Rate</p>
                  <p className="font-medium">{selectedItem.tax_rate || 0}%</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Sale Price</p>
                  <p className="font-medium text-success">₹{(selectedItem.sale_price || 0).toLocaleString()}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Purchase Price</p>
                  <p className="font-medium">₹{(selectedItem.purchase_price || 0).toLocaleString()}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Current Stock</p>
                  <p className={cn(
                    "font-medium",
                    (selectedItem.current_stock || 0) <= (selectedItem.low_stock_alert || 10) && "text-warning"
                  )}>
                    {selectedItem.current_stock || 0} {selectedItem.unit || "PCS"}
                  </p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Low Stock Alert</p>
                  <p className="font-medium">{selectedItem.low_stock_alert || 10} {selectedItem.unit || "PCS"}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">TCS Rate</p>
                  <p className="font-medium">{selectedItem.tcs_rate || 0}%</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">TDS Rate</p>
                  <p className="font-medium">{selectedItem.tds_rate || 0}%</p>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowDetails(false)}>
                  Close
                </Button>
                <Button className="flex-1" onClick={() => {
                  setShowDetails(false);
                  navigate(`/items/edit/${selectedItem.id}`);
                }}>
                  Edit Item
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Adjust Stock Dialog */}
      <Dialog open={showAdjustStock} onOpenChange={setShowAdjustStock}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adjust Stock - {selectedItem?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Current Stock</p>
              <p className="text-xl font-semibold">{selectedItem?.current_stock || 0} {selectedItem?.unit || "PCS"}</p>
            </div>
            <div className="space-y-2">
              <Label>Adjustment Type</Label>
              <Select 
                value={stockAdjustment.type} 
                onValueChange={(value) => setStockAdjustment(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">Add Stock</SelectItem>
                  <SelectItem value="remove">Remove Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input
                type="number"
                min="0"
                value={stockAdjustment.quantity}
                onChange={(e) => setStockAdjustment(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Input
                placeholder="Reason for adjustment..."
                value={stockAdjustment.notes}
                onChange={(e) => setStockAdjustment(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">New Stock</p>
              <p className="text-xl font-semibold">
                {stockAdjustment.type === "add" 
                  ? (selectedItem?.current_stock || 0) + stockAdjustment.quantity
                  : (selectedItem?.current_stock || 0) - stockAdjustment.quantity
                } {selectedItem?.unit || "PCS"}
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => {
                setShowAdjustStock(false);
                setStockAdjustment({ type: "add", quantity: 0, notes: "" });
              }}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleAdjustStock}>
                Save Adjustment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}