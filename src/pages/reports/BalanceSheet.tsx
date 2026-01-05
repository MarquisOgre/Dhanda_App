import { useState, useEffect } from "react";
import { Building2, Wallet, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PrintButton } from "@/components/PrintButton";
import { generateReportPDF, downloadPDF } from "@/lib/pdf";
import { printTable } from "@/lib/print";
import { supabase } from "@/integrations/supabase/client";

export default function BalanceSheet() {
  const [asOnDate, setAsOnDate] = useState("today");
  const [loading, setLoading] = useState(true);
  const [cashInHand, setCashInHand] = useState(0);
  const [bankBalance, setBankBalance] = useState(0);
  const [receivables, setReceivables] = useState(0);
  const [inventory, setInventory] = useState(0);
  const [payables, setPayables] = useState(0);

  useEffect(() => {
    fetchBalanceSheetData();
  }, []);

  const fetchBalanceSheetData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get cash transactions
      const { data: cashTxns } = await supabase
        .from('cash_transactions')
        .select('amount, transaction_type')
        .eq('user_id', user.id);

      let cash = 0;
      (cashTxns || []).forEach(txn => {
        if (txn.transaction_type === 'in') {
          cash += txn.amount;
        } else {
          cash -= txn.amount;
        }
      });
      setCashInHand(cash);

      // Get bank accounts balance
      const { data: bankAccounts } = await supabase
        .from('bank_accounts')
        .select('current_balance')
        .eq('user_id', user.id);

      const bankTotal = (bankAccounts || []).reduce((sum, acc) => sum + (acc.current_balance || 0), 0);
      setBankBalance(bankTotal);

      // Get receivables (unpaid sales)
      const { data: salesInvoices } = await supabase
        .from('invoices')
        .select('balance_due')
        .eq('user_id', user.id)
        .eq('invoice_type', 'sale')
        .eq('is_deleted', false);

      const totalReceivables = (salesInvoices || []).reduce((sum, inv) => sum + (inv.balance_due || 0), 0);
      setReceivables(totalReceivables);

      // Get payables (unpaid purchases)
      const { data: purchaseInvoices } = await supabase
        .from('invoices')
        .select('balance_due')
        .eq('user_id', user.id)
        .eq('invoice_type', 'purchase')
        .eq('is_deleted', false);

      const totalPayables = (purchaseInvoices || []).reduce((sum, inv) => sum + (inv.balance_due || 0), 0);
      setPayables(totalPayables);

      // Get inventory value
      const { data: items } = await supabase
        .from('items')
        .select('current_stock, purchase_price')
        .eq('user_id', user.id)
        .eq('is_deleted', false);

      const inventoryValue = (items || []).reduce((sum, item) => 
        sum + ((item.current_stock || 0) * (item.purchase_price || 0)), 0);
      setInventory(inventoryValue);

    } catch (error) {
      console.error('Error fetching balance sheet:', error);
    } finally {
      setLoading(false);
    }
  };

  const assets = {
    current: [
      { name: "Cash in Hand", amount: cashInHand },
      { name: "Bank Accounts", amount: bankBalance },
      { name: "Accounts Receivable", amount: receivables },
      { name: "Inventory", amount: inventory },
    ],
  };

  const liabilities = {
    current: [
      { name: "Accounts Payable", amount: payables },
    ],
  };

  const totalCurrentAssets = assets.current.reduce((sum, a) => sum + a.amount, 0);
  const totalAssets = totalCurrentAssets;
  const totalCurrentLiabilities = liabilities.current.reduce((sum, l) => sum + l.amount, 0);
  const totalLiabilities = totalCurrentLiabilities;
  const totalEquity = totalAssets - totalLiabilities;

  const handlePrint = () => {
    const allRows = [
      ["ASSETS", "", ""],
      ["Current Assets", "", ""],
      ...assets.current.map(a => ["", a.name, `₹${a.amount.toLocaleString()}`]),
      ["", "Total Current Assets", `₹${totalCurrentAssets.toLocaleString()}`],
      ["", "TOTAL ASSETS", `₹${totalAssets.toLocaleString()}`],
      ["", "", ""],
      ["LIABILITIES & EQUITY", "", ""],
      ["Current Liabilities", "", ""],
      ...liabilities.current.map(l => ["", l.name, `₹${l.amount.toLocaleString()}`]),
      ["", "Total Liabilities", `₹${totalLiabilities.toLocaleString()}`],
      ["Owner's Equity", "", ""],
      ["", "Net Worth", `₹${totalEquity.toLocaleString()}`],
      ["", "TOTAL LIABILITIES + EQUITY", `₹${totalAssets.toLocaleString()}`],
    ];

    printTable({
      title: "Balance Sheet",
      subtitle: "As on Today",
      columns: ["Section", "Particulars", "Amount"],
      rows: allRows,
    });
  };

  const handleExportPDF = () => {
    const allRows = [
      ["ASSETS", "", ""],
      ["Current Assets", "", ""],
      ...assets.current.map(a => ["", a.name, `₹${a.amount.toLocaleString()}`]),
      ["", "Total Current Assets", `₹${totalCurrentAssets.toLocaleString()}`],
      ["", "TOTAL ASSETS", `₹${totalAssets.toLocaleString()}`],
      ["", "", ""],
      ["LIABILITIES & EQUITY", "", ""],
      ["Current Liabilities", "", ""],
      ...liabilities.current.map(l => ["", l.name, `₹${l.amount.toLocaleString()}`]),
      ["", "Total Liabilities", `₹${totalLiabilities.toLocaleString()}`],
      ["Owner's Equity", "", ""],
      ["", "Net Worth", `₹${totalEquity.toLocaleString()}`],
      ["", "TOTAL LIABILITIES + EQUITY", `₹${totalAssets.toLocaleString()}`],
    ];

    const doc = generateReportPDF({
      title: "Balance Sheet",
      subtitle: "Dhandha App",
      dateRange: "As on Today",
      columns: ["Section", "Particulars", "Amount"],
      rows: allRows,
    });
    downloadPDF(doc, `balance-sheet-${new Date().toISOString().split('T')[0]}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
          <PrintButton onPrint={handlePrint} onExportPDF={handleExportPDF} />
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
            <p className="text-sm text-muted-foreground">Net Worth</p>
            <Wallet className="w-4 h-4 text-success" />
          </div>
          <p className={`text-2xl font-bold mt-2 ${totalEquity >= 0 ? 'text-success' : 'text-destructive'}`}>
            ₹{totalEquity.toLocaleString()}
          </p>
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
                <span className="font-medium">Total Liabilities</span>
                <span className="font-bold">₹{totalLiabilities.toLocaleString()}</span>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Owner's Equity</h4>
              <div className="flex justify-between py-2 border-b border-border">
                <span>Net Worth</span>
                <span className={`font-medium ${totalEquity >= 0 ? 'text-success' : 'text-destructive'}`}>
                  ₹{totalEquity.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex justify-between py-3 bg-primary/10 px-3 rounded-lg">
              <span className="font-semibold">Total Liabilities + Equity</span>
              <span className="font-bold text-primary">₹{totalAssets.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
