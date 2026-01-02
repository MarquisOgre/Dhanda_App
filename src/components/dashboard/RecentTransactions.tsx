import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const transactions = [
  {
    id: 1,
    type: "sale",
    party: "Rahul Electronics",
    amount: "₹45,000",
    date: "Today, 2:30 PM",
    invoice: "INV-001",
  },
  {
    id: 2,
    type: "purchase",
    party: "Metro Suppliers",
    amount: "₹28,500",
    date: "Today, 11:00 AM",
    invoice: "PUR-042",
  },
  {
    id: 3,
    type: "sale",
    party: "Sharma Traders",
    amount: "₹12,800",
    date: "Yesterday",
    invoice: "INV-002",
  },
  {
    id: 4,
    type: "purchase",
    party: "ABC Wholesalers",
    amount: "₹65,200",
    date: "Yesterday",
    invoice: "PUR-041",
  },
  {
    id: 5,
    type: "sale",
    party: "Quick Mart",
    amount: "₹8,400",
    date: "2 days ago",
    invoice: "INV-003",
  },
];

export function RecentTransactions() {
  return (
    <div className="metric-card">
      <h3 className="font-semibold text-lg mb-4">Recent Transactions</h3>
      <div className="space-y-4">
        {transactions.map((txn) => (
          <div
            key={txn.id}
            className="flex items-center justify-between py-2 border-b border-border last:border-0"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "p-2 rounded-lg",
                  txn.type === "sale"
                    ? "bg-success/10 text-success"
                    : "bg-warning/10 text-warning"
                )}
              >
                {txn.type === "sale" ? (
                  <ArrowUpCircle className="w-5 h-5" />
                ) : (
                  <ArrowDownCircle className="w-5 h-5" />
                )}
              </div>
              <div>
                <p className="font-medium text-sm">{txn.party}</p>
                <p className="text-xs text-muted-foreground">
                  {txn.invoice} • {txn.date}
                </p>
              </div>
            </div>
            <p
              className={cn(
                "font-semibold",
                txn.type === "sale" ? "text-success" : "text-foreground"
              )}
            >
              {txn.type === "sale" ? "+" : "-"}
              {txn.amount}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
