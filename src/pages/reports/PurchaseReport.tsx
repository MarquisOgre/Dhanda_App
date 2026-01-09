import { useState, useEffect } from "react";
import { TrendingDown, IndianRupee, Package, Loader2 } from "lucide-react";
import { PrintButton } from "@/components/PrintButton";
import { generateReportPDF, downloadPDF } from "@/lib/pdf";
import { printTable } from "@/lib/print";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { DateRangeFilter, getDefaultDateRange, filterByDateRange, DateRange } from "@/components/DateRangeFilter";

interface PurchaseData {
  id: string;
  invoice_number: string;
  invoice_date: string;
  party_name: string;
  items_count: number;
  total_amount: number;
  paid_amount: number;
}

export default function PurchaseReport() {
  const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange());
  const [purchaseData, setPurchaseData] = useState<PurchaseData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchaseData();
  }, []);

  const fetchPurchaseData = async () => {
    try {
      const { data: invoices, error } = await supabase
        .from('purchase_invoices')
        .select(`
          id,
          invoice_number,
          invoice_date,
          total_amount,
          paid_amount,
          party_id,
          parties (name)
        `)
        .eq('is_deleted', false)
        .order('invoice_date', { ascending: false });

      if (error) throw error;

      const purchasesWithItems = await Promise.all(
        (invoices || []).map(async (inv: any) => {
          const { count } = await supabase
            .from('purchase_invoice_items')
            .select('*', { count: 'exact', head: true })
            .eq('purchase_invoice_id', inv.id);

          return {
            id: inv.id,
            invoice_number: inv.invoice_number,
            invoice_date: inv.invoice_date,
            party_name: inv.parties?.name || 'Unknown Supplier',
            items_count: count || 0,
            total_amount: inv.total_amount || 0,
            paid_amount: inv.paid_amount || 0,
          };
        })
      );

      setPurchaseData(purchasesWithItems);
    } catch (error) {
      console.error('Error fetching purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = filterByDateRange(purchaseData, dateRange, "invoice_date");

  const totalPurchase = filteredData.reduce((sum, p) => sum + p.total_amount, 0);
  const totalPaid = filteredData.reduce((sum, p) => sum + p.paid_amount, 0);
  const totalPending = totalPurchase - totalPaid;

  const dateRangeLabel = `${format(dateRange.from, 'dd MMM yyyy')} - ${format(dateRange.to, 'dd MMM yyyy')}`;

  const handlePrint = () => {
    printTable({
      title: "Purchase Report",
      subtitle: dateRangeLabel,
      columns: ["Bill No.", "Date", "Supplier", "Items", "Amount", "Paid", "Balance"],
      rows: filteredData.map(p => [
        p.invoice_number,
        format(new Date(p.invoice_date), 'dd MMM yyyy'),
        p.party_name,
        p.items_count,
        `₹${p.total_amount.toLocaleString()}`,
        `₹${p.paid_amount.toLocaleString()}`,
        `₹${(p.total_amount - p.paid_amount).toLocaleString()}`
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
      dateRange: dateRangeLabel,
      columns: ["Bill No.", "Date", "Supplier", "Items", "Amount", "Paid", "Balance"],
      rows: filteredData.map(p => [
        p.invoice_number,
        format(new Date(p.invoice_date), 'dd MMM yyyy'),
        p.party_name,
        p.items_count,
        `₹${p.total_amount.toLocaleString()}`,
        `₹${p.paid_amount.toLocaleString()}`,
        `₹${(p.total_amount - p.paid_amount).toLocaleString()}`
      ]),
      summary: [
        { label: "Total Purchase", value: `₹${totalPurchase.toLocaleString()}` },
        { label: "Total Paid", value: `₹${totalPaid.toLocaleString()}` },
        { label: "Pending Payment", value: `₹${totalPending.toLocaleString()}` },
      ]
    });
    downloadPDF(doc, `purchase-report-${new Date().toISOString().split('T')[0]}`);
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
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Amount Paid</p>
            <TrendingDown className="w-4 h-4 text-success" />
          </div>
          <p className="text-2xl font-bold mt-2 text-success">₹{totalPaid.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {totalPurchase > 0 ? ((totalPaid / totalPurchase) * 100).toFixed(1) : 0}% of total
          </p>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Pending Payment</p>
            <IndianRupee className="w-4 h-4 text-warning" />
          </div>
          <p className="text-2xl font-bold mt-2 text-warning">₹{totalPending.toLocaleString()}</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Bills</p>
            <Package className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold mt-2">{filteredData.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <DateRangeFilter dateRange={dateRange} onDateRangeChange={setDateRange} />
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
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-muted-foreground">
                  No purchases found
                </td>
              </tr>
            ) : (
              filteredData.map((purchase) => (
                <tr key={purchase.id}>
                  <td className="font-medium">{purchase.invoice_number}</td>
                  <td className="text-muted-foreground">
                    {format(new Date(purchase.invoice_date), 'dd MMM yyyy')}
                  </td>
                  <td>{purchase.party_name}</td>
                  <td className="text-center">{purchase.items_count}</td>
                  <td className="text-right font-medium">₹{purchase.total_amount.toLocaleString()}</td>
                  <td className="text-right text-success">₹{purchase.paid_amount.toLocaleString()}</td>
                  <td className="text-right text-warning">
                    ₹{(purchase.total_amount - purchase.paid_amount).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {filteredData.length > 0 && (
            <tfoot>
              <tr className="bg-muted/50 font-semibold">
                <td colSpan={4}>Total</td>
                <td className="text-right">₹{totalPurchase.toLocaleString()}</td>
                <td className="text-right text-success">₹{totalPaid.toLocaleString()}</td>
                <td className="text-right text-warning">₹{totalPending.toLocaleString()}</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}