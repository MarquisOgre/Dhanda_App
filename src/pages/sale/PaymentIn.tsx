import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Calendar, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { PartySelector, sampleParties } from "@/components/sale/PartySelector";
import { useToast } from "@/hooks/use-toast";

const pendingInvoices = [
  { id: "INV-002", date: "01 Jan 2026", amount: 12800, balance: 7800 },
  { id: "INV-003", date: "31 Dec 2025", amount: 8400, balance: 8400 },
];

export default function PaymentIn() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [receiptNumber, setReceiptNumber] = useState("REC-001");
  const [paymentDate, setPaymentDate] = useState<Date>(new Date());
  const [selectedParty, setSelectedParty] = useState("");
  const [paymentMode, setPaymentMode] = useState("cash");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);

  const party = sampleParties.find(p => p.id === selectedParty);

  const handleSave = () => {
    if (!selectedParty) {
      toast({ title: "Error", description: "Please select a party", variant: "destructive" });
      return;
    }
    if (!amount || Number(amount) <= 0) {
      toast({ title: "Error", description: "Please enter a valid amount", variant: "destructive" });
      return;
    }
    toast({ title: "Success", description: "Payment recorded successfully!" });
    navigate("/sale/payment-in");
  };

  const toggleInvoice = (id: string) => {
    setSelectedInvoices(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/sale/invoices"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Record Payment In</h1>
            <p className="text-muted-foreground">Record payment received from customer</p>
          </div>
        </div>
        <Button onClick={handleSave} className="btn-gradient gap-2">
          <Save className="w-4 h-4" />Save Payment
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Details */}
          <div className="metric-card">
            <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Receipt Number</Label>
                <Input value={receiptNumber} onChange={(e) => setReceiptNumber(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Payment Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <Calendar className="mr-2 h-4 w-4" />{format(paymentDate, "dd MMM yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent mode="single" selected={paymentDate} onSelect={(d) => d && setPaymentDate(d)} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Payment Mode</Label>
                <Select value={paymentMode} onValueChange={setPaymentMode}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Party Selection */}
          <div className="metric-card">
            <h2 className="text-lg font-semibold mb-4">Customer</h2>
            <PartySelector value={selectedParty} onChange={setSelectedParty} partyType="customer" />
          </div>

          {/* Amount */}
          <div className="metric-card">
            <h2 className="text-lg font-semibold mb-4">Payment Amount</h2>
            <div className="space-y-2">
              <Label>Amount Received (₹)</Label>
              <Input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                placeholder="Enter amount"
                className="text-2xl font-bold h-14"
              />
            </div>
          </div>

          {/* Pending Invoices */}
          {selectedParty && (
            <div className="metric-card">
              <h2 className="text-lg font-semibold mb-4">Link to Pending Invoices (Optional)</h2>
              <div className="space-y-3">
                {pendingInvoices.map((inv) => (
                  <div 
                    key={inv.id} 
                    className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => toggleInvoice(inv.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox checked={selectedInvoices.includes(inv.id)} />
                      <div>
                        <p className="font-medium">{inv.id}</p>
                        <p className="text-sm text-muted-foreground">{inv.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{inv.balance.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">of ₹{inv.amount.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="metric-card">
            <h2 className="text-lg font-semibold mb-4">Notes</h2>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add payment notes..." rows={3} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="metric-card sticky top-6">
            <h2 className="text-lg font-semibold mb-4">Payment Summary</h2>
            <div className="space-y-4">
              {party && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-semibold">{party.name}</p>
                  <p className="text-sm">
                    Current Balance:{" "}
                    <span className={party.balance >= 0 ? "text-success" : "text-destructive"}>
                      ₹{Math.abs(party.balance).toLocaleString()}
                    </span>
                  </p>
                </div>
              )}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Receipt No</span>
                  <span className="font-medium">{receiptNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Date</span>
                  <span>{format(paymentDate, "dd MMM yyyy")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Mode</span>
                  <span className="capitalize">{paymentMode}</span>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <div className="flex justify-between text-lg font-bold">
                  <span>Amount</span>
                  <span className="text-primary">₹{Number(amount || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
