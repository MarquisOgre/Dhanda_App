import { useState, useEffect } from "react";
import { Download, Search, ArrowUpCircle, ArrowDownCircle, Package, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { DateRangeFilter, getDefaultDateRange, filterByDateRange, DateRange } from "@/components/DateRangeFilter";

interface StockMovement {
  id: string;
  date: string;
  item: string;
  type: string;
  qty: number;
  reference: string;
}

export default function StockDetail() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange());
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStockMovements();
  }, []);

  const fetchStockMovements = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const movements: StockMovement[] = [];

      const { data: saleInvoices } = await supabase
        .from('sale_invoices')
        .select('id, invoice_number, invoice_date, user_id')
        .eq('user_id', user.id)
        .eq('is_deleted', false)
        .order('invoice_date', { ascending: false });

      const saleInvoiceIds = saleInvoices?.map(inv => inv.id) || [];
      const saleInvoiceMap = new Map(saleInvoices?.map(inv => [inv.id, inv]) || []);

      if (saleInvoiceIds.length > 0) {
        const { data: saleItems } = await supabase
          .from('sale_invoice_items')
          .select('id, item_name, quantity, sale_invoice_id')
          .in('sale_invoice_id', saleInvoiceIds);

        (saleItems || []).forEach((item: any) => {
          const invoice = saleInvoiceMap.get(item.sale_invoice_id);
          if (invoice) {
            movements.push({
              id: item.id,
              date: invoice.invoice_date || '',
              item: item.item_name,
              type: 'sale',
              qty: item.quantity,
              reference: invoice.invoice_number || '',
            });
          }
        });
      }

      const { data: purchaseInvoices } = await supabase
        .from('purchase_invoices')
        .select('id, invoice_number, invoice_date, user_id')
        .eq('user_id', user.id)
        .eq('is_deleted', false)
        .order('invoice_date', { ascending: false });

      const purchaseInvoiceIds = purchaseInvoices?.map(inv => inv.id) || [];
      const purchaseInvoiceMap = new Map(purchaseInvoices?.map(inv => [inv.id, inv]) || []);

      if (purchaseInvoiceIds.length > 0) {
        const { data: purchaseItems } = await supabase
          .from('purchase_invoice_items')
          .select('id, item_name, quantity, purchase_invoice_id')
          .in('purchase_invoice_id', purchaseInvoiceIds);

        (purchaseItems || []).forEach((item: any) => {
          const invoice = purchaseInvoiceMap.get(item.purchase_invoice_id);
          if (invoice) {
            movements.push({
              id: item.id,
              date: invoice.invoice_date || '',
              item: item.item_name,
              type: 'purchase',
              qty: item.quantity,
              reference: invoice.invoice_number || '',
            });
          }
        });
      }

      movements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setStockMovements(movements);
    } catch (error) {
      console.error('Error fetching stock movements:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredByDate = filterByDateRange(stockMovements, dateRange, "date");

  const filtered = filteredByDate.filter((m) => {
    const matchesSearch = m.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || m.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalIn = filtered.filter((m) => m.type === "purchase").reduce((sum, m) => sum + m.qty, 0);
  const totalOut = filtered.filter((m) => m.type === "sale").reduce((sum, m) => sum + m.qty, 0);

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
          <h1 className="text-2xl font-bold">Stock Detail</h1>
          <p className="text-muted-foreground">Track stock movements in detail</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Stock In</p>
            <ArrowUpCircle className="w-4 h-4 text-success" />
          </div>
          <p className="text-2xl font-bold mt-2 text-success">{totalIn} units</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Stock Out</p>
            <ArrowDownCircle className="w-4 h-4 text-destructive" />
          </div>
          <p className="text-2xl font-bold mt-2 text-destructive">{totalOut} units</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Net Movement</p>
            <Package className="w-4 h-4 text-primary" />
          </div>
          <p className={cn("text-2xl font-bold mt-2", totalIn - totalOut >= 0 ? "text-success" : "text-destructive")}>
            {totalIn - totalOut >= 0 ? "+" : ""}{totalIn - totalOut} units
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search items or reference..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="purchase">Stock In</SelectItem>
            <SelectItem value="sale">Stock Out</SelectItem>
          </SelectContent>
        </Select>
        <DateRangeFilter dateRange={dateRange} onDateRangeChange={setDateRange} />
      </div>

      <div className="metric-card overflow-hidden p-0">
        <table className="data-table">
          <thead>
            <tr><th>Date</th><th>Item</th><th>Type</th><th>Reference</th><th className="text-center">Quantity</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">No stock movements found</td></tr>
            ) : (
              filtered.map((movement) => (
                <tr key={movement.id}>
                  <td className="text-muted-foreground">{movement.date ? format(new Date(movement.date), 'dd MMM yyyy') : '-'}</td>
                  <td className="font-medium">{movement.item}</td>
                  <td>
                    <span className={cn("inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full", movement.type === "purchase" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive")}>
                      {movement.type === "purchase" ? <ArrowUpCircle className="w-3 h-3" /> : <ArrowDownCircle className="w-3 h-3" />}
                      {movement.type === "purchase" ? "Stock In" : "Stock Out"}
                    </span>
                  </td>
                  <td className="font-medium">{movement.reference}</td>
                  <td className={cn("text-center font-medium", movement.type === "purchase" ? "text-success" : "text-destructive")}>
                    {movement.type === "purchase" ? "+" : "-"}{movement.qty}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}