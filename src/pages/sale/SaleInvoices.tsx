import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  FileText,
  Download,
  Send,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const invoices = [
  {
    id: 1,
    number: "INV-001",
    date: "02 Jan 2026",
    party: "Rahul Electronics",
    amount: 45000,
    paid: 45000,
    status: "paid",
  },
  {
    id: 2,
    number: "INV-002",
    date: "01 Jan 2026",
    party: "Sharma Traders",
    amount: 12800,
    paid: 5000,
    status: "partial",
  },
  {
    id: 3,
    number: "INV-003",
    date: "31 Dec 2025",
    party: "Quick Mart",
    amount: 8400,
    paid: 0,
    status: "unpaid",
  },
  {
    id: 4,
    number: "INV-004",
    date: "30 Dec 2025",
    party: "Global Systems",
    amount: 125000,
    paid: 125000,
    status: "paid",
  },
  {
    id: 5,
    number: "INV-005",
    date: "28 Dec 2025",
    party: "Tech Solutions",
    amount: 67500,
    paid: 67500,
    status: "paid",
  },
];

export default function SaleInvoices() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.party.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h1 className="text-2xl font-bold">Sale Invoices</h1>
          <p className="text-muted-foreground">Manage your sales and invoices</p>
        </div>
        <Button asChild className="btn-gradient gap-2">
          <Link to="/sale/invoices/new">
            <Plus className="w-4 h-4" />
            New Invoice
          </Link>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <p className="text-sm text-muted-foreground">Total Invoices</p>
          <p className="text-2xl font-bold mt-1">₹2,58,700</p>
          <p className="text-xs text-muted-foreground mt-1">5 invoices</p>
        </div>
        <div className="metric-card">
          <p className="text-sm text-muted-foreground">Paid</p>
          <p className="text-2xl font-bold text-success mt-1">₹2,37,500</p>
          <p className="text-xs text-muted-foreground mt-1">3 invoices</p>
        </div>
        <div className="metric-card">
          <p className="text-sm text-muted-foreground">Unpaid</p>
          <p className="text-2xl font-bold text-destructive mt-1">₹16,200</p>
          <p className="text-xs text-muted-foreground mt-1">2 invoices</p>
        </div>
        <div className="metric-card">
          <p className="text-sm text-muted-foreground">Overdue</p>
          <p className="text-2xl font-bold text-warning mt-1">₹8,400</p>
          <p className="text-xs text-muted-foreground mt-1">1 invoice</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by invoice number or party..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Invoices Table */}
      <div className="metric-card overflow-hidden p-0">
        <table className="data-table">
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Date</th>
              <th>Party</th>
              <th className="text-right">Amount</th>
              <th className="text-right">Paid</th>
              <th className="text-right">Balance</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((invoice) => (
              <tr key={invoice.id} className="group">
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium">{invoice.number}</span>
                  </div>
                </td>
                <td className="text-muted-foreground">{invoice.date}</td>
                <td className="font-medium">{invoice.party}</td>
                <td className="text-right font-medium">
                  ₹{invoice.amount.toLocaleString()}
                </td>
                <td className="text-right text-muted-foreground">
                  ₹{invoice.paid.toLocaleString()}
                </td>
                <td className="text-right font-medium">
                  ₹{(invoice.amount - invoice.paid).toLocaleString()}
                </td>
                <td>
                  <span
                    className={cn(
                      "px-2 py-1 text-xs font-medium rounded-full capitalize",
                      getStatusBadge(invoice.status)
                    )}
                  >
                    {invoice.status}
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
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        View Invoice
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Send className="w-4 h-4 mr-2" />
                        Send to Party
                      </DropdownMenuItem>
                      <DropdownMenuItem>Record Payment</DropdownMenuItem>
                      <DropdownMenuItem>Edit Invoice</DropdownMenuItem>
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
