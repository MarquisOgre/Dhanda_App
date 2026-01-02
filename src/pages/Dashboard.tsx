import {
  TrendingUp,
  ShoppingCart,
  FileText,
  Wallet,
  Users,
  Package,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { QuickStats } from "@/components/dashboard/QuickStats";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your business overview.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Sales"
          value="₹12,45,800"
          change="+12.5% from last month"
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-success"
        />
        <MetricCard
          title="Total Purchase"
          value="₹8,32,400"
          change="+8.2% from last month"
          changeType="negative"
          icon={ShoppingCart}
          iconColor="text-warning"
        />
        <MetricCard
          title="Total Parties"
          value="248"
          change="15 added this month"
          changeType="neutral"
          icon={Users}
          iconColor="text-primary"
        />
        <MetricCard
          title="Stock Value"
          value="₹4,85,200"
          change="324 items"
          changeType="neutral"
          icon={Package}
          iconColor="text-accent"
        />
      </div>

      {/* Charts and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div>
          <QuickStats />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTransactions />
        <div className="metric-card">
          <h3 className="font-semibold text-lg mb-4">Low Stock Alerts</h3>
          <div className="space-y-3">
            {[
              { name: "Samsung LED TV 43\"", stock: 2, minStock: 5 },
              { name: "iPhone 15 Pro Max", stock: 1, minStock: 3 },
              { name: "Sony Headphones WH-1000", stock: 3, minStock: 10 },
              { name: "Dell Laptop Inspiron 15", stock: 0, minStock: 2 },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/20"
              >
                <div>
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Min. stock: {item.minStock}
                  </p>
                </div>
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-destructive/10 text-destructive">
                  {item.stock} left
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
