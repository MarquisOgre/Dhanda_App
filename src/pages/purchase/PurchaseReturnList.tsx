import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, MoreHorizontal, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const returns = [
  {
    id: 1,
    number: "PR-007",
    date: "02 Jan 2026",
    party: "Metro Suppliers",
    originalBill: "PUR-042",
    amount: 5000,
    status: "approved",
    reason: "Defective Product",
  },
  {
    id: 2,
    number: "PR-006",
    date: "28 Dec 2025",
    party: "ABC Wholesalers",
    originalBill: "PUR-038",
    amount: 12500,
    status: "pending",
    reason: "Wrong Item",
  },
  {
    id: 3,
    number: "PR-005",
    date: "25 Dec 2025",
    party: "Tech Distributors",
    originalBill: "PUR-035",
    amount: 8200,
    status: "approved",
    reason: "Quality Issues",
  },
];

export default function PurchaseReturnList() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredReturns = returns.filter(
    (ret) =>
      ret.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ret.party.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const styles = {
      approved: "bg-success/10 text-success",
      pending: "bg-warning/10 text-warning",
      rejected: "bg-destructive/10 text-destructive",
    };
    return styles[status as keyof typeof styles] || "";
  };

  const totalReturns = returns.reduce((sum, r) => sum + r.amount, 0);

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
          <p className="text-2xl font-bold text-success mt-1">₹13,200</p>
          <p className="text-xs text-muted-foreground mt-1">2 returns</p>
        </div>
        <div className="metric-card">
          <p className="text-sm text-muted-foreground">Pending Approval</p>
          <p className="text-2xl font-bold text-warning mt-1">₹12,500</p>
          <p className="text-xs text-muted-foreground mt-1">1 return</p>
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
      <div className="metric-card overflow-hidden p-0">
        <table className="data-table">
          <thead>
            <tr>
              <th>Debit Note No.</th>
              <th>Date</th>
              <th>Supplier</th>
              <th>Original Bill</th>
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
                    <span className="font-medium">{ret.number}</span>
                  </div>
                </td>
                <td className="text-muted-foreground">{ret.date}</td>
                <td className="font-medium">{ret.party}</td>
                <td className="text-muted-foreground">{ret.originalBill}</td>
                <td className="text-muted-foreground">{ret.reason}</td>
                <td className="text-right font-semibold">₹{ret.amount.toLocaleString()}</td>
                <td>
                  <span
                    className={cn(
                      "px-2 py-1 text-xs font-medium rounded-full capitalize",
                      getStatusBadge(ret.status)
                    )}
                  >
                    {ret.status}
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
