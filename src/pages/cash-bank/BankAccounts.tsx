import { useState } from "react";
import { Plus, Building2, CreditCard, TrendingUp, TrendingDown } from "lucide-react";
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

const accounts = [
  {
    id: 1,
    name: "HDFC Current Account",
    type: "Current",
    accountNo: "XXXX XXXX 4567",
    balance: 485200,
    bank: "HDFC Bank",
  },
  {
    id: 2,
    name: "ICICI Savings Account",
    type: "Savings",
    accountNo: "XXXX XXXX 8901",
    balance: 125800,
    bank: "ICICI Bank",
  },
  {
    id: 3,
    name: "SBI Business Account",
    type: "Current",
    accountNo: "XXXX XXXX 2345",
    balance: 312400,
    bank: "State Bank of India",
  },
];

const recentTransactions = [
  { id: 1, type: "credit", desc: "Payment from Rahul Electronics", amount: 45000, date: "Today" },
  { id: 2, type: "debit", desc: "Payment to Metro Suppliers", amount: 28500, date: "Today" },
  { id: 3, type: "credit", desc: "Payment from Sharma Traders", amount: 5000, date: "Yesterday" },
  { id: 4, type: "debit", desc: "Salary Payment", amount: 85000, date: "Yesterday" },
];

export default function BankAccounts() {
  const [isOpen, setIsOpen] = useState(false);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

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
                <Label htmlFor="accountName">Account Name</Label>
                <Input id="accountName" placeholder="e.g., HDFC Current Account" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input id="bankName" placeholder="e.g., HDFC Bank" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountNo">Account Number</Label>
                <Input id="accountNo" placeholder="Enter account number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="openingBalance">Opening Balance</Label>
                <Input id="openingBalance" type="number" placeholder="₹0" />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button className="btn-gradient">Add Account</Button>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {accounts.map((account) => (
          <div key={account.id} className="metric-card">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-muted">
                {account.type}
              </span>
            </div>
            <h3 className="font-semibold">{account.name}</h3>
            <p className="text-sm text-muted-foreground">{account.bank}</p>
            <p className="text-xs text-muted-foreground mt-1">{account.accountNo}</p>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">Balance</p>
              <p className="text-xl font-bold text-primary">
                ₹{account.balance.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="metric-card">
        <h3 className="font-semibold text-lg mb-4">Recent Bank Transactions</h3>
        <div className="space-y-3">
          {recentTransactions.map((txn) => (
            <div
              key={txn.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "p-2 rounded-lg",
                    txn.type === "credit"
                      ? "bg-success/10 text-success"
                      : "bg-warning/10 text-warning"
                  )}
                >
                  {txn.type === "credit" ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-sm">{txn.desc}</p>
                  <p className="text-xs text-muted-foreground">{txn.date}</p>
                </div>
              </div>
              <p
                className={cn(
                  "font-semibold",
                  txn.type === "credit" ? "text-success" : "text-foreground"
                )}
              >
                {txn.type === "credit" ? "+" : "-"}₹{txn.amount.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
