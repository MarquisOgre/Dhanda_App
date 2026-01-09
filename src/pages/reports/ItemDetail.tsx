import { useState, useEffect } from "react";
import { Download, Search, Package, TrendingUp, IndianRupee, BarChart3, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { DateRangeFilter, getDefaultDateRange, DateRange } from "@/components/DateRangeFilter";

interface ItemData { id: string; name: string; hsn: string; category: string; stock: number; purchaseRate: number; saleRate: number; updatedAt: string; }

export default function ItemDetail() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange());
  const [itemsData, setItemsData] = useState<ItemData[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchItemsData(); }, []);

  const fetchItemsData = async () => {
    try {
      const { data: items } = await supabase.from('items').select(`id, name, hsn_code, current_stock, purchase_price, sale_price, updated_at, category_id, categories (name)`).eq('is_deleted', false).order('name');
      const formattedData = (items || []).map(item => ({ id: item.id, name: item.name, hsn: item.hsn_code || '-', category: (item.categories as any)?.name || 'Uncategorized', stock: item.current_stock || 0, purchaseRate: item.purchase_price || 0, saleRate: item.sale_price || 0, updatedAt: item.updated_at }));
      setItemsData(formattedData);
      const uniqueCategories = [...new Set(formattedData.map(i => i.category))];
      setCategories(uniqueCategories);
    } catch (error) { console.error('Error fetching items:', error); } finally { setLoading(false); }
  };

  const filtered = itemsData.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.hsn.includes(searchQuery);
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalItems = itemsData.length;
  const totalStockValue = itemsData.reduce((sum, i) => sum + (i.stock * i.purchaseRate), 0);
  const avgMargin = itemsData.length > 0 ? itemsData.reduce((sum, i) => { const margin = i.purchaseRate > 0 ? ((i.saleRate - i.purchaseRate) / i.purchaseRate * 100) : 0; return sum + margin; }, 0) / totalItems : 0;

  if (loading) { return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>; }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Item Detail Report</h1><p className="text-muted-foreground">Comprehensive item information</p></div>
        <Button variant="outline" className="gap-2"><Download className="w-4 h-4" />Export Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="metric-card"><div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">Total Items</p><Package className="w-4 h-4 text-primary" /></div><p className="text-2xl font-bold mt-2">{totalItems}</p></div>
        <div className="metric-card"><div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">Stock Value</p><IndianRupee className="w-4 h-4 text-success" /></div><p className="text-2xl font-bold mt-2">₹{totalStockValue.toLocaleString()}</p></div>
        <div className="metric-card"><div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">Avg Margin</p><TrendingUp className="w-4 h-4 text-success" /></div><p className="text-2xl font-bold mt-2 text-success">{avgMargin.toFixed(1)}%</p></div>
        <div className="metric-card"><div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">Categories</p><BarChart3 className="w-4 h-4 text-muted-foreground" /></div><p className="text-2xl font-bold mt-2">{categories.length}</p></div>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search by name or HSN..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" /></div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}><SelectTrigger className="w-[180px]"><SelectValue placeholder="Category" /></SelectTrigger><SelectContent><SelectItem value="all">All Categories</SelectItem>{categories.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent></Select>
        <DateRangeFilter dateRange={dateRange} onDateRangeChange={setDateRange} />
      </div>

      <div className="metric-card overflow-hidden p-0">
        <table className="data-table"><thead><tr><th>Item Name</th><th>HSN</th><th>Category</th><th className="text-center">Stock</th><th className="text-right">Purchase Rate</th><th className="text-right">Sale Rate</th><th className="text-right">Margin</th><th>Last Updated</th></tr></thead>
          <tbody>{filtered.length === 0 ? <tr><td colSpan={8} className="text-center py-8 text-muted-foreground">No items found</td></tr> : filtered.map((item) => { const margin = item.purchaseRate > 0 ? ((item.saleRate - item.purchaseRate) / item.purchaseRate * 100).toFixed(1) : '0.0'; return (<tr key={item.id}><td className="font-medium">{item.name}</td><td className="text-muted-foreground">{item.hsn}</td><td>{item.category}</td><td className="text-center">{item.stock}</td><td className="text-right">₹{item.purchaseRate.toLocaleString()}</td><td className="text-right">₹{item.saleRate.toLocaleString()}</td><td className="text-right text-success">{margin}%</td><td className="text-muted-foreground text-sm">{format(new Date(item.updatedAt), 'dd MMM yyyy')}</td></tr>); })}</tbody>
        </table>
      </div>
    </div>
  );
}