import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, FileText, MoreHorizontal, Eye, Download, Send, ArrowRightCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const estimations = [
  { id: 1, number: "EST-001", date: "02 Jan 2026", party: "Rahul Electronics", amount: 55000, validUntil: "17 Jan 2026", status: "pending" },
  { id: 2, number: "EST-002", date: "01 Jan 2026", party: "Sharma Traders", amount: 23400, validUntil: "16 Jan 2026", status: "accepted" },
  { id: 3, number: "EST-003", date: "30 Dec 2025", party: "Quick Mart", amount: 18900, validUntil: "14 Jan 2026", status: "expired" },
  { id: 4, number: "EST-004", date: "28 Dec 2025", party: "Global Systems", amount: 145000, validUntil: "12 Jan 2026", status: "converted" },
];

export default function EstimationList() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = estimations.filter(
    (e) => e.number.toLowerCase().includes(searchQuery.toLowerCase()) || e.party.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-warning/10 text-warning",
      accepted: "bg-success/10 text-success",
      expired: "bg-destructive/10 text-destructive",
      converted: "bg-primary/10 text-primary",
    };
    return styles[status] || "";
  };

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
        <div className="metric-card"><p className="text-sm text-muted-foreground">Total Estimations</p><p className="text-2xl font-bold mt-1">₹2,42,300</p></div>
        <div className="metric-card"><p className="text-sm text-muted-foreground">Pending</p><p className="text-2xl font-bold text-warning mt-1">₹55,000</p></div>
        <div className="metric-card"><p className="text-sm text-muted-foreground">Accepted</p><p className="text-2xl font-bold text-success mt-1">₹23,400</p></div>
        <div className="metric-card"><p className="text-sm text-muted-foreground">Converted</p><p className="text-2xl font-bold text-primary mt-1">₹1,45,000</p></div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search estimations..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
      </div>

      <div className="metric-card overflow-hidden p-0">
        <table className="data-table">
          <thead><tr><th>Estimation</th><th>Date</th><th>Party</th><th className="text-right">Amount</th><th>Valid Until</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {filtered.map((est) => (
              <tr key={est.id} className="group">
                <td><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><FileText className="w-5 h-5 text-primary" /></div><span className="font-medium">{est.number}</span></div></td>
                <td className="text-muted-foreground">{est.date}</td>
                <td className="font-medium">{est.party}</td>
                <td className="text-right font-medium">₹{est.amount.toLocaleString()}</td>
                <td className="text-muted-foreground">{est.validUntil}</td>
                <td><span className={cn("px-2 py-1 text-xs font-medium rounded-full capitalize", getStatusBadge(est.status))}>{est.status}</span></td>
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
