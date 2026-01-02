import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, ClipboardList, MoreHorizontal, Eye, Download, ArrowRightCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const orders = [
  { id: 1, number: "SO-001", date: "02 Jan 2026", party: "Rahul Electronics", amount: 78000, deliveryDate: "09 Jan 2026", status: "confirmed" },
  { id: 2, number: "SO-002", date: "01 Jan 2026", party: "Global Systems", amount: 156000, deliveryDate: "08 Jan 2026", status: "processing" },
  { id: 3, number: "SO-003", date: "30 Dec 2025", party: "Tech Solutions", amount: 45000, deliveryDate: "06 Jan 2026", status: "completed" },
  { id: 4, number: "SO-004", date: "28 Dec 2025", party: "Sharma Traders", amount: 23400, deliveryDate: "04 Jan 2026", status: "cancelled" },
];

export default function SaleOrderList() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = orders.filter(
    (o) => o.number.toLowerCase().includes(searchQuery.toLowerCase()) || o.party.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      confirmed: "bg-primary/10 text-primary",
      processing: "bg-warning/10 text-warning",
      completed: "bg-success/10 text-success",
      cancelled: "bg-destructive/10 text-destructive",
    };
    return styles[status] || "";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sale Orders</h1>
          <p className="text-muted-foreground">Manage customer orders</p>
        </div>
        <Button asChild className="btn-gradient gap-2">
          <Link to="/sale/order/new"><Plus className="w-4 h-4" />New Order</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="metric-card"><p className="text-sm text-muted-foreground">Total Orders</p><p className="text-2xl font-bold mt-1">₹3,02,400</p></div>
        <div className="metric-card"><p className="text-sm text-muted-foreground">Confirmed</p><p className="text-2xl font-bold text-primary mt-1">₹78,000</p></div>
        <div className="metric-card"><p className="text-sm text-muted-foreground">Processing</p><p className="text-2xl font-bold text-warning mt-1">₹1,56,000</p></div>
        <div className="metric-card"><p className="text-sm text-muted-foreground">Completed</p><p className="text-2xl font-bold text-success mt-1">₹45,000</p></div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search orders..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
      </div>

      <div className="metric-card overflow-hidden p-0">
        <table className="data-table">
          <thead><tr><th>Order</th><th>Date</th><th>Party</th><th className="text-right">Amount</th><th>Delivery Date</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} className="group">
                <td><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><ClipboardList className="w-5 h-5 text-primary" /></div><span className="font-medium">{order.number}</span></div></td>
                <td className="text-muted-foreground">{order.date}</td>
                <td className="font-medium">{order.party}</td>
                <td className="text-right font-medium">₹{order.amount.toLocaleString()}</td>
                <td className="text-muted-foreground">{order.deliveryDate}</td>
                <td><span className={cn("px-2 py-1 text-xs font-medium rounded-full capitalize", getStatusBadge(order.status))}>{order.status}</span></td>
                <td>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><Eye className="w-4 h-4 mr-2" />View</DropdownMenuItem>
                      <DropdownMenuItem><ArrowRightCircle className="w-4 h-4 mr-2" />Convert to Invoice</DropdownMenuItem>
                      <DropdownMenuItem><Download className="w-4 h-4 mr-2" />Download PDF</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Cancel Order</DropdownMenuItem>
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
