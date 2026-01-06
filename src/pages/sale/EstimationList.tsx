import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, FileText, MoreHorizontal, Eye, Download, Send, ArrowRightCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { format } from "date-fns";

interface Estimation {
  id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string | null;
  total_amount: number | null;
  status: string | null;
  parties?: { name: string } | null;
}

export default function EstimationList() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [estimations, setEstimations] = useState<Estimation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchEstimations();
    }
  }, [user]);

  const fetchEstimations = async () => {
    try {
      const { data, error } = await supabase
        .from("sale_invoices")
        .select("*, parties(name)")
        .eq("invoice_type", "estimation")
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEstimations((data as unknown as Estimation[]) || []);
    } catch (error: any) {
      toast.error("Failed to fetch estimations: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this estimation?")) return;
    
    try {
      const { error } = await supabase
        .from("sale_invoices")
        .update({ is_deleted: true, deleted_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
      toast.success("Estimation deleted successfully");
      fetchEstimations();
    } catch (error: any) {
      toast.error("Failed to delete estimation: " + error.message);
    }
  };

  const filtered = estimations.filter(
    (e) => e.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (e.parties?.name && e.parties.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusBadge = (status: string | null) => {
    const styles: Record<string, string> = {
      pending: "bg-warning/10 text-warning",
      accepted: "bg-success/10 text-success",
      expired: "bg-destructive/10 text-destructive",
      converted: "bg-primary/10 text-primary",
    };
    return styles[status || "pending"] || "bg-warning/10 text-warning";
  };

  const totalAmount = estimations.reduce((sum, e) => sum + (e.total_amount || 0), 0);

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
          <h1 className="text-2xl font-bold">Estimations / Quotations</h1>
          <p className="text-muted-foreground">Manage your quotes and estimations</p>
        </div>
        <Button asChild className="btn-gradient gap-2">
          <Link to="/sale/estimation/new"><Plus className="w-4 h-4" />New Estimation</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="metric-card"><p className="text-sm text-muted-foreground">Total Estimations</p><p className="text-2xl font-bold mt-1">₹{totalAmount.toLocaleString()}</p></div>
        <div className="metric-card"><p className="text-sm text-muted-foreground">Total Count</p><p className="text-2xl font-bold mt-1">{estimations.length}</p></div>
        <div className="metric-card"><p className="text-sm text-muted-foreground">Pending</p><p className="text-2xl font-bold text-warning mt-1">{estimations.filter(e => e.status === "pending" || !e.status).length}</p></div>
        <div className="metric-card"><p className="text-sm text-muted-foreground">Converted</p><p className="text-2xl font-bold text-primary mt-1">{estimations.filter(e => e.status === "converted").length}</p></div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search estimations..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No estimations found</p>
          <Button asChild className="mt-4">
            <Link to="/sale/estimation/new">Create your first estimation</Link>
          </Button>
        </div>
      ) : (
        <div className="metric-card overflow-hidden p-0">
          <table className="data-table">
            <thead><tr><th>Estimation</th><th>Date</th><th>Party</th><th className="text-right">Amount</th><th>Valid Until</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {filtered.map((est) => (
                <tr key={est.id} className="group">
                  <td><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><FileText className="w-5 h-5 text-primary" /></div><span className="font-medium">{est.invoice_number}</span></div></td>
                  <td className="text-muted-foreground">{format(new Date(est.invoice_date), "dd MMM yyyy")}</td>
                  <td className="font-medium">{est.parties?.name || "-"}</td>
                  <td className="text-right font-medium">₹{(est.total_amount || 0).toLocaleString()}</td>
                  <td className="text-muted-foreground">{est.due_date ? format(new Date(est.due_date), "dd MMM yyyy") : "-"}</td>
                  <td><span className={cn("px-2 py-1 text-xs font-medium rounded-full capitalize", getStatusBadge(est.status))}>{est.status || "pending"}</span></td>
                  <td>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Eye className="w-4 h-4 mr-2" />View</DropdownMenuItem>
                        <DropdownMenuItem><ArrowRightCircle className="w-4 h-4 mr-2" />Convert to Invoice</DropdownMenuItem>
                        <DropdownMenuItem><Download className="w-4 h-4 mr-2" />Download PDF</DropdownMenuItem>
                        <DropdownMenuItem><Send className="w-4 h-4 mr-2" />Send to Party</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(est.id)}>Delete</DropdownMenuItem>
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