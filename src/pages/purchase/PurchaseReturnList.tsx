import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, MoreHorizontal, RotateCcw, Loader2 } from "lucide-react";
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

interface PurchaseReturn {
  id: string;
  invoice_number: string;
  invoice_date: string;
  total_amount: number | null;
  status: string | null;
  notes: string | null;
  parties?: { name: string } | null;
}

export default function PurchaseReturnList() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [returns, setReturns] = useState<PurchaseReturn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchReturns();
    }
  }, [user]);

  const fetchReturns = async () => {
    try {
      const { data, error } = await supabase
        .from("purchase_invoices")
        .select("*, parties(name)")
        .eq("invoice_type", "purchase_return")
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReturns((data as unknown as PurchaseReturn[]) || []);
    } catch (error: any) {
      toast.error("Failed to fetch purchase returns: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this return?")) return;
    
    try {
      const { error } = await supabase
        .from("purchase_invoices")
        .update({ is_deleted: true, deleted_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
      toast.success("Return deleted successfully");
      fetchReturns();
    } catch (error: any) {
      toast.error("Failed to delete return: " + error.message);
    }
  };

  const filteredReturns = returns.filter(
    (ret) =>
      ret.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ret.parties?.name && ret.parties.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusBadge = (status: string | null) => {
    const styles: Record<string, string> = {
      approved: "bg-success/10 text-success",
      pending: "bg-warning/10 text-warning",
      rejected: "bg-destructive/10 text-destructive",
    };
    return styles[status || "pending"] || "";
  };

  const totalReturns = returns.reduce((sum, r) => sum + (r.total_amount || 0), 0);

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
          <h1 className="text-2xl font-bold">Purchase Returns / Debit Notes</h1>
          <p className="text-muted-foreground">Manage purchase returns and debit notes</p>
        </div>
        <Button asChild className="btn-gradient gap-2">
          <Link to="/purchase/return/new">
            <Plus className="w-4 h-4" />
            New Purchase Return
          </Link>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="metric-card">
          <p className="text-sm text-muted-foreground">Total Returns</p>
          <p className="text-2xl font-bold mt-1">₹{totalReturns.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">{returns.length} returns</p>
        </div>
        <div className="metric-card">
          <p className="text-sm text-muted-foreground">Approved</p>
          <p className="text-2xl font-bold text-success mt-1">{returns.filter(r => r.status === "approved").length}</p>
        </div>
        <div className="metric-card">
          <p className="text-sm text-muted-foreground">Pending Approval</p>
          <p className="text-2xl font-bold text-warning mt-1">{returns.filter(r => r.status === "pending" || !r.status).length}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by return number or supplier..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Returns Table */}
      {filteredReturns.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No purchase returns found</p>
          <Button asChild className="mt-4">
            <Link to="/purchase/return/new">Create your first return</Link>
          </Button>
        </div>
      ) : (
        <div className="metric-card overflow-hidden p-0">
          <table className="data-table">
            <thead>
              <tr>
                <th>Debit Note No.</th>
                <th>Date</th>
                <th>Supplier</th>
                <th>Reason</th>
                <th className="text-right">Amount</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredReturns.map((ret) => (
                <tr key={ret.id} className="group">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                        <RotateCcw className="w-5 h-5 text-warning" />
                      </div>
                      <span className="font-medium">{ret.invoice_number}</span>
                    </div>
                  </td>
                  <td className="text-muted-foreground">
                    {format(new Date(ret.invoice_date), "dd MMM yyyy")}
                  </td>
                  <td className="font-medium">{ret.parties?.name || "-"}</td>
                  <td className="text-muted-foreground">{ret.notes || "-"}</td>
                  <td className="text-right font-semibold">₹{(ret.total_amount || 0).toLocaleString()}</td>
                  <td>
                    <span
                      className={cn(
                        "px-2 py-1 text-xs font-medium rounded-full capitalize",
                        getStatusBadge(ret.status)
                      )}
                    >
                      {ret.status || "pending"}
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
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Print</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDelete(ret.id)}
                        >
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
      )}
    </div>
  );
}