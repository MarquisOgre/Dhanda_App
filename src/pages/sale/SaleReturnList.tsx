import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, RotateCcw, MoreHorizontal, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const returns = [
  { id: 1, number: "CN-001", date: "02 Jan 2026", party: "Rahul Electronics", amount: 5000, originalInvoice: "INV-001", reason: "Defective", status: "approved" },
  { id: 2, number: "CN-002", date: "31 Dec 2025", party: "Global Systems", amount: 12500, originalInvoice: "INV-004", reason: "Wrong Item", status: "pending" },
  { id: 3, number: "CN-003", date: "28 Dec 2025", party: "Tech Solutions", amount: 3200, originalInvoice: "INV-005", reason: "Damaged", status: "processed" },
];

export default function SaleReturnList() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = returns.filter(
    (r) => r.number.toLowerCase().includes(searchQuery.toLowerCase()) || r.party.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-warning/10 text-warning",
      approved: "bg-primary/10 text-primary",
      processed: "bg-success/10 text-success",
      rejected: "bg-destructive/10 text-destructive",
    };
    return styles[status] || "";
  };

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
        <div className="metric-card"><p className="text-sm text-muted-foreground">Total Returns</p><p className="text-2xl font-bold text-destructive mt-1">₹20,700</p></div>
        <div className="metric-card"><p className="text-sm text-muted-foreground">Pending</p><p className="text-2xl font-bold text-warning mt-1">₹12,500</p></div>
        <div className="metric-card"><p className="text-sm text-muted-foreground">Processed</p><p className="text-2xl font-bold text-success mt-1">₹8,200</p></div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search credit notes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
      </div>

      <div className="metric-card overflow-hidden p-0">
        <table className="data-table">
          <thead><tr><th>Credit Note</th><th>Date</th><th>Party</th><th className="text-right">Amount</th><th>Original Invoice</th><th>Reason</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {filtered.map((ret) => (
              <tr key={ret.id} className="group">
                <td><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center"><RotateCcw className="w-5 h-5 text-destructive" /></div><span className="font-medium">{ret.number}</span></div></td>
                <td className="text-muted-foreground">{ret.date}</td>
                <td className="font-medium">{ret.party}</td>
                <td className="text-right font-medium text-destructive">-₹{ret.amount.toLocaleString()}</td>
                <td className="text-muted-foreground">{ret.originalInvoice}</td>
                <td className="text-muted-foreground">{ret.reason}</td>
                <td><span className={cn("px-2 py-1 text-xs font-medium rounded-full capitalize", getStatusBadge(ret.status))}>{ret.status}</span></td>
                <td>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><Eye className="w-4 h-4 mr-2" />View</DropdownMenuItem>
                      <DropdownMenuItem><Download className="w-4 h-4 mr-2" />Download PDF</DropdownMenuItem>
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
