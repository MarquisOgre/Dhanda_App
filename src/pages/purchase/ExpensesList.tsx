import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, MoreHorizontal, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const expenses = [
  {
    id: 1,
    number: "EXP-025",
    date: "02 Jan 2026",
    category: "Office Supplies",
    description: "Stationery and printing materials",
    amount: 2500,
    paymentMode: "Cash",
  },
  {
    id: 2,
    number: "EXP-024",
    date: "01 Jan 2026",
    category: "Utilities",
    description: "Electricity bill - December",
    amount: 8500,
    paymentMode: "Bank Transfer",
  },
  {
    id: 3,
    number: "EXP-023",
    date: "30 Dec 2025",
    category: "Rent",
    description: "Office rent - January",
    amount: 35000,
    paymentMode: "Cheque",
  },
  {
    id: 4,
    number: "EXP-022",
    date: "28 Dec 2025",
    category: "Travel",
    description: "Client meeting travel expenses",
    amount: 4500,
    paymentMode: "Cash",
  },
];

const categoryColors: Record<string, string> = {
  "Office Supplies": "bg-blue-500/10 text-blue-500",
  "Utilities": "bg-yellow-500/10 text-yellow-500",
  "Rent": "bg-purple-500/10 text-purple-500",
  "Travel": "bg-green-500/10 text-green-500",
};

export default function ExpensesList() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Expenses</h1>
          <p className="text-muted-foreground">Track and manage business expenses</p>
        </div>
        <Button asChild className="btn-gradient gap-2">
          <Link to="/purchase/expenses/new">
            <Plus className="w-4 h-4" />
            Add Expense
          </Link>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <p className="text-sm text-muted-foreground">Total Expenses</p>
          <p className="text-2xl font-bold mt-1">₹{totalExpenses.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">{expenses.length} entries</p>
        </div>
        <div className="metric-card">
          <p className="text-sm text-muted-foreground">This Month</p>
          <p className="text-2xl font-bold text-warning mt-1">₹11,000</p>
          <p className="text-xs text-muted-foreground mt-1">2 expenses</p>
        </div>
        <div className="metric-card">
          <p className="text-sm text-muted-foreground">Top Category</p>
          <p className="text-2xl font-bold text-primary mt-1">Rent</p>
          <p className="text-xs text-muted-foreground mt-1">₹35,000</p>
        </div>
        <div className="metric-card">
          <p className="text-sm text-muted-foreground">Avg. Monthly</p>
          <p className="text-2xl font-bold mt-1">₹42,500</p>
          <p className="text-xs text-muted-foreground mt-1">Last 3 months</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search expenses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Expenses Table */}
      <div className="metric-card overflow-hidden p-0">
        <table className="data-table">
          <thead>
            <tr>
              <th>Expense No.</th>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Payment Mode</th>
              <th className="text-right">Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((expense) => (
              <tr key={expense.id} className="group">
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                      <Receipt className="w-5 h-5 text-destructive" />
                    </div>
                    <span className="font-medium">{expense.number}</span>
                  </div>
                </td>
                <td className="text-muted-foreground">{expense.date}</td>
                <td>
                  <span
                    className={cn(
                      "px-2 py-1 text-xs font-medium rounded-full",
                      categoryColors[expense.category] || "bg-muted"
                    )}
                  >
                    {expense.category}
                  </span>
                </td>
                <td className="text-muted-foreground">{expense.description}</td>
                <td className="text-muted-foreground">{expense.paymentMode}</td>
                <td className="text-right font-semibold">₹{expense.amount.toLocaleString()}</td>
                <td>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
