import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Save, Upload } from "lucide-react";
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

const expenseCategories = [
  "Office Supplies",
  "Utilities",
  "Rent",
  "Travel",
  "Marketing",
  "Salaries",
  "Insurance",
  "Maintenance",
  "Subscriptions",
  "Other",
];

export default function CreateExpense() {
  const [expenseNumber] = useState("EXP-026");
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/purchase/expenses">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Add Expense</h1>
            <p className="text-muted-foreground">Record a new business expense</p>
          </div>
        </div>
        <Button className="btn-gradient gap-2">
          <Save className="w-4 h-4" />
          Save Expense
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Expense Details */}
          <div className="metric-card">
            <h3 className="font-semibold mb-4">Expense Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expenseNo">Expense Number</Label>
                <Input id="expenseNo" value={expenseNumber} readOnly className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expenseDate">Date</Label>
                <Input
                  id="expenseDate"
                  type="date"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((cat) => (
                      <SelectItem key={cat} value={cat.toLowerCase()}>
                        {cat}
                      </SelectItem>
                    ))}
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

          {/* Payment Details */}
          <div className="metric-card">
            <h3 className="font-semibold mb-4">Payment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Payment Mode</Label>
                <Select value={paymentMode} onValueChange={setPaymentMode}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reference">Reference Number</Label>
                <Input id="reference" placeholder="Transaction/Cheque number" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="metric-card">
            <h3 className="font-semibold mb-4">Description</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Expense Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the expense..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="metric-card">
            <h3 className="font-semibold mb-4">Attachments</h3>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">
                Drag and drop files here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supported formats: PDF, JPG, PNG (Max 5MB)
              </p>
              <Button variant="outline" className="mt-4">
                Choose Files
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          <div className="metric-card">
            <h3 className="font-semibold mb-4">Expense Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium capitalize">{category || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Mode</span>
                <span className="font-medium capitalize">{paymentMode || "-"}</span>
              </div>
              <div className="border-t border-border pt-4">
                <div className="flex justify-between">
                  <span className="font-semibold">Amount</span>
                  <span className="font-bold text-xl text-primary">
                    ₹{Number(amount || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <h3 className="font-semibold mb-4">Quick Tips</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Keep receipts for tax purposes</li>
              <li>• Categorize expenses correctly</li>
              <li>• Add clear descriptions</li>
              <li>• Attach supporting documents</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
