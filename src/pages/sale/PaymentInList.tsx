import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Wallet, MoreHorizontal, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const payments = [
  { id: 1, number: "REC-001", date: "02 Jan 2026", party: "Rahul Electronics", amount: 45000, mode: "Bank Transfer", linkedInvoice: "INV-001" },
  { id: 2, number: "REC-002", date: "01 Jan 2026", party: "Sharma Traders", amount: 5000, mode: "Cash", linkedInvoice: "INV-002" },
  { id: 3, number: "REC-003", date: "30 Dec 2025", party: "Global Systems", amount: 125000, mode: "UPI", linkedInvoice: "INV-004" },
  { id: 4, number: "REC-004", date: "28 Dec 2025", party: "Tech Solutions", amount: 67500, mode: "Cheque", linkedInvoice: "INV-005" },
];

export default function PaymentInList() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = payments.filter(
    (p) => p.number.toLowerCase().includes(searchQuery.toLowerCase()) || p.party.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getModeColor = (mode: string) => {
    const colors: Record<string, string> = {
      Cash: "bg-success/10 text-success",
      "Bank Transfer": "bg-primary/10 text-primary",
      UPI: "bg-secondary/50 text-secondary-foreground",
      Cheque: "bg-warning/10 text-warning",
    };
    return colors[mode] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Payment In</h1>
          <p className="text-muted-foreground">Record and track payments received</p>
        </div>
        <Button asChild className="btn-gradient gap-2">
          <Link to="/sale/payment-in/new"><Plus className="w-4 h-4" />Record Payment</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="metric-card"><p className="text-sm text-muted-foreground">Total Received</p><p className="text-2xl font-bold text-success mt-1">₹2,42,500</p><p className="text-xs text-muted-foreground mt-1">4 payments</p></div>
        <div className="metric-card"><p className="text-sm text-muted-foreground">Cash</p><p className="text-2xl font-bold mt-1">₹5,000</p></div>
        <div className="metric-card"><p className="text-sm text-muted-foreground">Bank/UPI</p><p className="text-2xl font-bold mt-1">₹1,70,000</p></div>
        <div className="metric-card"><p className="text-sm text-muted-foreground">Cheque</p><p className="text-2xl font-bold mt-1">₹67,500</p></div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search payments..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
      </div>

      <div className="metric-card overflow-hidden p-0">
        <table className="data-table">
          <thead><tr><th>Receipt</th><th>Date</th><th>Party</th><th className="text-right">Amount</th><th>Mode</th><th>Linked Invoice</th><th></th></tr></thead>
          <tbody>
            {filtered.map((pay) => (
              <tr key={pay.id} className="group">
                <td><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center"><Wallet className="w-5 h-5 text-success" /></div><span className="font-medium">{pay.number}</span></div></td>
                <td className="text-muted-foreground">{pay.date}</td>
                <td className="font-medium">{pay.party}</td>
                <td className="text-right font-medium text-success">+₹{pay.amount.toLocaleString()}</td>
                <td><span className={cn("px-2 py-1 text-xs font-medium rounded-full", getModeColor(pay.mode))}>{pay.mode}</span></td>
                <td className="text-muted-foreground">{pay.linkedInvoice}</td>
                <td>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><Eye className="w-4 h-4 mr-2" />View Receipt</DropdownMenuItem>
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
