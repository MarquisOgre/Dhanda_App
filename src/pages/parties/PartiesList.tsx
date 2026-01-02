import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Phone,
  Mail,
  MapPin,
  ArrowUpCircle,
  ArrowDownCircle,
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

const parties = [
  {
    id: 1,
    name: "Rahul Electronics",
    type: "customer",
    phone: "+91 98765 43210",
    email: "rahul@electronics.com",
    balance: 45000,
    balanceType: "receivable",
    gstin: "27AADCR5678P1Z5",
    address: "Mumbai, Maharashtra",
  },
  {
    id: 2,
    name: "Metro Suppliers",
    type: "supplier",
    phone: "+91 87654 32109",
    email: "contact@metrosuppliers.com",
    balance: 28500,
    balanceType: "payable",
    gstin: "29AABCS1234R1Z2",
    address: "Bangalore, Karnataka",
  },
  {
    id: 3,
    name: "Sharma Traders",
    type: "customer",
    phone: "+91 76543 21098",
    email: "sharma@traders.in",
    balance: 12800,
    balanceType: "receivable",
    gstin: "09AADCT4567Q1Z3",
    address: "Lucknow, Uttar Pradesh",
  },
  {
    id: 4,
    name: "ABC Wholesalers",
    type: "supplier",
    phone: "+91 65432 10987",
    email: "info@abcwholesale.com",
    balance: 0,
    balanceType: "settled",
    gstin: "33AABCW8901S1Z4",
    address: "Chennai, Tamil Nadu",
  },
  {
    id: 5,
    name: "Quick Mart",
    type: "customer",
    phone: "+91 54321 09876",
    email: "orders@quickmart.co",
    balance: 8400,
    balanceType: "receivable",
    gstin: "06AADCQ2345T1Z6",
    address: "Jaipur, Rajasthan",
  },
];

export default function PartiesList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "customer" | "supplier">("all");

  const filteredParties = parties.filter((party) => {
    const matchesSearch =
      party.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      party.phone.includes(searchQuery) ||
      party.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || party.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Parties</h1>
          <p className="text-muted-foreground">Manage your customers and suppliers</p>
        </div>
        <Button asChild className="btn-gradient gap-2">
          <Link to="/parties/add">
            <Plus className="w-4 h-4" />
            Add Party
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
          {["all", "customer", "supplier"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type as any)}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                filter === type
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Parties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredParties.map((party) => (
          <div key={party.id} className="metric-card">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold",
                    party.type === "customer"
                      ? "bg-primary/10 text-primary"
                      : "bg-accent/10 text-accent"
                  )}
                >
                  {party.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold">{party.name}</h3>
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      party.type === "customer"
                        ? "bg-primary/10 text-primary"
                        : "bg-accent/10 text-accent"
                    )}
                  >
                    {party.type}
                  </span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  <DropdownMenuItem>Edit Party</DropdownMenuItem>
                  <DropdownMenuItem>View Transactions</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>{party.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>{party.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{party.address}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Balance</span>
              <div className="flex items-center gap-2">
                {party.balanceType === "receivable" && (
                  <ArrowUpCircle className="w-4 h-4 text-success" />
                )}
                {party.balanceType === "payable" && (
                  <ArrowDownCircle className="w-4 h-4 text-warning" />
                )}
                <span
                  className={cn(
                    "font-semibold",
                    party.balanceType === "receivable" && "text-success",
                    party.balanceType === "payable" && "text-warning"
                  )}
                >
                  ₹{party.balance.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
