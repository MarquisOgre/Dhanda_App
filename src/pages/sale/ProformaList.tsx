import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, FileText, MoreHorizontal, Eye, Download, ArrowRightCircle, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { format } from "date-fns";
import { generateInvoicePDF } from "@/lib/invoicePdf";
import { useBusinessSettings } from "@/contexts/BusinessContext";

interface Proforma {
  id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string | null;
  total_amount: number | null;
  subtotal: number | null;
  tax_amount: number | null;
  discount_amount: number | null;
  status: string | null;
  notes: string | null;
  parties?: { name: string; billing_address: string | null; gstin: string | null } | null;
}

export default function ProformaList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { businessSettings } = useBusinessSettings();
  const [searchQuery, setSearchQuery] = useState("");
  const [proformas, setProformas] = useState<Proforma[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProformas();
    }
  }, [user]);

  const fetchProformas = async () => {
    try {
      const { data, error } = await supabase
        .from("sale_invoices")
        .select("*, parties(name, billing_address, gstin)")
        .eq("invoice_type", "proforma")
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProformas((data as unknown as Proforma[]) || []);
    } catch (error: any) {
      toast.error("Failed to fetch proforma invoices: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id: string) => {
    navigate(`/sale/invoice/${id}`);
  };

  const handleConvertToInvoice = async (proforma: Proforma) => {
    navigate(`/sale/invoice/new?from=${proforma.id}`);
    toast.info("Create invoice from proforma - data will be pre-filled");
  };

  const handleDownloadPdf = async (proforma: Proforma) => {
    try {
      const { data: items, error: itemsError } = await supabase
        .from("invoice_items")
        .select("*")
        .eq("sale_invoice_id", proforma.id);

      if (itemsError) throw itemsError;

      const invoice = {
        id: proforma.id,
        invoice_number: proforma.invoice_number,
        invoice_date: proforma.invoice_date,
        due_date: proforma.due_date,
        total_amount: proforma.total_amount,
        paid_amount: 0,
        subtotal: proforma.subtotal,
        tax_amount: proforma.tax_amount,
        discount_amount: proforma.discount_amount,
        status: proforma.status,
        notes: proforma.notes,
        terms: null,
        parties: proforma.parties ? {
          name: proforma.parties.name,
          phone: null,
          email: null,
          billing_address: proforma.parties.billing_address,
          gstin: proforma.parties.gstin,
        } : null,
      };

      const settings = {
        business_name: businessSettings?.business_name || null,
        gstin: businessSettings?.gstin || null,
        phone: businessSettings?.phone || null,
        email: businessSettings?.email || null,
        business_address: businessSettings?.business_address || null,
        logo_url: businessSettings?.logo_url || null,
        enable_tcs: businessSettings?.enable_tcs || null,
        tcs_percent: businessSettings?.tcs_percent || null,
      };

      generateInvoicePDF({
        invoice,
        items: items || [],
        settings,
        type: "sale",
      });

      toast.success("PDF downloaded successfully");
    } catch (error: any) {
      toast.error("Failed to download PDF: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this proforma invoice?")) return;
    
    try {
      const { error } = await supabase
        .from("sale_invoices")
        .update({ is_deleted: true, deleted_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
      toast.success("Proforma invoice deleted successfully");
      fetchProformas();
    } catch (error: any) {
      toast.error("Failed to delete proforma invoice: " + error.message);
    }
  };

  const filtered = proformas.filter(
    (p) => p.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.parties?.name && p.parties.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusBadge = (status: string | null) => {
    const styles: Record<string, string> = {
      pending: "bg-warning/10 text-warning",
      converted: "bg-success/10 text-success",
      expired: "bg-destructive/10 text-destructive",
    };
    return styles[status || "pending"] || "bg-warning/10 text-warning";
  };

  const totalAmount = proformas.reduce((sum, p) => sum + (p.total_amount || 0), 0);

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
          <h1 className="text-2xl font-bold">Proforma Invoices</h1>
          <p className="text-muted-foreground">Preliminary invoices before final sale</p>
        </div>
        <Button asChild className="btn-gradient gap-2">
          <Link to="/sale/proforma/new"><Plus className="w-4 h-4" />New Proforma</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="metric-card"><p className="text-sm text-muted-foreground">Total Proforma</p><p className="text-2xl font-bold mt-1">₹{totalAmount.toLocaleString()}</p></div>
        <div className="metric-card"><p className="text-sm text-muted-foreground">Pending</p><p className="text-2xl font-bold text-warning mt-1">{proformas.filter(p => p.status === "pending" || !p.status).length}</p></div>
        <div className="metric-card"><p className="text-sm text-muted-foreground">Converted</p><p className="text-2xl font-bold text-success mt-1">{proformas.filter(p => p.status === "converted").length}</p></div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search proforma invoices..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No proforma invoices found</p>
          <Button asChild className="mt-4">
            <Link to="/sale/proforma/new">Create your first proforma</Link>
          </Button>
        </div>
      ) : (
        <div className="metric-card overflow-hidden p-0">
          <table className="data-table">
            <thead><tr><th>Proforma</th><th>Date</th><th>Party</th><th className="text-right">Amount</th><th>Valid Until</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {filtered.map((pf) => (
                <tr key={pf.id} className="group">
                  <td><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center"><FileText className="w-5 h-5 text-secondary-foreground" /></div><span className="font-medium">{pf.invoice_number}</span></div></td>
                  <td className="text-muted-foreground">{format(new Date(pf.invoice_date), "dd MMM yyyy")}</td>
                  <td className="font-medium">{pf.parties?.name || "-"}</td>
                  <td className="text-right font-medium">₹{(pf.total_amount || 0).toLocaleString()}</td>
                  <td className="text-muted-foreground">{pf.due_date ? format(new Date(pf.due_date), "dd MMM yyyy") : "-"}</td>
                  <td><span className={cn("px-2 py-1 text-xs font-medium rounded-full capitalize", getStatusBadge(pf.status))}>{pf.status || "pending"}</span></td>
                  <td>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(pf.id)}>
                          <Eye className="w-4 h-4 mr-2" />View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleConvertToInvoice(pf)}>
                          <ArrowRightCircle className="w-4 h-4 mr-2" />Convert to Invoice
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownloadPdf(pf)}>
                          <Download className="w-4 h-4 mr-2" />Download PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(pf.id)}>
                          <Trash2 className="w-4 h-4 mr-2" />Delete
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