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

const orders = [
  {
    id: 1,
    number: "PO-027",
    date: "02 Jan 2026",
    party: "Metro Suppliers",
    amount: 45000,
    status: "confirmed",
    delivery: "10 Jan 2026",
  },
  {
    id: 2,
    number: "PO-026",
    date: "01 Jan 2026",
    party: "ABC Wholesalers",
    amount: 78500,
    status: "pending",
    delivery: "08 Jan 2026",
  },
  {
    id: 3,
    number: "PO-025",
    date: "30 Dec 2025",
    party: "Tech Distributors",
    amount: 125000,
    status: "delivered",
    delivery: "02 Jan 2026",
  },
  {
    id: 4,
    number: "PO-024",
    date: "28 Dec 2025",
    party: "Global Imports",
    amount: 92000,
    status: "cancelled",
    delivery: "-",
  },
];

export default function PurchaseOrderList() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = orders.filter(
    (order) =>
      order.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.party.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const styles = {
      confirmed: "bg-success/10 text-success",
      pending: "bg-warning/10 text-warning",
      delivered: "bg-primary/10 text-primary",
      cancelled: "bg-destructive/10 text-destructive",
    };
    return styles[status as keyof typeof styles] || "";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Purchase Orders</h1>
          <p className="text-muted-foreground">Manage purchase orders to suppliers</p>
        </div>
        <Button asChild className="btn-gradient gap-2">
          <Link to="/purchase/order/new">
            <Plus className="w-4 h-4" />
            New Purchase Order
          </Link>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <p className="text-sm text-muted-foreground">Total Orders</p>
          <p className="text-2xl font-bold mt-1">₹3,40,500</p>
          <p className="text-xs text-muted-foreground mt-1">{orders.length} orders</p>
        </div>
        <div className="metric-card">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-warning mt-1">₹78,500</p>
          <p className="text-xs text-muted-foreground mt-1">1 order</p>
        </div>
        <div className="metric-card">
          <p className="text-sm text-muted-foreground">Confirmed</p>
          <p className="text-2xl font-bold text-success mt-1">₹45,000</p>
          <p className="text-xs text-muted-foreground mt-1">1 order</p>
        </div>
        <div className="metric-card">
          <p className="text-sm text-muted-foreground">Delivered</p>
          <p className="text-2xl font-bold text-primary mt-1">₹1,25,000</p>
          <p className="text-xs text-muted-foreground mt-1">1 order</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by order number or supplier..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Orders Table */}
      <div className="metric-card overflow-hidden p-0">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order No.</th>
              <th>Date</th>
              <th>Supplier</th>
              <th>Expected Delivery</th>
              <th className="text-right">Amount</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="group">
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-accent" />
                    </div>
                    <span className="font-medium">{order.number}</span>
                  </div>
                </td>
                <td className="text-muted-foreground">{order.date}</td>
                <td className="font-medium">{order.party}</td>
                <td className="text-muted-foreground">{order.delivery}</td>
                <td className="text-right font-semibold">₹{order.amount.toLocaleString()}</td>
                <td>
                  <span
                    className={cn(
                      "px-2 py-1 text-xs font-medium rounded-full capitalize",
                      getStatusBadge(order.status)
                    )}
                  >
                    {order.status}
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
                      <DropdownMenuItem>View Order</DropdownMenuItem>
                      <DropdownMenuItem>Convert to Bill</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Cancel</DropdownMenuItem>
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
