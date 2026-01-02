import { Bell, Search, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions, parties, items..."
            className="pl-10 bg-muted/50 border-0 focus-visible:ring-primary"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="btn-gradient gap-2">
              <Plus className="w-4 h-4" />
              Quick Add
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link to="/sale/invoices/new">New Sale Invoice</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/purchase/bills/new">New Purchase Bill</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/parties/add">Add Party</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/items/add">Add Item</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/purchase/expenses/new">Add Expense</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        </Button>

        <Button variant="ghost" size="icon">
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}
