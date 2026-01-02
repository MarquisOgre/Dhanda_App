import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, FileText, MoreHorizontal, Eye, Download, Send, ArrowRightCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const proformas = [
  { id: 1, number: "PI-001", date: "02 Jan 2026", party: "Global Systems", amount: 85000, validUntil: "01 Feb 2026", status: "pending" },
  { id: 2, number: "PI-002", date: "31 Dec 2025", party: "Tech Solutions", amount: 42000, validUntil: "30 Jan 2026", status: "converted" },
  { id: 3, number: "PI-003", date: "28 Dec 2025", party: "Sharma Traders", amount: 15600, validUntil: "27 Jan 2026", status: "expired" },
];

export default function ProformaList() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = proformas.filter(
    (p) => p.number.toLowerCase().includes(searchQuery.toLowerCase()) || p.party.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-warning/10 text-warning",
      converted: "bg-success/10 text-success",
      expired: "bg-destructive/10 text-destructive",
    };
    return styles[status] || "";
  };

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
        <div className="metric-card"><p className="text-sm text-muted-foreground">Total Proforma</p><p className="text-2xl font-bold mt-1">₹1,42,600</p></div>
        <div className="metric-card"><p className="text-sm text-muted-foreground">Pending</p><p className="text-2xl font-bold text-warning mt-1">₹85,000</p></div>
        <div className="metric-card"><p className="text-sm text-muted-foreground">Converted</p><p className="text-2xl font-bold text-success mt-1">₹42,000</p></div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search proforma invoices..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
      </div>

      <div className="metric-card overflow-hidden p-0">
        <table className="data-table">
          <thead><tr><th>Proforma</th><th>Date</th><th>Party</th><th className="text-right">Amount</th><th>Valid Until</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {filtered.map((pf) => (
              <tr key={pf.id} className="group">
                <td><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center"><FileText className="w-5 h-5 text-secondary-foreground" /></div><span className="font-medium">{pf.number}</span></div></td>
                <td className="text-muted-foreground">{pf.date}</td>
                <td className="font-medium">{pf.party}</td>
                <td className="text-right font-medium">₹{pf.amount.toLocaleString()}</td>
                <td className="text-muted-foreground">{pf.validUntil}</td>
                <td><span className={cn("px-2 py-1 text-xs font-medium rounded-full capitalize", getStatusBadge(pf.status))}>{pf.status}</span></td>
                <td>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><Eye className="w-4 h-4 mr-2" />View</DropdownMenuItem>
                      <DropdownMenuItem><ArrowRightCircle className="w-4 h-4 mr-2" />Convert to Invoice</DropdownMenuItem>
                      <DropdownMenuItem><Download className="w-4 h-4 mr-2" />Download PDF</DropdownMenuItem>
                      <DropdownMenuItem><Send className="w-4 h-4 mr-2" />Send to Party</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
