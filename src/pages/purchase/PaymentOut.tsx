import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Save, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PartySelector } from "@/components/sale/PartySelector";
import { cn } from "@/lib/utils";

const pendingBills = [
  { id: 1, number: "PUR-041", date: "01 Jan 2026", amount: 65200, balance: 35200 },
  { id: 2, number: "PUR-040", date: "30 Dec 2025", amount: 125000, balance: 125000 },
];

export default function PaymentOut() {
  const [receiptNumber] = useState("PAY-OUT-015");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedParty, setSelectedParty] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedBills, setSelectedBills] = useState<number[]>([]);

  const toggleBillSelection = (billId: number) => {
    setSelectedBills((prev) =>
      prev.includes(billId)
        ? prev.filter((id) => id !== billId)
        : [...prev, billId]
    );
  };

  const totalPending = pendingBills.reduce((sum, bill) => sum + bill.balance, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/purchase/payment-out">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Payment Out</h1>
            <p className="text-muted-foreground">Record payment to supplier</p>
          </div>
        </div>
        <Button className="btn-gradient gap-2">
          <Save className="w-4 h-4" />
          Save Payment
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Details */}
          <div className="metric-card">
            <h3 className="font-semibold mb-4">Payment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="receiptNo">Receipt Number</Label>
                <Input id="receiptNo" value={receiptNumber} readOnly className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentDate">Payment Date</Label>
                <Input
                  id="paymentDate"
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Supplier Selection */}
          <div className="metric-card">
            <h3 className="font-semibold mb-4">Supplier Details</h3>
            <PartySelector
              value={selectedParty}
              onChange={setSelectedParty}
              partyType="supplier"
              label="Select Supplier"
            />
          </div>

          {/* Pending Bills */}
          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Pending Bills</h3>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search bills..." className="pl-10" />
              </div>
            </div>
            <div className="space-y-3">
              {pendingBills.map((bill) => (
                <div
                  key={bill.id}
                  onClick={() => toggleBillSelection(bill.id)}
                  className={cn(
                    "p-4 rounded-lg border cursor-pointer transition-all",
                    selectedBills.includes(bill.id)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{bill.number}</p>
                      <p className="text-sm text-muted-foreground">{bill.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        Bill Amount: ₹{bill.amount.toLocaleString()}
                      </p>
                      <p className="font-semibold text-destructive">
                        Balance: ₹{bill.balance.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Mode */}
          <div className="metric-card">
            <h3 className="font-semibold mb-4">Payment Mode</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select value={paymentMode} onValueChange={setPaymentMode}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="₹0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="metric-card">
            <h3 className="font-semibold mb-4">Notes</h3>
            <Textarea
              placeholder="Add any notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          <div className="metric-card">
            <h3 className="font-semibold mb-4">Payment Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Pending</span>
                <span className="font-medium">₹{totalPending.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Amount</span>
                <span className="font-medium">₹{Number(amount || 0).toLocaleString()}</span>
              </div>
              <div className="border-t border-border pt-4">
                <div className="flex justify-between">
                  <span className="font-semibold">Remaining Balance</span>
                  <span className="font-bold text-lg">
                    ₹{(totalPending - Number(amount || 0)).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
