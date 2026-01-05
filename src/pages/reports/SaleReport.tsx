import { useState, useEffect } from "react";
import { Download, Filter, Calendar, TrendingUp, IndianRupee, Loader2 } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface SaleData {
  id: string;
  invoice_number: string;
  invoice_date: string;
  party_name: string;
  items_count: number;
  total_amount: number;
  subtotal: number;
}

export default function SaleReport() {
  const [dateRange, setDateRange] = useState("this-month");
  const [salesData, setSalesData] = useState<SaleData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: invoices, error } = await supabase
        .from('invoices')
        .select(`
          id,
          invoice_number,
          invoice_date,
          total_amount,
          subtotal,
          party_id,
          parties (name)
        `)
        .eq('user_id', user.id)
        .eq('invoice_type', 'sale')
        .eq('is_deleted', false)
        .order('invoice_date', { ascending: false });

      if (error) throw error;

      // Get item counts for each invoice
      const salesWithItems = await Promise.all(
        (invoices || []).map(async (inv) => {
          const { count } = await supabase
            .from('invoice_items')
            .select('*', { count: 'exact', head: true })
            .eq('invoice_id', inv.id);

          return {
            id: inv.id,
            invoice_number: inv.invoice_number,
            invoice_date: inv.invoice_date,
            party_name: (inv.parties as any)?.name || 'Walk-in Customer',
            items_count: count || 0,
            total_amount: inv.total_amount || 0,
            subtotal: inv.subtotal || 0,
          };
        })
      );

      setSalesData(salesWithItems);
    } catch (error) {
      console.error('Error fetching sales:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalSales = salesData.reduce((sum, s) => sum + s.total_amount, 0);
  const totalCost = salesData.reduce((sum, s) => sum + s.subtotal, 0);
  const totalProfit = totalSales - totalCost;
  const avgOrderValue = salesData.length > 0 ? totalSales / salesData.length : 0;

  const handlePrint = () => {
    printTable({
      title: "Sale Report",
      subtitle: "This Month",
      columns: ["Invoice", "Date", "Party", "Items", "Amount"],
      rows: salesData.map(sale => [
        sale.invoice_number,
        format(new Date(sale.invoice_date), 'dd MMM yyyy'),
        sale.party_name,
        sale.items_count,
        `₹${sale.total_amount.toLocaleString()}`,
      ]),
      summary: [
        { label: "Total Sales", value: `₹${totalSales.toLocaleString()}` },
        { label: "Total Invoices", value: salesData.length.toString() },
      ]
    });
  };

  const handleExportPDF = () => {
    const doc = generateReportPDF({
      title: "Sale Report",
      subtitle: "Dhandha App",
      dateRange: "This Month",
      columns: ["Invoice", "Date", "Party", "Items", "Amount"],
      rows: salesData.map(sale => [
        sale.invoice_number,
        format(new Date(sale.invoice_date), 'dd MMM yyyy'),
        sale.party_name,
        sale.items_count,
        `₹${sale.total_amount.toLocaleString()}`,
      ]),
      summary: [
        { label: "Total Sales", value: `₹${totalSales.toLocaleString()}` },
        { label: "Total Invoices", value: salesData.length.toString() },
      ]
    });
    downloadPDF(doc, `sale-report-${new Date().toISOString().split('T')[0]}`);
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
          <h1 className="text-2xl font-bold">Sale Report</h1>
          <p className="text-muted-foreground">Analyze your sales performance</p>
        </div>
        <PrintButton onPrint={handlePrint} onExportPDF={handleExportPDF} />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Sales</p>
            <IndianRupee className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold mt-2">₹{totalSales.toLocaleString()}</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Profit</p>
            <TrendingUp className="w-4 h-4 text-success" />
          </div>
          <p className="text-2xl font-bold mt-2 text-success">₹{totalProfit.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Margin: {totalSales > 0 ? ((totalProfit / totalSales) * 100).toFixed(1) : 0}%
          </p>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Invoices</p>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold mt-2">{salesData.length}</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Avg Order Value</p>
            <IndianRupee className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold mt-2">₹{avgOrderValue.toLocaleString()}</p>
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
              <th>Invoice</th>
              <th>Date</th>
              <th>Party</th>
              <th className="text-center">Items</th>
              <th className="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {salesData.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-muted-foreground">
                  No sales found
                </td>
              </tr>
            ) : (
              salesData.map((sale) => (
                <tr key={sale.id}>
                  <td className="font-medium">{sale.invoice_number}</td>
                  <td className="text-muted-foreground">
                    {format(new Date(sale.invoice_date), 'dd MMM yyyy')}
                  </td>
                  <td>{sale.party_name}</td>
                  <td className="text-center">{sale.items_count}</td>
                  <td className="text-right font-medium">₹{sale.total_amount.toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
          {salesData.length > 0 && (
            <tfoot>
              <tr className="bg-muted/50 font-semibold">
                <td colSpan={4}>Total</td>
                <td className="text-right">₹{totalSales.toLocaleString()}</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
