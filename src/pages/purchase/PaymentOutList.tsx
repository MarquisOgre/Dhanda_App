import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, MoreHorizontal, ArrowDownCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const payments = [
  {
    id: 1,
    number: "PAY-OUT-014",
    date: "02 Jan 2026",
    party: "Metro Suppliers",
    amount: 28500,
    mode: "Bank Transfer",
    reference: "PUR-042",
  },
  {
    id: 2,
    number: "PAY-OUT-013",
    date: "01 Jan 2026",
    party: "ABC Wholesalers",
    amount: 30000,
    mode: "Cheque",
    reference: "PUR-041",
  },
  {
    id: 3,
    number: "PAY-OUT-012",
    date: "30 Dec 2025",
    party: "Global Imports",
    amount: 85000,
    mode: "Bank Transfer",
    reference: "PUR-039",
  },
];

export default function PaymentOutList() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPayments = payments.filter(
    (payment) =>
      payment.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.party.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPayments = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Payment Out</h1>
          <p className="text-muted-foreground">Manage supplier payments</p>
        </div>
        <Button asChild className="btn-gradient gap-2">
          <Link to="/purchase/payment-out/new">
            <Plus className="w-4 h-4" />
            New Payment Out
          </Link>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="metric-card">
          <p className="text-sm text-muted-foreground">Total Payments</p>
          <p className="text-2xl font-bold mt-1">₹{totalPayments.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">{payments.length} payments</p>
        </div>
        <div className="metric-card">
          <p className="text-sm text-muted-foreground">This Month</p>
          <p className="text-2xl font-bold text-warning mt-1">₹58,500</p>
          <p className="text-xs text-muted-foreground mt-1">2 payments</p>
        </div>
        <div className="metric-card">
          <p className="text-sm text-muted-foreground">Pending to Pay</p>
          <p className="text-2xl font-bold text-destructive mt-1">₹1,60,200</p>
          <p className="text-xs text-muted-foreground mt-1">2 bills</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by receipt number or party..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Payments Table */}
      <div className="metric-card overflow-hidden p-0">
        <table className="data-table">
          <thead>
            <tr>
              <th>Receipt No.</th>
              <th>Date</th>
              <th>Supplier</th>
              <th>Reference</th>
              <th>Mode</th>
              <th className="text-right">Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((payment) => (
              <tr key={payment.id} className="group">
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                      <ArrowDownCircle className="w-5 h-5 text-warning" />
                    </div>
                    <span className="font-medium">{payment.number}</span>
                  </div>
                </td>
                <td className="text-muted-foreground">{payment.date}</td>
                <td className="font-medium">{payment.party}</td>
                <td className="text-muted-foreground">{payment.reference}</td>
                <td className="text-muted-foreground">{payment.mode}</td>
                <td className="text-right font-semibold text-warning">
                  ₹{payment.amount.toLocaleString()}
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
                      <DropdownMenuItem>View Receipt</DropdownMenuItem>
                      <DropdownMenuItem>Print</DropdownMenuItem>
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
