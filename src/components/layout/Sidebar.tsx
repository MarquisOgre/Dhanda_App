import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useBusinessSettings } from "@/contexts/BusinessContext";
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
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
    title: "Sales",
    icon: <ShoppingCart className="w-5 h-5" />,
    children: [
      { title: "Sale Invoices", href: "/sale/invoices" },
      { title: "Payment In", href: "/sale/payment-in" },
      { title: "Delivery Challan", href: "/sale/dc" },
    ],
  },
  {
    title: "Purchases",
    icon: <FileText className="w-5 h-5" />,
    children: [
      { title: "Purchase Invoices", href: "/purchase/bills" },
      { title: "Payment Out", href: "/purchase/payment-out" },
      { title: "Expenses", href: "/purchase/expenses" },
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
      { title: "Stock Report", href: "/reports/stock" },
      { title: "Item Wise P&L", href: "/reports/item-wise-pnl" },
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
      { title: "Reset Database", href: "/utilities/reset" },
    ],
  },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(["Sale"]);
  const { businessSettings, getCurrentFinancialYear } = useBusinessSettings();

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

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <div className="h-full bg-sidebar text-sidebar-foreground flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <Link to="/" className="flex justify-start" onClick={handleLinkClick}>
          <img
            src="/logo.png"
            alt="Dhanda App Logo"
            className="w-full max-w-[180px] h-auto object-contain"
          />
        </Link>
      </div>

      {/* Business Name */}
      <div className="px-4 py-3 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sidebar-accent flex items-center justify-center">
            <span className="text-sm font-bold text-sidebar-primary">
              {businessSettings?.business_name?.charAt(0)?.toUpperCase() || 'B'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate text-sidebar-foreground">
              {businessSettings?.business_name || 'My Business'}
            </p>
            <p className="text-xs text-sidebar-foreground/60">FY {getCurrentFinancialYear()}</p>
          </div>
        </div>
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
                  onClick={handleLinkClick}
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
                            onClick={handleLinkClick}
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
    </div>
  );
}

export function Sidebar() {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-3 right-3 z-50 md:hidden"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent onClose={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside className="fixed left-0 top-0 h-[calc(100vh-3rem)] w-64 z-50 hidden md:block">
      <SidebarContent />
    </aside>
  );
}
