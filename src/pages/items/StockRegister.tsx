import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Printer, Download, ClipboardList, Search, Filter } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface StockItem {
  id: string;
  name: string;
  unit: string;
  openingQty: number;
  openingAvgPrice: number;
  openingAmt: number;
  purchaseQty: number;
  purchaseAvgPrice: number;
  purchaseAmt: number;
  closingQty: number;
  closingPrice: number;
  saleQty: number;
  saleAvgPrice: number;
  saleAmt: number;
}

const MONTHS = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const StockRegister = () => {
  const { user } = useAuth();
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(String(currentDate.getMonth() + 1));
  const [selectedYear, setSelectedYear] = useState(String(currentDate.getFullYear()));
  const [loading, setLoading] = useState(true);
  const [stockData, setStockData] = useState<StockItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "in-stock" | "out-of-stock" | "low-stock">("all");

  // Generate year options (last 5 years)
  const yearOptions = useMemo(() => {
    const years = [];
    for (let i = 0; i < 5; i++) {
      years.push(String(currentDate.getFullYear() - i));
    }
    return years;
  }, []);

  const fetchStockData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const month = parseInt(selectedMonth);
      const year = parseInt(selectedYear);
      
      // Calculate date ranges
      const periodStart = new Date(year, month - 1, 1);
      const periodEnd = new Date(year, month, 0);
      const beforePeriodStart = new Date(year, month - 1, 1);
      
      // Fetch all items
      const { data: items, error: itemsError } = await supabase
        .from("items")
        .select("id, name, unit, opening_stock, purchase_price, sale_price")
        .eq("user_id", user.id)
        .eq("is_deleted", false);

      if (itemsError) throw itemsError;

      // Fetch purchase invoices for the period (no filter by invoice_type since all are valid)
      const { data: purchaseInvoices, error: purchaseError } = await supabase
        .from("purchase_invoices")
        .select("id, invoice_date")
        .eq("is_deleted", false)
        .gte("invoice_date", format(periodStart, "yyyy-MM-dd"))
        .lte("invoice_date", format(periodEnd, "yyyy-MM-dd"));

      if (purchaseError) throw purchaseError;

      // Fetch sale invoices for the period
      const { data: saleInvoices, error: saleError } = await supabase
        .from("sale_invoices")
        .select("id, invoice_date")
        .eq("is_deleted", false)
        .gte("invoice_date", format(periodStart, "yyyy-MM-dd"))
        .lte("invoice_date", format(periodEnd, "yyyy-MM-dd"));

      if (saleError) throw saleError;

      // Fetch invoices before the period for opening stock calculation
      const { data: beforePurchaseInvoices, error: beforePurchaseError } = await supabase
        .from("purchase_invoices")
        .select("id")
        .eq("is_deleted", false)
        .lt("invoice_date", format(beforePeriodStart, "yyyy-MM-dd"));

      if (beforePurchaseError) throw beforePurchaseError;

      const { data: beforeSaleInvoices, error: beforeSaleError } = await supabase
        .from("sale_invoices")
        .select("id")
        .eq("is_deleted", false)
        .lt("invoice_date", format(beforePeriodStart, "yyyy-MM-dd"));

      if (beforeSaleError) throw beforeSaleError;

      // Fetch all invoice items
      const allInvoiceIds = [
        ...(purchaseInvoices?.map(i => i.id) || []),
        ...(saleInvoices?.map(i => i.id) || []),
        ...(beforePurchaseInvoices?.map(i => i.id) || []),
        ...(beforeSaleInvoices?.map(i => i.id) || []),
      ];

      let invoiceItems: any[] = [];
      
      // Fetch items from purchase invoices
      const purchaseIds = [...(purchaseInvoices?.map(i => i.id) || []), ...(beforePurchaseInvoices?.map(i => i.id) || [])];
      
      if (purchaseIds.length > 0) {
        const { data: purchaseItemsData } = await supabase
          .from("purchase_invoice_items")
          .select("purchase_invoice_id, item_id, quantity, rate, total")
          .in("purchase_invoice_id", purchaseIds);
        
        invoiceItems.push(...(purchaseItemsData || []).map((item: any) => ({
          ...item,
          invoice_id: item.purchase_invoice_id,
        })));
      }
      
      // Fetch items from sale invoices
      const saleIds = [...(saleInvoices?.map(i => i.id) || []), ...(beforeSaleInvoices?.map(i => i.id) || [])];
      
      if (saleIds.length > 0) {
        const { data: saleItemsData } = await supabase
          .from("sale_invoice_items")
          .select("sale_invoice_id, item_id, quantity, rate, total")
          .in("sale_invoice_id", saleIds);
        
        invoiceItems.push(...(saleItemsData || []).map((item: any) => ({
          ...item,
          invoice_id: item.sale_invoice_id,
        })));
      }

      // Create lookup maps
      const purchaseInvoiceIds = new Set(purchaseInvoices?.map(i => i.id) || []);
      const saleInvoiceIds = new Set(saleInvoices?.map(i => i.id) || []);
      const beforePurchaseIds = new Set(beforePurchaseInvoices?.map(i => i.id) || []);
      const beforeSaleIds = new Set(beforeSaleInvoices?.map(i => i.id) || []);

      // Calculate stock data for each item
      const stockItems: StockItem[] = (items || []).map((item, index) => {
        // Calculate quantities before period
        let beforePurchaseQty = 0;
        let beforePurchaseAmt = 0;
        let beforeSaleQty = 0;

        // Calculate quantities in period
        let purchaseQty = 0;
        let purchaseAmt = 0;
        let saleQty = 0;
        let saleAmt = 0;

        invoiceItems.forEach(invItem => {
          if (invItem.item_id === item.id) {
            if (beforePurchaseIds.has(invItem.invoice_id)) {
              beforePurchaseQty += Number(invItem.quantity) || 0;
              beforePurchaseAmt += Number(invItem.total) || 0;
            } else if (beforeSaleIds.has(invItem.invoice_id)) {
              beforeSaleQty += Number(invItem.quantity) || 0;
            } else if (purchaseInvoiceIds.has(invItem.invoice_id)) {
              purchaseQty += Number(invItem.quantity) || 0;
              purchaseAmt += Number(invItem.total) || 0;
            } else if (saleInvoiceIds.has(invItem.invoice_id)) {
              saleQty += Number(invItem.quantity) || 0;
              saleAmt += Number(invItem.total) || 0;
            }
          }
        });

        // Opening = initial stock + purchases before period - sales before period
        const openingQty = (Number(item.opening_stock) || 0) + beforePurchaseQty - beforeSaleQty;
        const openingAvgPrice = openingQty > 0 ? (Number(item.purchase_price) || 0) : 0;
        const openingAmt = openingQty * openingAvgPrice;

        // Purchase average price
        const purchaseAvgPrice = purchaseQty > 0 ? purchaseAmt / purchaseQty : 0;

        // Closing = Opening + Purchase - Sale
        const closingQty = openingQty + purchaseQty - saleQty;
        const closingPrice = closingQty > 0 ? (purchaseQty > 0 ? purchaseAvgPrice : openingAvgPrice) : 0;

        // Sale average price
        const saleAvgPrice = saleQty > 0 ? saleAmt / saleQty : 0;

        return {
          id: item.id,
          name: item.name,
          unit: item.unit || "PCS",
          openingQty,
          openingAvgPrice,
          openingAmt,
          purchaseQty,
          purchaseAvgPrice,
          purchaseAmt,
          closingQty,
          closingPrice,
          saleQty,
          saleAvgPrice,
          saleAmt,
        };
      });

      setStockData(stockItems);
    } catch (error) {
      console.error("Error fetching stock data:", error);
      toast.error("Failed to fetch stock data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, [user, selectedMonth, selectedYear]);

  const formatNumber = (num: number, decimals = 2) => {
    return num.toFixed(decimals);
  };

  const handlePrint = () => {
    const printContent = document.getElementById("stock-register-table");
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const monthName = MONTHS.find(m => m.value === selectedMonth)?.label;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Stock Register - ${monthName} ${selectedYear}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; margin-bottom: 5px; }
            h3 { text-align: center; color: #666; margin-top: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 10px; }
            th, td { border: 1px solid #ddd; padding: 6px; text-align: right; }
            th { background-color: #f5f5f5; font-weight: bold; }
            td:nth-child(1), td:nth-child(2), td:nth-child(3) { text-align: left; }
            th:nth-child(1), th:nth-child(2), th:nth-child(3) { text-align: left; }
            .text-right { text-align: right; }
            @media print { body { -webkit-print-color-adjust: exact; } }
          </style>
        </head>
        <body>
          <h1>Stock Register</h1>
          <h3>${monthName} ${selectedYear}</h3>
          ${printContent.outerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleExport = () => {
    const monthName = MONTHS.find(m => m.value === selectedMonth)?.label;
    const headers = [
      "Sl.No", "Item Details", "UOM",
      "Op.Qty", "Avg.Price", "Op.Amt",
      "Purc.Qty", "Avg.Price", "Amt.In",
      "Cl.Qty", "Price",
      "Sale.Qty", "Avg.Price", "Amt.Out"
    ];

    const rows = stockData.map((item, index) => [
      index + 1,
      item.name,
      item.unit,
      formatNumber(item.openingQty),
      formatNumber(item.openingAvgPrice),
      formatNumber(item.openingAmt),
      formatNumber(item.purchaseQty),
      formatNumber(item.purchaseAvgPrice),
      formatNumber(item.purchaseAmt),
      formatNumber(item.closingQty),
      formatNumber(item.closingPrice),
      formatNumber(item.saleQty),
      formatNumber(item.saleAvgPrice),
      formatNumber(item.saleAmt),
    ]);

    const csvContent = [
      `Stock Register - ${monthName} ${selectedYear}`,
      "",
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `stock_register_${monthName}_${selectedYear}.csv`;
    link.click();
    toast.success("Stock register exported successfully");
  };

  // Filter stock data based on search and filter type
  const filteredStockData = useMemo(() => {
    return stockData.filter((item) => {
      // Search filter
      const matchesSearch = searchQuery === "" || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.unit.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Stock filter
      let matchesFilter = true;
      if (filterType === "in-stock") {
        matchesFilter = item.closingQty > 0;
      } else if (filterType === "out-of-stock") {
        matchesFilter = item.closingQty <= 0;
      } else if (filterType === "low-stock") {
        matchesFilter = item.closingQty > 0 && item.closingQty <= 10;
      }
      
      return matchesSearch && matchesFilter;
    });
  }, [stockData, searchQuery, filterType]);

  // Calculate totals from filtered data
  const totals = useMemo(() => {
    return filteredStockData.reduce(
      (acc, item) => ({
        openingQty: acc.openingQty + item.openingQty,
        openingAmt: acc.openingAmt + item.openingAmt,
        purchaseQty: acc.purchaseQty + item.purchaseQty,
        purchaseAmt: acc.purchaseAmt + item.purchaseAmt,
        closingQty: acc.closingQty + item.closingQty,
        saleQty: acc.saleQty + item.saleQty,
        saleAmt: acc.saleAmt + item.saleAmt,
      }),
      { openingQty: 0, openingAmt: 0, purchaseQty: 0, purchaseAmt: 0, closingQty: 0, saleQty: 0, saleAmt: 0 }
    );
  }, [filteredStockData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ClipboardList className="h-8 w-8" />
            Stock Register
          </h1>
          <p className="text-muted-foreground mt-1">Monthly stock movement register</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-lg">
                Stock Movement - {MONTHS.find(m => m.value === selectedMonth)?.label} {selectedYear}
              </CardTitle>
              <CardDescription>
                Opening Qty + Purchase Qty - Sale Qty = Closing Qty
              </CardDescription>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-[200px]"
                />
              </div>
              <Select value={filterType} onValueChange={(value: "all" | "in-stock" | "out-of-stock" | "low-stock") => setFilterType(value)}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                  <SelectItem value="low-stock">Low Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table id="stock-register-table">
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-12 text-center">Sl.No</TableHead>
                  <TableHead className="min-w-[150px]">Item Details</TableHead>
                  <TableHead className="w-16 text-center">UOM</TableHead>
                  <TableHead colSpan={3} className="text-center bg-blue-50 dark:bg-blue-950">Opening</TableHead>
                  <TableHead colSpan={3} className="text-center bg-green-50 dark:bg-green-950">Purchase</TableHead>
                  <TableHead colSpan={2} className="text-center bg-yellow-50 dark:bg-yellow-950">Closing</TableHead>
                  <TableHead colSpan={3} className="text-center bg-red-50 dark:bg-red-950">Sale</TableHead>
                </TableRow>
                <TableRow className="bg-muted/30">
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                  <TableHead className="text-right bg-blue-50 dark:bg-blue-950">Qty</TableHead>
                  <TableHead className="text-right bg-blue-50 dark:bg-blue-950">Avg.Price</TableHead>
                  <TableHead className="text-right bg-blue-50 dark:bg-blue-950">Amount</TableHead>
                  <TableHead className="text-right bg-green-50 dark:bg-green-950">Qty</TableHead>
                  <TableHead className="text-right bg-green-50 dark:bg-green-950">Avg.Price</TableHead>
                  <TableHead className="text-right bg-green-50 dark:bg-green-950">Amt.In</TableHead>
                  <TableHead className="text-right bg-yellow-50 dark:bg-yellow-950">Qty</TableHead>
                  <TableHead className="text-right bg-yellow-50 dark:bg-yellow-950">Price</TableHead>
                  <TableHead className="text-right bg-red-50 dark:bg-red-950">Qty</TableHead>
                  <TableHead className="text-right bg-red-50 dark:bg-red-950">Avg.Price</TableHead>
                  <TableHead className="text-right bg-red-50 dark:bg-red-950">Amt.Out</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStockData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={14} className="text-center py-8 text-muted-foreground">
                      {stockData.length === 0 ? "No items found" : "No items match your search/filter criteria"}
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {filteredStockData.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-center">{index + 1}</TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-center">{item.unit}</TableCell>
                        <TableCell className="text-right">{formatNumber(item.openingQty)}</TableCell>
                        <TableCell className="text-right">{formatNumber(item.openingAvgPrice)}</TableCell>
                        <TableCell className="text-right">{formatNumber(item.openingAmt)}</TableCell>
                        <TableCell className="text-right">{formatNumber(item.purchaseQty)}</TableCell>
                        <TableCell className="text-right">{formatNumber(item.purchaseAvgPrice)}</TableCell>
                        <TableCell className="text-right">{formatNumber(item.purchaseAmt)}</TableCell>
                        <TableCell className="text-right">{formatNumber(item.closingQty)}</TableCell>
                        <TableCell className="text-right">{formatNumber(item.closingPrice)}</TableCell>
                        <TableCell className="text-right">{formatNumber(item.saleQty)}</TableCell>
                        <TableCell className="text-right">{formatNumber(item.saleAvgPrice)}</TableCell>
                        <TableCell className="text-right">{formatNumber(item.saleAmt)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50 font-semibold">
                      <TableCell colSpan={3} className="text-right">Total:</TableCell>
                      <TableCell className="text-right">{formatNumber(totals.openingQty)}</TableCell>
                      <TableCell className="text-right">-</TableCell>
                      <TableCell className="text-right">{formatNumber(totals.openingAmt)}</TableCell>
                      <TableCell className="text-right">{formatNumber(totals.purchaseQty)}</TableCell>
                      <TableCell className="text-right">-</TableCell>
                      <TableCell className="text-right">{formatNumber(totals.purchaseAmt)}</TableCell>
                      <TableCell className="text-right">{formatNumber(totals.closingQty)}</TableCell>
                      <TableCell className="text-right">-</TableCell>
                      <TableCell className="text-right">{formatNumber(totals.saleQty)}</TableCell>
                      <TableCell className="text-right">-</TableCell>
                      <TableCell className="text-right">{formatNumber(totals.saleAmt)}</TableCell>
                    </TableRow>
                  </>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockRegister;
