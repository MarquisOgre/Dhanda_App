import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, MoreHorizontal, FileText, Loader2 } from "lucide-react";
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
import { format } from "date-fns";

interface PurchaseOrder {
  id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string | null;
  total_amount: number | null;
  status: string | null;
  parties?: { name: string } | null;
}

export default function PurchaseOrderList() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("invoices")
        .select("*, parties(name)")
        .eq("invoice_type", "purchase_order")
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch purchase orders: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    
    try {
      const { error } = await supabase
        .from("invoices")
        .update({ is_deleted: true, deleted_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
      toast.success("Order cancelled successfully");
      fetchOrders();
    } catch (error: any) {
      toast.error("Failed to cancel order: " + error.message);
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.parties?.name && order.parties.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusBadge = (status: string | null) => {
    const styles: Record<string, string> = {
      confirmed: "bg-success/10 text-success",
      pending: "bg-warning/10 text-warning",
      delivered: "bg-primary/10 text-primary",
      cancelled: "bg-destructive/10 text-destructive",
    };
    return styles[status || "pending"] || "";
  };

  const totalAmount = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);

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
          <h1 className="text-2xl font-bold">Purchase Orders</h1>
          <p className="text-muted-foreground">Manage purchase orders to suppliers</p>
        </div>
        <Button asChild className="btn-gradient gap-2">
          <Link to="/purchase/order/new">
            <Plus className="w-4 h-4" />
            New Purchase Order
          </Link>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <p className="text-sm text-muted-foreground">Total Orders</p>
          <p className="text-2xl font-bold mt-1">₹{totalAmount.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">{orders.length} orders</p>
        </div>
        <div className="metric-card">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-warning mt-1">{orders.filter(o => o.status === "pending" || !o.status).length}</p>
        </div>
        <div className="metric-card">
          <p className="text-sm text-muted-foreground">Confirmed</p>
          <p className="text-2xl font-bold text-success mt-1">{orders.filter(o => o.status === "confirmed").length}</p>
        </div>
        <div className="metric-card">
          <p className="text-sm text-muted-foreground">Delivered</p>
          <p className="text-2xl font-bold text-primary mt-1">{orders.filter(o => o.status === "delivered").length}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by order number or supplier..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No purchase orders found</p>
          <Button asChild className="mt-4">
            <Link to="/purchase/order/new">Create your first order</Link>
          </Button>
        </div>
      ) : (
        <div className="metric-card overflow-hidden p-0">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order No.</th>
                <th>Date</th>
                <th>Supplier</th>
                <th>Expected Delivery</th>
                <th className="text-right">Amount</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="group">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-accent" />
                      </div>
                      <span className="font-medium">{order.invoice_number}</span>
                    </div>
                  </td>
                  <td className="text-muted-foreground">
                    {format(new Date(order.invoice_date), "dd MMM yyyy")}
                  </td>
                  <td className="font-medium">{order.parties?.name || "-"}</td>
                  <td className="text-muted-foreground">
                    {order.due_date ? format(new Date(order.due_date), "dd MMM yyyy") : "-"}
                  </td>
                  <td className="text-right font-semibold">₹{(order.total_amount || 0).toLocaleString()}</td>
                  <td>
                    <span
                      className={cn(
                        "px-2 py-1 text-xs font-medium rounded-full capitalize",
                        getStatusBadge(order.status)
                      )}
                    >
                      {order.status || "pending"}
                    </span>
                  </td>
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
                        <DropdownMenuItem>View Order</DropdownMenuItem>
                        <DropdownMenuItem>Convert to Bill</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDelete(order.id)}
                        >
                          Cancel
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}