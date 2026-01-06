import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, RotateCcw, MoreHorizontal, Eye, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { format } from "date-fns";

interface SaleReturn {
  id: string;
  invoice_number: string;
  invoice_date: string;
  total_amount: number | null;
  status: string | null;
  notes: string | null;
  parties?: { name: string } | null;
}

export default function SaleReturnList() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [returns, setReturns] = useState<SaleReturn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchReturns();
    }
  }, [user]);

  const fetchReturns = async () => {
    try {
      const { data, error } = await supabase
        .from("sale_invoices")
        .select("*, parties(name)")
        .eq("invoice_type", "sale_return")
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReturns((data as unknown as SaleReturn[]) || []);
    } catch (error: any) {
      toast.error("Failed to fetch sale returns: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this credit note?")) return;
    
    try {
      const { error } = await supabase
        .from("sale_invoices")
        .update({ is_deleted: true, deleted_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
      toast.success("Credit note deleted successfully");
      fetchReturns();
    } catch (error: any) {
      toast.error("Failed to delete credit note: " + error.message);
    }
  };

  const filtered = returns.filter(
    (r) => r.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (r.parties?.name && r.parties.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusBadge = (status: string | null) => {
    const styles: Record<string, string> = {
      pending: "bg-warning/10 text-warning",
      approved: "bg-primary/10 text-primary",
      processed: "bg-success/10 text-success",
      rejected: "bg-destructive/10 text-destructive",
    };
    return styles[status || "pending"] || "bg-warning/10 text-warning";
  };

  const totalAmount = returns.reduce((sum, r) => sum + (r.total_amount || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sale Returns / Credit Notes</h1>
          <p className="text-muted-foreground">Manage returned goods and credit notes</p>
        </div>
        <Button asChild className="btn-gradient gap-2">
          <Link to="/sale/return/new"><Plus className="w-4 h-4" />New Credit Note</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="metric-card"><p className="text-sm text-muted-foreground">Total Returns</p><p className="text-2xl font-bold text-destructive mt-1">₹{totalAmount.toLocaleString()}</p></div>
        <div className="metric-card"><p className="text-sm text-muted-foreground">Pending</p><p className="text-2xl font-bold text-warning mt-1">{returns.filter(r => r.status === "pending" || !r.status).length}</p></div>
        <div className="metric-card"><p className="text-sm text-muted-foreground">Processed</p><p className="text-2xl font-bold text-success mt-1">{returns.filter(r => r.status === "processed").length}</p></div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search credit notes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No sale returns found</p>
          <Button asChild className="mt-4">
            <Link to="/sale/return/new">Create your first credit note</Link>
          </Button>
        </div>
      ) : (
        <div className="metric-card overflow-hidden p-0">
          <table className="data-table">
            <thead><tr><th>Credit Note</th><th>Date</th><th>Party</th><th className="text-right">Amount</th><th>Reason</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {filtered.map((ret) => (
                <tr key={ret.id} className="group">
                  <td><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center"><RotateCcw className="w-5 h-5 text-destructive" /></div><span className="font-medium">{ret.invoice_number}</span></div></td>
                  <td className="text-muted-foreground">{format(new Date(ret.invoice_date), "dd MMM yyyy")}</td>
                  <td className="font-medium">{ret.parties?.name || "-"}</td>
                  <td className="text-right font-medium text-destructive">-₹{(ret.total_amount || 0).toLocaleString()}</td>
                  <td className="text-muted-foreground">{ret.notes || "-"}</td>
                  <td><span className={cn("px-2 py-1 text-xs font-medium rounded-full capitalize", getStatusBadge(ret.status))}>{ret.status || "pending"}</span></td>
                  <td>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Eye className="w-4 h-4 mr-2" />View</DropdownMenuItem>
                        <DropdownMenuItem><Download className="w-4 h-4 mr-2" />Download PDF</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(ret.id)}>Delete</DropdownMenuItem>
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