import { useState } from "react";
import { Download, Filter, IndianRupee, FileText, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const gstData = [
  { id: 1, period: "Jan 2026", taxableValue: 485000, cgst: 43650, sgst: 43650, igst: 0, total: 87300 },
  { id: 2, period: "Dec 2025", taxableValue: 620000, cgst: 55800, sgst: 55800, igst: 0, total: 111600 },
  { id: 3, period: "Nov 2025", taxableValue: 540000, cgst: 48600, sgst: 48600, igst: 0, total: 97200 },
  { id: 4, period: "Oct 2025", taxableValue: 580000, cgst: 52200, sgst: 52200, igst: 0, total: 104400 },
];

const tcsData = [
  { id: 1, date: "02 Jan 2026", party: "Rahul Electronics", invoice: "INV-001", amount: 45000, tcsRate: 0.1, tcsAmount: 45 },
  { id: 2, date: "01 Jan 2026", party: "Quick Mart", invoice: "INV-003", amount: 78000, tcsRate: 0.1, tcsAmount: 78 },
  { id: 3, date: "30 Dec 2025", party: "Tech Solutions", invoice: "INV-005", amount: 35600, tcsRate: 0.1, tcsAmount: 35.6 },
  { id: 4, date: "28 Dec 2025", party: "Global Systems", invoice: "INV-004", amount: 25000, tcsRate: 0.1, tcsAmount: 25 },
];

export default function TaxesReport() {
  const [period, setPeriod] = useState("this-quarter");

  const totalTaxable = gstData.reduce((sum, g) => sum + g.taxableValue, 0);
  const totalGST = gstData.reduce((sum, g) => sum + g.total, 0);
  const totalTCS = tcsData.reduce((sum, t) => sum + t.tcsAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Taxes Report (GST & TCS)</h1>
          <p className="text-muted-foreground">Tax collection and liability summary</p>
        </div>
        <div className="flex gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="this-quarter">This Quarter</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Taxable Value</p>
            <IndianRupee className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold mt-2">₹{totalTaxable.toLocaleString()}</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">GST Collected</p>
            <Calculator className="w-4 h-4 text-success" />
          </div>
          <p className="text-2xl font-bold mt-2 text-success">₹{totalGST.toLocaleString()}</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">TCS Collected</p>
            <FileText className="w-4 h-4 text-warning" />
          </div>
          <p className="text-2xl font-bold mt-2 text-warning">₹{totalTCS.toLocaleString()}</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Tax Liability</p>
            <IndianRupee className="w-4 h-4 text-destructive" />
          </div>
          <p className="text-2xl font-bold mt-2">₹{(totalGST + totalTCS).toLocaleString()}</p>
        </div>
      </div>

      <Tabs defaultValue="gst" className="space-y-6">
        <TabsList>
          <TabsTrigger value="gst">GST Summary</TabsTrigger>
          <TabsTrigger value="tcs">TCS Details</TabsTrigger>
        </TabsList>

        <TabsContent value="gst">
          <div className="metric-card overflow-hidden p-0">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Period</th>
                  <th className="text-right">Taxable Value</th>
                  <th className="text-right">CGST</th>
                  <th className="text-right">SGST</th>
                  <th className="text-right">IGST</th>
                  <th className="text-right">Total GST</th>
                </tr>
              </thead>
              <tbody>
                {gstData.map((gst) => (
                  <tr key={gst.id}>
                    <td className="font-medium">{gst.period}</td>
                    <td className="text-right">₹{gst.taxableValue.toLocaleString()}</td>
                    <td className="text-right">₹{gst.cgst.toLocaleString()}</td>
                    <td className="text-right">₹{gst.sgst.toLocaleString()}</td>
                    <td className="text-right">₹{gst.igst.toLocaleString()}</td>
                    <td className="text-right font-medium text-success">₹{gst.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-muted/50 font-semibold">
                  <td>Total</td>
                  <td className="text-right">₹{totalTaxable.toLocaleString()}</td>
                  <td className="text-right">₹{gstData.reduce((s, g) => s + g.cgst, 0).toLocaleString()}</td>
                  <td className="text-right">₹{gstData.reduce((s, g) => s + g.sgst, 0).toLocaleString()}</td>
                  <td className="text-right">₹0</td>
                  <td className="text-right text-success">₹{totalGST.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="tcs">
          <div className="metric-card overflow-hidden p-0">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Party</th>
                  <th>Invoice</th>
                  <th className="text-right">Invoice Amount</th>
                  <th className="text-center">TCS Rate</th>
                  <th className="text-right">TCS Amount</th>
                </tr>
              </thead>
              <tbody>
                {tcsData.map((tcs) => (
                  <tr key={tcs.id}>
                    <td className="text-muted-foreground">{tcs.date}</td>
                    <td className="font-medium">{tcs.party}</td>
                    <td>{tcs.invoice}</td>
                    <td className="text-right">₹{tcs.amount.toLocaleString()}</td>
                    <td className="text-center">{tcs.tcsRate}%</td>
                    <td className="text-right font-medium text-warning">₹{tcs.tcsAmount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-muted/50 font-semibold">
                  <td colSpan={5}>Total TCS Collected</td>
                  <td className="text-right text-warning">₹{totalTCS.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
