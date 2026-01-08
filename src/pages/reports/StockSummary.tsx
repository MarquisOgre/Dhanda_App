import { useState, useEffect } from "react";
import { Download, Search, Package, AlertTriangle, TrendingUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { DateRangeFilter, getDefaultDateRange, DateRange } from "@/components/DateRangeFilter";

interface StockItem { id: string; name: string; category: string; stock: number; minStock: number; value: number; status: string; }

export default function StockSummary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange());
  const [stockData, setStockData] = useState<StockItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStockData(); }, []);

  const fetchStockData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: items } = await supabase.from('items').select(`id, name, current_stock, low_stock_alert, purchase_price, category_id, categories (name)`).eq('user_id', user.id).eq('is_deleted', false);
      const formattedData = (items || []).map(item => {
        const stock = item.current_stock || 0; const minStock = item.low_stock_alert || 10;
        let status = 'in-stock'; if (stock === 0) status = 'out'; else if (stock < minStock) status = 'low';
        return { id: item.id, name: item.name, category: (item.categories as any)?.name || 'Uncategorized', stock, minStock, value: stock * (item.purchase_price || 0), status };
      });
      setStockData(formattedData);
      const uniqueCategories = [...new Set(formattedData.map(i => i.category))];
      setCategories(uniqueCategories);
    } catch (error) { console.error('Error fetching stock:', error); } finally { setLoading(false); }
  };

  const filtered = stockData.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalItems = stockData.length;
  const totalValue = stockData.reduce((sum, s) => sum + s.value, 0);
  const lowStockItems = stockData.filter((s) => s.status === "low").length;
  const outOfStock = stockData.filter((s) => s.status === "out").length;

  const getStatusBadge = (status: string) => { switch (status) { case "in-stock": return "bg-success/10 text-success"; case "low": return "bg-warning/10 text-warning"; case "out": return "bg-destructive/10 text-destructive"; default: return ""; } };

  if (loading) { return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>; }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Stock Summary</h1><p className="text-muted-foreground">Overview of current inventory</p></div>
        <Button variant="outline" className="gap-2"><Download className="w-4 h-4" />Export Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="metric-card"><div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">Total Items</p><Package className="w-4 h-4 text-primary" /></div><p className="text-2xl font-bold mt-2">{totalItems}</p></div>
        <div className="metric-card"><div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">Stock Value</p><TrendingUp className="w-4 h-4 text-success" /></div><p className="text-2xl font-bold mt-2">₹{totalValue.toLocaleString()}</p></div>
        <div className="metric-card"><div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">Low Stock Items</p><AlertTriangle className="w-4 h-4 text-warning" /></div><p className="text-2xl font-bold mt-2 text-warning">{lowStockItems}</p></div>
        <div className="metric-card"><div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">Out of Stock</p><AlertTriangle className="w-4 h-4 text-destructive" /></div><p className="text-2xl font-bold mt-2 text-destructive">{outOfStock}</p></div>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search items..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" /></div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}><SelectTrigger className="w-[180px]"><SelectValue placeholder="Category" /></SelectTrigger><SelectContent><SelectItem value="all">All Categories</SelectItem>{categories.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent></Select>
        <DateRangeFilter dateRange={dateRange} onDateRangeChange={setDateRange} />
      </div>

      <div className="metric-card overflow-hidden p-0">
        <table className="data-table"><thead><tr><th>Item Name</th><th>Category</th><th className="text-center">Current Stock</th><th className="text-center">Min Stock</th><th className="text-right">Stock Value</th><th>Status</th></tr></thead>
          <tbody>{filtered.length === 0 ? <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No items found</td></tr> : filtered.map((item) => (<tr key={item.id}><td className="font-medium">{item.name}</td><td className="text-muted-foreground">{item.category}</td><td className="text-center">{item.stock}</td><td className="text-center text-muted-foreground">{item.minStock}</td><td className="text-right font-medium">₹{item.value.toLocaleString()}</td><td><span className={cn("px-2 py-1 text-xs font-medium rounded-full capitalize", getStatusBadge(item.status))}>{item.status === "in-stock" ? "In Stock" : item.status === "low" ? "Low Stock" : "Out of Stock"}</span></td></tr>))}</tbody>
          {filtered.length > 0 && <tfoot><tr className="bg-muted/50 font-semibold"><td colSpan={4}>Total</td><td className="text-right">₹{filtered.reduce((sum, s) => sum + s.value, 0).toLocaleString()}</td><td></td></tr></tfoot>}
        </table>
      </div>
    </div>
  );
}