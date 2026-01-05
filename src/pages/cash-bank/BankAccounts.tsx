import { useState, useEffect } from "react";
import { Plus, Building2, CreditCard, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface BankAccount {
  id: string;
  account_name: string;
  bank_name: string | null;
  account_number: string | null;
  ifsc_code: string | null;
  current_balance: number | null;
  opening_balance: number | null;
  is_primary: boolean | null;
}

export default function BankAccounts() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  
  const [formData, setFormData] = useState({
    accountName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    openingBalance: "",
  });

  useEffect(() => {
    if (user) {
      fetchAccounts();
    }
  }, [user]);

  const fetchAccounts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bank_accounts")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) {
      setAccounts(data);
    }
    setLoading(false);
  };

  const handleAddAccount = async () => {
    if (!user) {
      toast.error("Please login first");
      return;
    }
    if (!formData.accountName.trim()) {
      toast.error("Account name is required");
      return;
    }

    setSaving(true);
    try {
      const openingBalance = formData.openingBalance ? parseFloat(formData.openingBalance) : 0;
      
      const { error } = await supabase.from("bank_accounts").insert({
        user_id: user.id,
        account_name: formData.accountName.trim(),
        bank_name: formData.bankName || null,
        account_number: formData.accountNumber || null,
        ifsc_code: formData.ifscCode || null,
        opening_balance: openingBalance,
        current_balance: openingBalance,
      });

      if (error) throw error;
      
      toast.success("Bank account added successfully!");
      setIsOpen(false);
      setFormData({
        accountName: "",
        bankName: "",
        accountNumber: "",
        ifscCode: "",
        openingBalance: "",
      });
      fetchAccounts();
    } catch (error: any) {
      toast.error(error.message || "Failed to add bank account");
    } finally {
      setSaving(false);
    }
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.current_balance || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bank Accounts</h1>
          <p className="text-muted-foreground">Manage your bank accounts and transactions</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gradient gap-2">
              <Plus className="w-4 h-4" />
              Add Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Bank Account</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="accountName">Account Name *</Label>
                <Input 
                  id="accountName" 
                  placeholder="e.g., HDFC Current Account" 
                  value={formData.accountName}
                  onChange={(e) => setFormData(prev => ({ ...prev, accountName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input 
                  id="bankName" 
                  placeholder="e.g., HDFC Bank" 
                  value={formData.bankName}
                  onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountNo">Account Number</Label>
                <Input 
                  id="accountNo" 
                  placeholder="Enter account number" 
                  value={formData.accountNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ifsc">IFSC Code</Label>
                <Input 
                  id="ifsc" 
                  placeholder="e.g., HDFC0001234" 
                  value={formData.ifscCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, ifscCode: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="openingBalance">Opening Balance</Label>
                <Input 
                  id="openingBalance" 
                  type="number" 
                  placeholder="₹0" 
                  value={formData.openingBalance}
                  onChange={(e) => setFormData(prev => ({ ...prev, openingBalance: e.target.value }))}
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button className="btn-gradient" onClick={handleAddAccount} disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Add Account
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Total Balance Card */}
      <div className="metric-card bg-gradient-to-r from-primary to-accent text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80">Total Bank Balance</p>
            <p className="text-3xl font-bold mt-1">₹{totalBalance.toLocaleString()}</p>
            <p className="text-sm opacity-80 mt-2">{accounts.length} accounts</p>
          </div>
          <Building2 className="w-16 h-16 opacity-30" />
        </div>
      </div>

      {/* Accounts Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : accounts.length === 0 ? (
        <div className="metric-card text-center py-12">
          <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No bank accounts added yet</p>
          <p className="text-sm text-muted-foreground">Click "Add Account" to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {accounts.map((account) => (
            <div key={account.id} className="metric-card">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                {account.is_primary && (
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                    Primary
                  </span>
                )}
              </div>
              <h3 className="font-semibold">{account.account_name}</h3>
              <p className="text-sm text-muted-foreground">{account.bank_name || "Bank not specified"}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {account.account_number ? `****${account.account_number.slice(-4)}` : "No account number"}
              </p>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className="text-xl font-bold text-primary">
                  ₹{(account.current_balance || 0).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
