import { Download, Building2, Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function BalanceSheet() {
  const [asOnDate, setAsOnDate] = useState("today");

  const assets = {
    current: [
      { name: "Cash in Hand", amount: 125000 },
      { name: "Bank Accounts", amount: 845000 },
      { name: "Accounts Receivable", amount: 425000 },
      { name: "Inventory", amount: 680000 },
      { name: "Prepaid Expenses", amount: 35000 },
    ],
    fixed: [
      { name: "Furniture & Fixtures", amount: 150000 },
      { name: "Equipment", amount: 280000 },
      { name: "Vehicles", amount: 450000 },
      { name: "Less: Accumulated Depreciation", amount: -185000 },
    ],
  };

  const liabilities = {
    current: [
      { name: "Accounts Payable", amount: 325000 },
      { name: "Short-term Loans", amount: 100000 },
      { name: "Accrued Expenses", amount: 45000 },
      { name: "Taxes Payable", amount: 85000 },
    ],
    longTerm: [
      { name: "Bank Loan", amount: 500000 },
      { name: "Other Long-term Liabilities", amount: 75000 },
    ],
  };

  const equity = [
    { name: "Capital", amount: 1000000 },
    { name: "Retained Earnings", amount: 450000 },
    { name: "Current Year Profit", amount: 225000 },
  ];

  const totalCurrentAssets = assets.current.reduce((sum, a) => sum + a.amount, 0);
  const totalFixedAssets = assets.fixed.reduce((sum, a) => sum + a.amount, 0);
  const totalAssets = totalCurrentAssets + totalFixedAssets;

  const totalCurrentLiabilities = liabilities.current.reduce((sum, l) => sum + l.amount, 0);
  const totalLongTermLiabilities = liabilities.longTerm.reduce((sum, l) => sum + l.amount, 0);
  const totalLiabilities = totalCurrentLiabilities + totalLongTermLiabilities;

  const totalEquity = equity.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Balance Sheet</h1>
          <p className="text-muted-foreground">Financial position statement</p>
        </div>
        <div className="flex gap-3">
          <Select value={asOnDate} onValueChange={setAsOnDate}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">As on Today</SelectItem>
              <SelectItem value="month-end">Month End</SelectItem>
              <SelectItem value="quarter-end">Quarter End</SelectItem>
              <SelectItem value="year-end">Year End (31 Mar)</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Assets</p>
            <Building2 className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold mt-2">₹{totalAssets.toLocaleString()}</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Liabilities</p>
            <TrendingDown className="w-4 h-4 text-destructive" />
          </div>
          <p className="text-2xl font-bold mt-2">₹{totalLiabilities.toLocaleString()}</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Owner's Equity</p>
            <Wallet className="w-4 h-4 text-success" />
          </div>
          <p className="text-2xl font-bold mt-2 text-success">₹{totalEquity.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assets */}
        <div className="metric-card">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Assets
          </h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Current Assets</h4>
              {assets.current.map((item, idx) => (
                <div key={idx} className="flex justify-between py-2 border-b border-border">
                  <span>{item.name}</span>
                  <span className="font-medium">₹{item.amount.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 bg-muted/50 px-2 rounded mt-2">
                <span className="font-medium">Total Current Assets</span>
                <span className="font-bold">₹{totalCurrentAssets.toLocaleString()}</span>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Fixed Assets</h4>
              {assets.fixed.map((item, idx) => (
                <div key={idx} className="flex justify-between py-2 border-b border-border">
                  <span>{item.name}</span>
                  <span className={`font-medium ${item.amount < 0 ? 'text-destructive' : ''}`}>
                    {item.amount < 0 ? '-' : ''}₹{Math.abs(item.amount).toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="flex justify-between py-2 bg-muted/50 px-2 rounded mt-2">
                <span className="font-medium">Total Fixed Assets</span>
                <span className="font-bold">₹{totalFixedAssets.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between py-3 bg-primary/10 px-3 rounded-lg">
              <span className="font-semibold">Total Assets</span>
              <span className="font-bold text-primary">₹{totalAssets.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Liabilities & Equity */}
        <div className="metric-card">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-destructive" />
            Liabilities & Equity
          </h3>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Current Liabilities</h4>
              {liabilities.current.map((item, idx) => (
                <div key={idx} className="flex justify-between py-2 border-b border-border">
                  <span>{item.name}</span>
                  <span className="font-medium">₹{item.amount.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 bg-muted/50 px-2 rounded mt-2">
                <span className="font-medium">Total Current Liabilities</span>
                <span className="font-bold">₹{totalCurrentLiabilities.toLocaleString()}</span>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Long-term Liabilities</h4>
              {liabilities.longTerm.map((item, idx) => (
                <div key={idx} className="flex justify-between py-2 border-b border-border">
                  <span>{item.name}</span>
                  <span className="font-medium">₹{item.amount.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 bg-muted/50 px-2 rounded mt-2">
                <span className="font-medium">Total Long-term Liabilities</span>
                <span className="font-bold">₹{totalLongTermLiabilities.toLocaleString()}</span>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Owner's Equity</h4>
              {equity.map((item, idx) => (
                <div key={idx} className="flex justify-between py-2 border-b border-border">
                  <span>{item.name}</span>
                  <span className="font-medium text-success">₹{item.amount.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 bg-success/10 px-2 rounded mt-2">
                <span className="font-medium">Total Equity</span>
                <span className="font-bold text-success">₹{totalEquity.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between py-3 bg-primary/10 px-3 rounded-lg">
              <span className="font-semibold">Total Liabilities + Equity</span>
              <span className="font-bold text-primary">₹{(totalLiabilities + totalEquity).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
