import { useState } from "react";
import { Plus, Banknote, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";
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

const cashTransactions = [
  { id: 1, type: "in", desc: "Cash sale to Rahul Electronics", amount: 15000, date: "02 Jan 2026", time: "10:30 AM" },
  { id: 2, type: "out", desc: "Office supplies purchase", amount: 2500, date: "02 Jan 2026", time: "09:15 AM" },
  { id: 3, type: "in", desc: "Payment from Sharma Traders", amount: 8000, date: "01 Jan 2026", time: "04:45 PM" },
  { id: 4, type: "out", desc: "Petty cash - Staff lunch", amount: 1200, date: "01 Jan 2026", time: "01:30 PM" },
  { id: 5, type: "in", desc: "Cash sale to Walk-in Customer", amount: 5500, date: "01 Jan 2026", time: "11:00 AM" },
  { id: 6, type: "out", desc: "Courier charges", amount: 350, date: "31 Dec 2025", time: "05:00 PM" },
];

export default function CashInHand() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [transactionType, setTransactionType] = useState("");

  const currentBalance = 45650;
  const todayIn = 15000;
  const todayOut = 2500;

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
                <Label>Transaction Type</Label>
                <Select value={transactionType} onValueChange={setTransactionType}>
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
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" type="number" placeholder="₹0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="Enter description" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button className="btn-gradient">Save Transaction</Button>
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
          <Button variant="outline" size="sm">View All</Button>
        </div>
        <div className="space-y-3">
          {cashTransactions.map((txn) => (
            <div
              key={txn.id}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "p-3 rounded-xl",
                    txn.type === "in"
                      ? "bg-success/10 text-success"
                      : "bg-destructive/10 text-destructive"
                  )}
                >
                  {txn.type === "in" ? (
                    <TrendingUp className="w-5 h-5" />
                  ) : (
                    <TrendingDown className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{txn.desc}</p>
                  <p className="text-sm text-muted-foreground">
                    {txn.date} at {txn.time}
                  </p>
                </div>
              </div>
              <p
                className={cn(
                  "font-bold text-lg",
                  txn.type === "in" ? "text-success" : "text-destructive"
                )}
              >
                {txn.type === "in" ? "+" : "-"}₹{txn.amount.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button variant="outline" className="h-20 flex-col gap-2">
          <ArrowUpRight className="w-6 h-6 text-success" />
          <span>Record Cash In</span>
        </Button>
        <Button variant="outline" className="h-20 flex-col gap-2">
          <ArrowDownRight className="w-6 h-6 text-destructive" />
          <span>Record Cash Out</span>
        </Button>
        <Button variant="outline" className="h-20 flex-col gap-2">
          <Banknote className="w-6 h-6 text-primary" />
          <span>Transfer to Bank</span>
        </Button>
      </div>
    </div>
  );
}
