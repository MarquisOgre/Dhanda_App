import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickStatsData {
  totalReceivables: number;
  receivablesParties: number;
  totalPayables: number;
  payablesParties: number;
  overdueAmount: number;
  overdueCount: number;
  paidThisMonth: number;
  paidCount: number;
}

interface QuickStatsProps {
  data: QuickStatsData;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function QuickStats({ data }: QuickStatsProps) {
  const stats = [
    {
      label: "Total Receivables",
      value: formatCurrency(data.totalReceivables),
      subtext: `${data.receivablesParties} parties`,
      icon: TrendingUp,
      color: "text-success bg-success/10",
    },
    {
      label: "Total Payables",
      value: formatCurrency(data.totalPayables),
      subtext: `${data.payablesParties} parties`,
      icon: TrendingDown,
      color: "text-warning bg-warning/10",
    },
    {
      label: "Overdue Invoices",
      value: formatCurrency(data.overdueAmount),
      subtext: `${data.overdueCount} invoices`,
      icon: AlertCircle,
      color: "text-destructive bg-destructive/10",
    },
    {
      label: "Paid This Month",
      value: formatCurrency(data.paidThisMonth),
      subtext: `${data.paidCount} payments`,
      icon: CheckCircle,
      color: "text-primary bg-primary/10",
    },
  ];

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
