import { useState } from "react";
import { Filter, TrendingUp, TrendingDown, IndianRupee, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const purchaseData = [
  { id: 1, bill: "PUR-041", date: "02 Jan 2026", party: "ABC Suppliers", items: 10, amount: 125000, paid: 100000 },
  { id: 2, bill: "PUR-040", date: "01 Jan 2026", party: "XYZ Distributors", items: 5, amount: 45000, paid: 45000 },
  { id: 3, bill: "PUR-039", date: "30 Dec 2025", party: "Metro Wholesale", items: 15, amount: 85000, paid: 50000 },
  { id: 4, bill: "PUR-038", date: "28 Dec 2025", party: "Tech Components", items: 8, amount: 62000, paid: 62000 },
  { id: 5, bill: "PUR-037", date: "25 Dec 2025", party: "Global Parts", items: 20, amount: 98000, paid: 75000 },
];

export default function PurchaseReport() {
  const [dateRange, setDateRange] = useState("this-month");
  
  const totalPurchase = purchaseData.reduce((sum, p) => sum + p.amount, 0);
  const totalPaid = purchaseData.reduce((sum, p) => sum + p.paid, 0);
  const totalPending = totalPurchase - totalPaid;

  const handlePrint = () => {
    printTable({
      title: "Purchase Report",
      subtitle: "This Month",
      columns: ["Bill No.", "Date", "Supplier", "Items", "Amount", "Paid", "Balance"],
      rows: purchaseData.map(p => [
        p.bill,
        p.date,
        p.party,
        p.items,
        `₹${p.amount.toLocaleString()}`,
        `₹${p.paid.toLocaleString()}`,
        `₹${(p.amount - p.paid).toLocaleString()}`
      ]),
      summary: [
        { label: "Total Purchase", value: `₹${totalPurchase.toLocaleString()}` },
        { label: "Total Paid", value: `₹${totalPaid.toLocaleString()}` },
        { label: "Pending Payment", value: `₹${totalPending.toLocaleString()}` },
      ]
    });
  };

  const handleExportPDF = () => {
    const doc = generateReportPDF({
      title: "Purchase Report",
      subtitle: "Dhandha App",
      dateRange: "This Month",
      columns: ["Bill No.", "Date", "Supplier", "Items", "Amount", "Paid", "Balance"],
      rows: purchaseData.map(p => [
        p.bill,
        p.date,
        p.party,
        p.items,
        `₹${p.amount.toLocaleString()}`,
        `₹${p.paid.toLocaleString()}`,
        `₹${(p.amount - p.paid).toLocaleString()}`
      ]),
      summary: [
        { label: "Total Purchase", value: `₹${totalPurchase.toLocaleString()}` },
        { label: "Total Paid", value: `₹${totalPaid.toLocaleString()}` },
        { label: "Pending Payment", value: `₹${totalPending.toLocaleString()}` },
      ]
    });
    downloadPDF(doc, `purchase-report-${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Purchase Report</h1>
          <p className="text-muted-foreground">Track your purchase transactions</p>
        </div>
        <PrintButton onPrint={handlePrint} onExportPDF={handleExportPDF} />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Purchase</p>
            <IndianRupee className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold mt-2">₹{totalPurchase.toLocaleString()}</p>
          <p className="text-xs text-destructive mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +8.3% from last month
          </p>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Amount Paid</p>
            <TrendingDown className="w-4 h-4 text-success" />
          </div>
          <p className="text-2xl font-bold mt-2 text-success">₹{totalPaid.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">{((totalPaid / totalPurchase) * 100).toFixed(1)}% of total</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Pending Payment</p>
            <IndianRupee className="w-4 h-4 text-warning" />
          </div>
          <p className="text-2xl font-bold mt-2 text-warning">₹{totalPending.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">{((totalPending / totalPurchase) * 100).toFixed(1)}% pending</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Bills</p>
            <Package className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold mt-2">{purchaseData.length}</p>
          <p className="text-xs text-muted-foreground mt-1">This period</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="this-week">This Week</SelectItem>
            <SelectItem value="this-month">This Month</SelectItem>
            <SelectItem value="this-quarter">This Quarter</SelectItem>
            <SelectItem value="this-year">This Year</SelectItem>
          </SelectContent>
        </Select>
        <Input type="date" className="w-[150px]" />
        <Input type="date" className="w-[150px]" />
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          More Filters
        </Button>
      </div>

      {/* Data Table */}
      <div className="metric-card overflow-hidden p-0">
        <table className="data-table">
          <thead>
            <tr>
              <th>Bill No.</th>
              <th>Date</th>
              <th>Supplier</th>
              <th className="text-center">Items</th>
              <th className="text-right">Amount</th>
              <th className="text-right">Paid</th>
              <th className="text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            {purchaseData.map((purchase) => (
              <tr key={purchase.id}>
                <td className="font-medium">{purchase.bill}</td>
                <td className="text-muted-foreground">{purchase.date}</td>
                <td>{purchase.party}</td>
                <td className="text-center">{purchase.items}</td>
                <td className="text-right font-medium">₹{purchase.amount.toLocaleString()}</td>
                <td className="text-right text-success">₹{purchase.paid.toLocaleString()}</td>
                <td className="text-right text-warning">₹{(purchase.amount - purchase.paid).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-muted/50 font-semibold">
              <td colSpan={4}>Total</td>
              <td className="text-right">₹{totalPurchase.toLocaleString()}</td>
              <td className="text-right text-success">₹{totalPaid.toLocaleString()}</td>
              <td className="text-right text-warning">₹{totalPending.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
