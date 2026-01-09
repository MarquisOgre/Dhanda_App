import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  MoreHorizontal,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Party {
  id: string;
  name: string;
  party_type: string | null;
  phone: string | null;
  email: string | null;
  opening_balance: number | null;
  billing_address: string | null;
  gstin: string | null;
}

interface PartyWithTotals extends Party {
  purchasedAmount: number;
  paymentsOut: number;
  netDue: number;
}

export default function PartiesList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "customer" | "supplier">("all");
  const [parties, setParties] = useState<PartyWithTotals[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchParties();
    }
  }, [user]);

  const fetchParties = async () => {
    try {
      // Fetch parties
      const { data: partiesData, error: partiesError } = await supabase
        .from("parties")
        .select("*")
        .order("created_at", { ascending: false });

      if (partiesError) throw partiesError;

      // Fetch purchase invoices totals per party
      const { data: purchaseData, error: purchaseError } = await supabase
        .from("purchase_invoices")
        .select("party_id, total_amount")
        .eq("is_deleted", false);

      if (purchaseError) throw purchaseError;

      // Fetch payment out totals per party
      const { data: paymentsData, error: paymentsError } = await supabase
        .from("payments")
        .select("party_id, amount")
        .eq("payment_type", "payment_out");

      if (paymentsError) throw paymentsError;

      // Calculate totals per party
      const purchaseTotals: Record<string, number> = {};
      purchaseData?.forEach((inv) => {
        if (inv.party_id) {
          purchaseTotals[inv.party_id] = (purchaseTotals[inv.party_id] || 0) + (inv.total_amount || 0);
        }
      });

      const paymentTotals: Record<string, number> = {};
      paymentsData?.forEach((pay) => {
        if (pay.party_id) {
          paymentTotals[pay.party_id] = (paymentTotals[pay.party_id] || 0) + (pay.amount || 0);
        }
      });

      // Combine data
      const partiesWithTotals: PartyWithTotals[] = (partiesData || []).map((party) => {
        const openingBalance = party.opening_balance || 0;
        const purchasedAmount = purchaseTotals[party.id] || 0;
        const paymentsOut = paymentTotals[party.id] || 0;
        const netDue = openingBalance + purchasedAmount - paymentsOut;

        return {
          ...party,
          purchasedAmount,
          paymentsOut,
          netDue,
        };
      });

      setParties(partiesWithTotals);
    } catch (error: any) {
      toast.error("Failed to fetch parties: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this party?")) return;
    
    try {
      const { error } = await supabase.from("parties").delete().eq("id", id);
      if (error) throw error;
      toast.success("Party deleted successfully");
      fetchParties();
    } catch (error: any) {
      toast.error("Failed to delete party: " + error.message);
    }
  };

  const filteredParties = parties.filter((party) => {
    const matchesSearch =
      party.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (party.phone && party.phone.includes(searchQuery)) ||
      (party.email && party.email.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filter === "all" || party.party_type === filter;
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

      {/* Parties Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredParties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No parties found</p>
          <Button asChild className="mt-4">
            <Link to="/parties/add">Add your first party</Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Party Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="text-right">Opening Balance</TableHead>
                <TableHead className="text-right">Purchased Amount</TableHead>
                <TableHead className="text-right">Payments Out</TableHead>
                <TableHead className="text-right">Net Due</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParties.map((party) => (
                <TableRow 
                  key={party.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/parties/${party.id}`)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                          party.party_type === "customer"
                            ? "bg-primary/10 text-primary"
                            : "bg-accent/10 text-accent"
                        )}
                      >
                        {party.name.charAt(0)}
                      </div>
                      {party.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "text-xs px-2 py-1 rounded-full capitalize",
                        party.party_type === "customer"
                          ? "bg-primary/10 text-primary"
                          : "bg-accent/10 text-accent"
                      )}
                    >
                      {party.party_type || "customer"}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {party.phone || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    ₹{(party.opening_balance || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right">
                    ₹{(party.purchasedAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right text-success">
                    ₹{(party.paymentsOut || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className={cn(
                    "text-right font-semibold",
                    (party.netDue || 0) > 0 ? "text-destructive" : (party.netDue || 0) < 0 ? "text-success" : ""
                  )}>
                    ₹{(party.netDue || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/parties/${party.id}`)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/parties/edit/${party.id}`)}>
                          Edit Party
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/parties/${party.id}/transactions`)}>
                          View Transactions
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDelete(party.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
