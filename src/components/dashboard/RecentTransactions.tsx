import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  type: 'sale' | 'purchase';
  party: string;
  amount: number;
  date: string;
  invoice: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <div className="metric-card">
      <h3 className="font-semibold text-lg mb-4">Recent Transactions</h3>
      {transactions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No transactions yet</p>
          <p className="text-sm">Create your first invoice to see transactions here</p>
        </div>
      ) : (
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
                {formatCurrency(txn.amount)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
