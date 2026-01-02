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
import PurchaseBills from "./pages/purchase/PurchaseBills";
import BankAccounts from "./pages/cash-bank/BankAccounts";
import ReportsOverview from "./pages/reports/ReportsOverview";
import SyncShare from "./pages/backup/SyncShare";
import UtilitiesOverview from "./pages/utilities/UtilitiesOverview";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <AppLayout>
                <Dashboard />
              </AppLayout>
            }
          />
          {/* Parties */}
          <Route
            path="/parties"
            element={
              <AppLayout>
                <PartiesList />
              </AppLayout>
            }
          />
          <Route
            path="/parties/add"
            element={
              <AppLayout>
                <AddParty />
              </AppLayout>
            }
          />
          {/* Items */}
          <Route
            path="/items"
            element={
              <AppLayout>
                <ItemsList />
              </AppLayout>
            }
          />
          <Route
            path="/items/add"
            element={
              <AppLayout>
                <AddItem />
              </AppLayout>
            }
          />
          <Route
            path="/items/categories"
            element={
              <AppLayout>
                <Categories />
              </AppLayout>
            }
          />
          {/* Sale */}
          <Route
            path="/sale/invoices"
            element={
              <AppLayout>
                <SaleInvoices />
              </AppLayout>
            }
          />
          <Route
            path="/sale/estimation"
            element={
              <AppLayout>
                <SaleInvoices />
              </AppLayout>
            }
          />
          <Route
            path="/sale/proforma"
            element={
              <AppLayout>
                <SaleInvoices />
              </AppLayout>
            }
          />
          <Route
            path="/sale/payment-in"
            element={
              <AppLayout>
                <SaleInvoices />
              </AppLayout>
            }
          />
          <Route
            path="/sale/order"
            element={
              <AppLayout>
                <SaleInvoices />
              </AppLayout>
            }
          />
          <Route
            path="/sale/dc"
            element={
              <AppLayout>
                <SaleInvoices />
              </AppLayout>
            }
          />
          <Route
            path="/sale/return"
            element={
              <AppLayout>
                <SaleInvoices />
              </AppLayout>
            }
          />
          {/* Purchase */}
          <Route
            path="/purchase/bills"
            element={
              <AppLayout>
                <PurchaseBills />
              </AppLayout>
            }
          />
          <Route
            path="/purchase/payment-out"
            element={
              <AppLayout>
                <PurchaseBills />
              </AppLayout>
            }
          />
          <Route
            path="/purchase/expenses"
            element={
              <AppLayout>
                <PurchaseBills />
              </AppLayout>
            }
          />
          <Route
            path="/purchase/order"
            element={
              <AppLayout>
                <PurchaseBills />
              </AppLayout>
            }
          />
          <Route
            path="/purchase/return"
            element={
              <AppLayout>
                <PurchaseBills />
              </AppLayout>
            }
          />
          {/* Cash & Bank */}
          <Route
            path="/cash-bank/accounts"
            element={
              <AppLayout>
                <BankAccounts />
              </AppLayout>
            }
          />
          <Route
            path="/cash-bank/cash"
            element={
              <AppLayout>
                <BankAccounts />
              </AppLayout>
            }
          />
          {/* Reports */}
          <Route
            path="/reports/*"
            element={
              <AppLayout>
                <ReportsOverview />
              </AppLayout>
            }
          />
          {/* Backup */}
          <Route
            path="/backup/*"
            element={
              <AppLayout>
                <SyncShare />
              </AppLayout>
            }
          />
          {/* Utilities */}
          <Route
            path="/utilities/*"
            element={
              <AppLayout>
                <UtilitiesOverview />
              </AppLayout>
            }
          />
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
