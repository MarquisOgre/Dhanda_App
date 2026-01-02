import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  {
    label: "Total Receivables",
    value: "₹2,45,800",
    subtext: "12 parties",
    icon: TrendingUp,
    color: "text-success bg-success/10",
  },
  {
    label: "Total Payables",
    value: "₹1,28,400",
    subtext: "8 parties",
    icon: TrendingDown,
    color: "text-warning bg-warning/10",
  },
  {
    label: "Overdue Invoices",
    value: "₹45,200",
    subtext: "3 invoices",
    icon: AlertCircle,
    color: "text-destructive bg-destructive/10",
  },
  {
    label: "Paid This Month",
    value: "₹3,85,000",
    subtext: "24 invoices",
    icon: CheckCircle,
    color: "text-primary bg-primary/10",
  },
];

export function QuickStats() {
  return (
    <div className="metric-card">
      <h3 className="font-semibold text-lg mb-4">Quick Stats</h3>
      <div className="space-y-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
          >
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg", stat.color)}>
                <stat.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium">{stat.label}</p>
                <p className="text-xs text-muted-foreground">{stat.subtext}</p>
              </div>
            </div>
            <p className="font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
