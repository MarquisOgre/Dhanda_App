import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Truck, MoreHorizontal, Eye, Download, ArrowRightCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const challans = [
  { id: 1, number: "DC-001", date: "02 Jan 2026", party: "Rahul Electronics", items: 5, type: "Supply", status: "delivered" },
  { id: 2, number: "DC-002", date: "01 Jan 2026", party: "Global Systems", items: 12, type: "Job Work", status: "in-transit" },
  { id: 3, number: "DC-003", date: "30 Dec 2025", party: "Tech Solutions", items: 3, type: "Supply", status: "pending" },
  { id: 4, number: "DC-004", date: "28 Dec 2025", party: "Quick Mart", items: 8, type: "Exhibition", status: "returned" },
];

export default function DeliveryChallanList() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = challans.filter(
    (c) => c.number.toLowerCase().includes(searchQuery.toLowerCase()) || c.party.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-warning/10 text-warning",
      "in-transit": "bg-primary/10 text-primary",
      delivered: "bg-success/10 text-success",
      returned: "bg-destructive/10 text-destructive",
    };
    return styles[status] || "";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Delivery Challans</h1>
          <p className="text-muted-foreground">Track goods dispatched to customers</p>
        </div>
        <Button asChild className="btn-gradient gap-2">
          <Link to="/sale/dc/new"><Plus className="w-4 h-4" />New Challan</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="metric-card"><p className="text-sm text-muted-foreground">Total Challans</p><p className="text-2xl font-bold mt-1">4</p></div>
        <div className="metric-card"><p className="text-sm text-muted-foreground">In Transit</p><p className="text-2xl font-bold text-primary mt-1">1</p></div>
        <div className="metric-card"><p className="text-sm text-muted-foreground">Delivered</p><p className="text-2xl font-bold text-success mt-1">1</p></div>
        <div className="metric-card"><p className="text-sm text-muted-foreground">Pending</p><p className="text-2xl font-bold text-warning mt-1">1</p></div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search challans..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
      </div>

      <div className="metric-card overflow-hidden p-0">
        <table className="data-table">
          <thead><tr><th>Challan</th><th>Date</th><th>Party</th><th>Items</th><th>Type</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {filtered.map((dc) => (
              <tr key={dc.id} className="group">
                <td><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-accent/50 flex items-center justify-center"><Truck className="w-5 h-5 text-accent-foreground" /></div><span className="font-medium">{dc.number}</span></div></td>
                <td className="text-muted-foreground">{dc.date}</td>
                <td className="font-medium">{dc.party}</td>
                <td>{dc.items} items</td>
                <td className="text-muted-foreground">{dc.type}</td>
                <td><span className={cn("px-2 py-1 text-xs font-medium rounded-full capitalize", getStatusBadge(dc.status))}>{dc.status.replace("-", " ")}</span></td>
                <td>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><Eye className="w-4 h-4 mr-2" />View</DropdownMenuItem>
                      <DropdownMenuItem><ArrowRightCircle className="w-4 h-4 mr-2" />Convert to Invoice</DropdownMenuItem>
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
