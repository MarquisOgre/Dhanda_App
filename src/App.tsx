import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import PartiesList from "./pages/parties/PartiesList";
import AddParty from "./pages/parties/AddParty";
import ItemsList from "./pages/items/ItemsList";
import AddItem from "./pages/items/AddItem";
import Categories from "./pages/items/Categories";
import SaleInvoices from "./pages/sale/SaleInvoices";
import CreateSaleInvoice from "./pages/sale/CreateSaleInvoice";
import EstimationList from "./pages/sale/EstimationList";
import CreateEstimation from "./pages/sale/CreateEstimation";
import ProformaList from "./pages/sale/ProformaList";
import CreateProformaInvoice from "./pages/sale/CreateProformaInvoice";
import PaymentInList from "./pages/sale/PaymentInList";
import PaymentIn from "./pages/sale/PaymentIn";
import SaleOrderList from "./pages/sale/SaleOrderList";
import CreateSaleOrder from "./pages/sale/CreateSaleOrder";
import DeliveryChallanList from "./pages/sale/DeliveryChallanList";
import CreateDeliveryChallan from "./pages/sale/CreateDeliveryChallan";
import SaleReturnList from "./pages/sale/SaleReturnList";
import CreateSaleReturn from "./pages/sale/CreateSaleReturn";
import PurchaseBills from "./pages/purchase/PurchaseBills";
import CreatePurchaseBill from "./pages/purchase/CreatePurchaseBill";
import PaymentOutList from "./pages/purchase/PaymentOutList";
import PaymentOut from "./pages/purchase/PaymentOut";
import ExpensesList from "./pages/purchase/ExpensesList";
import CreateExpense from "./pages/purchase/CreateExpense";
import PurchaseOrderList from "./pages/purchase/PurchaseOrderList";
import CreatePurchaseOrder from "./pages/purchase/CreatePurchaseOrder";
import PurchaseReturnList from "./pages/purchase/PurchaseReturnList";
import CreatePurchaseReturn from "./pages/purchase/CreatePurchaseReturn";
import BankAccounts from "./pages/cash-bank/BankAccounts";
import CashInHand from "./pages/cash-bank/CashInHand";
// Reports
import SaleReport from "./pages/reports/SaleReport";
import PurchaseReport from "./pages/reports/PurchaseReport";
import ProfitLoss from "./pages/reports/ProfitLoss";
import BillWisePnL from "./pages/reports/BillWisePnL";
import BalanceSheet from "./pages/reports/BalanceSheet";
import StockSummary from "./pages/reports/StockSummary";
import ItemWisePnL from "./pages/reports/ItemWisePnL";
import StockDetail from "./pages/reports/StockDetail";
import ItemDetail from "./pages/reports/ItemDetail";
import TaxesReport from "./pages/reports/TaxesReport";
import ExpenseReport from "./pages/reports/ExpenseReport";
// Backup
import SyncShare from "./pages/backup/SyncShare";
import AutoBackup from "./pages/backup/AutoBackup";
import BackupToComputer from "./pages/backup/BackupToComputer";
import RestoreBackup from "./pages/backup/RestoreBackup";
// Utilities
import ImportItems from "./pages/utilities/ImportItems";
import BulkUpdate from "./pages/utilities/BulkUpdate";
import RecycleBin from "./pages/utilities/RecycleBin";
// Settings
import Settings from "./pages/settings/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
          {/* Parties */}
          <Route path="/parties" element={<AppLayout><PartiesList /></AppLayout>} />
          <Route path="/parties/add" element={<AppLayout><AddParty /></AppLayout>} />
          {/* Items */}
          <Route path="/items" element={<AppLayout><ItemsList /></AppLayout>} />
          <Route path="/items/add" element={<AppLayout><AddItem /></AppLayout>} />
          <Route path="/items/categories" element={<AppLayout><Categories /></AppLayout>} />
          {/* Sale */}
          <Route path="/sale/invoices" element={<AppLayout><SaleInvoices /></AppLayout>} />
          <Route path="/sale/invoices/new" element={<AppLayout><CreateSaleInvoice /></AppLayout>} />
          <Route path="/sale/estimation" element={<AppLayout><EstimationList /></AppLayout>} />
          <Route path="/sale/estimation/new" element={<AppLayout><CreateEstimation /></AppLayout>} />
          <Route path="/sale/proforma" element={<AppLayout><ProformaList /></AppLayout>} />
          <Route path="/sale/proforma/new" element={<AppLayout><CreateProformaInvoice /></AppLayout>} />
          <Route path="/sale/payment-in" element={<AppLayout><PaymentInList /></AppLayout>} />
          <Route path="/sale/payment-in/new" element={<AppLayout><PaymentIn /></AppLayout>} />
          <Route path="/sale/order" element={<AppLayout><SaleOrderList /></AppLayout>} />
          <Route path="/sale/order/new" element={<AppLayout><CreateSaleOrder /></AppLayout>} />
          <Route path="/sale/dc" element={<AppLayout><DeliveryChallanList /></AppLayout>} />
          <Route path="/sale/dc/new" element={<AppLayout><CreateDeliveryChallan /></AppLayout>} />
          <Route path="/sale/return" element={<AppLayout><SaleReturnList /></AppLayout>} />
          <Route path="/sale/return/new" element={<AppLayout><CreateSaleReturn /></AppLayout>} />
          {/* Purchase */}
          <Route path="/purchase/bills" element={<AppLayout><PurchaseBills /></AppLayout>} />
          <Route path="/purchase/bills/new" element={<AppLayout><CreatePurchaseBill /></AppLayout>} />
          <Route path="/purchase/payment-out" element={<AppLayout><PaymentOutList /></AppLayout>} />
          <Route path="/purchase/payment-out/new" element={<AppLayout><PaymentOut /></AppLayout>} />
          <Route path="/purchase/expenses" element={<AppLayout><ExpensesList /></AppLayout>} />
          <Route path="/purchase/expenses/new" element={<AppLayout><CreateExpense /></AppLayout>} />
          <Route path="/purchase/order" element={<AppLayout><PurchaseOrderList /></AppLayout>} />
          <Route path="/purchase/order/new" element={<AppLayout><CreatePurchaseOrder /></AppLayout>} />
          <Route path="/purchase/return" element={<AppLayout><PurchaseReturnList /></AppLayout>} />
          <Route path="/purchase/return/new" element={<AppLayout><CreatePurchaseReturn /></AppLayout>} />
          {/* Cash & Bank */}
          <Route path="/cash-bank/accounts" element={<AppLayout><BankAccounts /></AppLayout>} />
          <Route path="/cash-bank/cash" element={<AppLayout><CashInHand /></AppLayout>} />
          {/* Reports */}
          <Route path="/reports/sale" element={<AppLayout><SaleReport /></AppLayout>} />
          <Route path="/reports/purchase" element={<AppLayout><PurchaseReport /></AppLayout>} />
          <Route path="/reports/pnl" element={<AppLayout><ProfitLoss /></AppLayout>} />
          <Route path="/reports/bill-wise-pnl" element={<AppLayout><BillWisePnL /></AppLayout>} />
          <Route path="/reports/balance-sheet" element={<AppLayout><BalanceSheet /></AppLayout>} />
          <Route path="/reports/stock-summary" element={<AppLayout><StockSummary /></AppLayout>} />
          <Route path="/reports/item-wise-pnl" element={<AppLayout><ItemWisePnL /></AppLayout>} />
          <Route path="/reports/stock-detail" element={<AppLayout><StockDetail /></AppLayout>} />
          <Route path="/reports/item-detail" element={<AppLayout><ItemDetail /></AppLayout>} />
          <Route path="/reports/taxes" element={<AppLayout><TaxesReport /></AppLayout>} />
          <Route path="/reports/expense" element={<AppLayout><ExpenseReport /></AppLayout>} />
          {/* Backup */}
          <Route path="/backup/sync" element={<AppLayout><SyncShare /></AppLayout>} />
          <Route path="/backup/auto" element={<AppLayout><AutoBackup /></AppLayout>} />
          <Route path="/backup/download" element={<AppLayout><BackupToComputer /></AppLayout>} />
          <Route path="/backup/restore" element={<AppLayout><RestoreBackup /></AppLayout>} />
          {/* Utilities */}
          <Route path="/utilities/import" element={<AppLayout><ImportItems /></AppLayout>} />
          <Route path="/utilities/bulk-update" element={<AppLayout><BulkUpdate /></AppLayout>} />
          <Route path="/utilities/recycle-bin" element={<AppLayout><RecycleBin /></AppLayout>} />
          {/* Settings */}
          <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
