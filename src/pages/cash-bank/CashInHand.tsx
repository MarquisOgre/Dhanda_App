import { useState, useEffect } from "react";
import { Plus, Banknote, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

interface CashTransaction {
  id: string;
  transaction_type: string;
  description: string | null;
  amount: number;
  transaction_date: string;
  created_at: string;
}

export default function CashInHand() {
  const { user } = useAuth();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [transactions, setTransactions] = useState<CashTransaction[]>([]);
  
  const [formData, setFormData] = useState({
    transactionType: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("cash_transactions")
      .select("*")
      .order("transaction_date", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(20);
    
    if (data) {
      setTransactions(data);
    }
    setLoading(false);
  };

  const handleAddTransaction = async () => {
    if (!user) {
      toast.error("Please login first");
      return;
    }
    if (!formData.transactionType) {
      toast.error("Please select transaction type");
      return;
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from("cash_transactions").insert({
        user_id: user.id,
        transaction_type: formData.transactionType,
        amount: parseFloat(formData.amount),
        description: formData.description || null,
        transaction_date: formData.date,
      });

      if (error) throw error;
      
      toast.success("Transaction added successfully!");
      setIsAddOpen(false);
      setFormData({
        transactionType: "",
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });
      fetchTransactions();
    } catch (error: any) {
      toast.error(error.message || "Failed to add transaction");
    } finally {
      setSaving(false);
    }
  };

  // Calculate balances
  const cashIn = transactions
    .filter(t => t.transaction_type === "in")
    .reduce((sum, t) => sum + t.amount, 0);
  const cashOut = transactions
    .filter(t => t.transaction_type === "out")
    .reduce((sum, t) => sum + t.amount, 0);
  const currentBalance = cashIn - cashOut;

  // Today's transactions
  const today = new Date().toISOString().split("T")[0];
  const todayIn = transactions
    .filter(t => t.transaction_date === today && t.transaction_type === "in")
    .reduce((sum, t) => sum + t.amount, 0);
  const todayOut = transactions
    .filter(t => t.transaction_date === today && t.transaction_type === "out")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Cash in Hand</h1>
          <p className="text-muted-foreground">Track your cash transactions</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gradient gap-2">
              <Plus className="w-4 h-4" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Cash Transaction</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Transaction Type *</Label>
                <Select 
                  value={formData.transactionType} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, transactionType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in">Cash In</SelectItem>
                    <SelectItem value="out">Cash Out</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount *</Label>
                <Input 
                  id="amount" 
                  type="number" 
                  placeholder="₹0.00" 
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description" 
                  placeholder="Enter description" 
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input 
                  id="date" 
                  type="date" 
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button className="btn-gradient" onClick={handleAddTransaction} disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Save Transaction
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cash Balance Card */}
      <div className="metric-card bg-gradient-to-r from-success to-accent text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80">Cash in Hand</p>
            <p className="text-4xl font-bold mt-2">₹{currentBalance.toLocaleString()}</p>
            <p className="text-sm opacity-80 mt-2">As of today</p>
          </div>
          <Banknote className="w-20 h-20 opacity-30" />
        </div>
      </div>

      {/* Today's Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Today's Cash In</p>
              <p className="text-2xl font-bold text-success mt-1">₹{todayIn.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-xl bg-success/10">
              <ArrowUpRight className="w-6 h-6 text-success" />
            </div>
          </div>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Today's Cash Out</p>
              <p className="text-2xl font-bold text-destructive mt-1">₹{todayOut.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-xl bg-destructive/10">
              <ArrowDownRight className="w-6 h-6 text-destructive" />
            </div>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="metric-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Recent Transactions</h3>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8">
            <Banknote className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No transactions yet</p>
            <p className="text-sm text-muted-foreground">Add your first cash transaction</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((txn) => (
              <div
                key={txn.id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "p-3 rounded-xl",
                      txn.transaction_type === "in"
                        ? "bg-success/10 text-success"
                        : "bg-destructive/10 text-destructive"
                    )}
                  >
                    {txn.transaction_type === "in" ? (
                      <TrendingUp className="w-5 h-5" />
                    ) : (
                      <TrendingDown className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{txn.description || (txn.transaction_type === "in" ? "Cash In" : "Cash Out")}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(txn.transaction_date), "dd MMM yyyy")}
                    </p>
                  </div>
                </div>
                <p
                  className={cn(
                    "font-bold text-lg",
                    txn.transaction_type === "in" ? "text-success" : "text-destructive"
                  )}
                >
                  {txn.transaction_type === "in" ? "+" : "-"}₹{txn.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
