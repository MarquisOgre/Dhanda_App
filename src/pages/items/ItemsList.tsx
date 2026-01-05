import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  MoreHorizontal,
  Package,
  AlertTriangle,
  Loader2,
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
}

export default function ItemsList() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

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
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Item</DropdownMenuItem>
                          <DropdownMenuItem>Adjust Stock</DropdownMenuItem>
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
    </div>
  );
}