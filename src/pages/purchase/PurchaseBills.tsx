import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, MoreHorizontal, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const bills = [
  {
    id: 1,
    number: "PUR-042",
    date: "02 Jan 2026",
    party: "Metro Suppliers",
    amount: 28500,
    paid: 28500,
    status: "paid",
  },
  {
    id: 2,
    number: "PUR-041",
    date: "01 Jan 2026",
    party: "ABC Wholesalers",
    amount: 65200,
    paid: 30000,
    status: "partial",
  },
  {
    id: 3,
    number: "PUR-040",
    date: "30 Dec 2025",
    party: "Tech Distributors",
    amount: 125000,
    paid: 0,
    status: "unpaid",
  },
  {
    id: 4,
    number: "PUR-039",
    date: "28 Dec 2025",
    party: "Global Imports",
    amount: 85000,
    paid: 85000,
    status: "paid",
  },
];

export default function PurchaseBills() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBills = bills.filter(
    (bill) =>
      bill.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.party.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const styles = {
      paid: "bg-success/10 text-success",
      partial: "bg-warning/10 text-warning",
      unpaid: "bg-destructive/10 text-destructive",
    };
    return styles[status as keyof typeof styles] || "";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Purchase Bills</h1>
          <p className="text-muted-foreground">Manage your purchase transactions</p>
        </div>
        <Button asChild className="btn-gradient gap-2">
          <Link to="/purchase/bills/new">
            <Plus className="w-4 h-4" />
            New Purchase Bill
          </Link>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <p className="text-sm text-muted-foreground">Total Bills</p>
          <p className="text-2xl font-bold mt-1">₹3,03,700</p>
          <p className="text-xs text-muted-foreground mt-1">4 bills</p>
        </div>
        <div className="metric-card">
          <p className="text-sm text-muted-foreground">Paid</p>
          <p className="text-2xl font-bold text-success mt-1">₹1,43,500</p>
          <p className="text-xs text-muted-foreground mt-1">2 bills</p>
        </div>
        <div className="metric-card">
          <p className="text-sm text-muted-foreground">Unpaid</p>
          <p className="text-2xl font-bold text-destructive mt-1">₹1,60,200</p>
          <p className="text-xs text-muted-foreground mt-1">2 bills</p>
        </div>
        <div className="metric-card">
          <p className="text-sm text-muted-foreground">Due This Week</p>
          <p className="text-2xl font-bold text-warning mt-1">₹35,200</p>
          <p className="text-xs text-muted-foreground mt-1">1 bill</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by bill number or party..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Bills Table */}
      <div className="metric-card overflow-hidden p-0">
        <table className="data-table">
          <thead>
            <tr>
              <th>Bill No.</th>
              <th>Date</th>
              <th>Supplier</th>
              <th className="text-right">Amount</th>
              <th className="text-right">Paid</th>
              <th className="text-right">Balance</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredBills.map((bill) => (
              <tr key={bill.id} className="group">
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-accent" />
                    </div>
                    <span className="font-medium">{bill.number}</span>
                  </div>
                </td>
                <td className="text-muted-foreground">{bill.date}</td>
                <td className="font-medium">{bill.party}</td>
                <td className="text-right font-medium">
                  ₹{bill.amount.toLocaleString()}
                </td>
                <td className="text-right text-muted-foreground">
                  ₹{bill.paid.toLocaleString()}
                </td>
                <td className="text-right font-medium">
                  ₹{(bill.amount - bill.paid).toLocaleString()}
                </td>
                <td>
                  <span
                    className={cn(
                      "px-2 py-1 text-xs font-medium rounded-full capitalize",
                      getStatusBadge(bill.status)
                    )}
                  >
                    {bill.status}
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
                      <DropdownMenuItem>View Bill</DropdownMenuItem>
                      <DropdownMenuItem>Record Payment</DropdownMenuItem>
                      <DropdownMenuItem>Edit Bill</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete
                      </DropdownMenuItem>
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
