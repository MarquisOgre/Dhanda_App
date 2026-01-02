import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  FileText,
  Wallet,
  BarChart3,
  Cloud,
  Settings,
  ChevronDown,
  ChevronRight,
  Receipt,
  CreditCard,
  ArrowDownCircle,
  ArrowUpCircle,
  Building2,
  Banknote,
  PieChart,
  Database,
  RefreshCw,
  Trash2,
  Upload,
  FolderOpen,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href?: string;
  icon: React.ReactNode;
  children?: { title: string; href: string }[];
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    title: "Parties",
    icon: <Users className="w-5 h-5" />,
    children: [
      { title: "All Parties", href: "/parties" },
      { title: "Add Party", href: "/parties/add" },
    ],
  },
  {
    title: "Items",
    icon: <Package className="w-5 h-5" />,
    children: [
      { title: "All Items", href: "/items" },
      { title: "Add Item", href: "/items/add" },
      { title: "Categories", href: "/items/categories" },
    ],
  },
  {
    title: "Sale",
    icon: <ShoppingCart className="w-5 h-5" />,
    children: [
      { title: "Sale Invoices", href: "/sale/invoices" },
      { title: "Estimation", href: "/sale/estimation" },
      { title: "Proforma Invoice", href: "/sale/proforma" },
      { title: "Payment In", href: "/sale/payment-in" },
      { title: "Sale Order", href: "/sale/order" },
      { title: "Delivery Challan", href: "/sale/dc" },
      { title: "Sale Return / Credit Note", href: "/sale/return" },
    ],
  },
  {
    title: "Purchase & Expense",
    icon: <FileText className="w-5 h-5" />,
    children: [
      { title: "Purchase Bills", href: "/purchase/bills" },
      { title: "Payment Out", href: "/purchase/payment-out" },
      { title: "Expenses", href: "/purchase/expenses" },
      { title: "Purchase Order", href: "/purchase/order" },
      { title: "Purchase Return / Dr. Note", href: "/purchase/return" },
    ],
  },
  {
    title: "Cash & Bank",
    icon: <Wallet className="w-5 h-5" />,
    children: [
      { title: "Bank Accounts", href: "/cash-bank/accounts" },
      { title: "Cash in Hand", href: "/cash-bank/cash" },
    ],
  },
  {
    title: "Reports",
    icon: <BarChart3 className="w-5 h-5" />,
    children: [
      { title: "Sale Report", href: "/reports/sale" },
      { title: "Purchase Report", href: "/reports/purchase" },
      { title: "Profit & Loss", href: "/reports/pnl" },
      { title: "Bill Wise P&L", href: "/reports/bill-wise-pnl" },
      { title: "Balance Sheet", href: "/reports/balance-sheet" },
      { title: "Stock Summary", href: "/reports/stock-summary" },
      { title: "Item Wise P&L", href: "/reports/item-wise-pnl" },
      { title: "Stock Detail", href: "/reports/stock-detail" },
      { title: "Item Detail", href: "/reports/item-detail" },
      { title: "Taxes - TCS", href: "/reports/taxes" },
      { title: "Expense Report", href: "/reports/expense" },
    ],
  },
  {
    title: "Sync & Backup",
    icon: <Cloud className="w-5 h-5" />,
    children: [
      { title: "Sync & Share", href: "/backup/sync" },
      { title: "Auto Backup", href: "/backup/auto" },
      { title: "Backup to Computer", href: "/backup/download" },
      { title: "Restore Backup", href: "/backup/restore" },
    ],
  },
  {
    title: "Utilities",
    icon: <Settings className="w-5 h-5" />,
    children: [
      { title: "Import Items", href: "/utilities/import" },
      { title: "Update Items in Bulk", href: "/utilities/bulk-update" },
      { title: "Recycle Bin", href: "/utilities/recycle-bin" },
    ],
  },
];

export function Sidebar() {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(["Sale"]);

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return location.pathname === href;
  };

  const isParentActive = (children?: { href: string }[]) => {
    if (!children) return false;
    return children.some((child) => location.pathname.startsWith(child.href));
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar text-sidebar-foreground flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl btn-gradient flex items-center justify-center">
            <Receipt className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-sidebar-foreground">AccuBooks</h1>
            <p className="text-xs text-sidebar-foreground/60">Accounting Software</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.title}>
              {item.href ? (
                <Link
                  to={item.href}
                  className={cn("sidebar-link", isActive(item.href) && "active")}
                >
                  {item.icon}
                  <span className="font-medium">{item.title}</span>
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => toggleExpand(item.title)}
                    className={cn(
                      "sidebar-link w-full justify-between",
                      isParentActive(item.children) && "bg-sidebar-accent"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span className="font-medium">{item.title}</span>
                    </div>
                    {expandedItems.includes(item.title) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  {expandedItems.includes(item.title) && item.children && (
                    <ul className="ml-4 mt-1 space-y-1 animate-fade-in">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            to={child.href}
                            className={cn(
                              "sidebar-link pl-8 text-sm",
                              isActive(child.href) && "active"
                            )}
                          >
                            {child.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
            <span className="text-sm font-semibold">AB</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">My Business</p>
            <p className="text-xs text-sidebar-foreground/60">FY 2024-25</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
