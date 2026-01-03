import { useState } from "react";
import { Trash2, RotateCcw, Search, FileText, Users, Package, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

const deletedItems = [
  { id: 1, name: "Old Laptop Model X", type: "item", deletedOn: "02 Jan 2026", deletedBy: "Admin", daysLeft: 28 },
  { id: 2, name: "Test Customer", type: "party", deletedOn: "01 Jan 2026", deletedBy: "Admin", daysLeft: 27 },
  { id: 3, name: "INV-OLD-001", type: "invoice", deletedOn: "30 Dec 2025", deletedBy: "Manager", daysLeft: 25 },
  { id: 4, name: "Discontinued Product", type: "item", deletedOn: "28 Dec 2025", deletedBy: "Admin", daysLeft: 23 },
  { id: 5, name: "Duplicate Party Entry", type: "party", deletedOn: "25 Dec 2025", deletedBy: "Staff", daysLeft: 20 },
  { id: 6, name: "Test Invoice Draft", type: "invoice", deletedOn: "22 Dec 2025", deletedBy: "Admin", daysLeft: 17 },
];

export default function RecycleBin() {
  const [items, setItems] = useState(deletedItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "item":
        return <Package className="w-4 h-4" />;
      case "party":
        return <Users className="w-4 h-4" />;
      case "invoice":
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "item":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "party":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      case "invoice":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const restoreItem = (id: number) => {
    setItems(items.filter(i => i.id !== id));
  };

  const permanentDelete = (id: number) => {
    setItems(items.filter(i => i.id !== id));
  };

  const emptyRecycleBin = () => {
    setItems([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Recycle Bin</h1>
          <p className="text-muted-foreground">Restore or permanently delete items</p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="gap-2" disabled={items.length === 0}>
              <Trash2 className="w-4 h-4" />
              Empty Recycle Bin
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Empty Recycle Bin?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete all {items.length} items in the recycle bin. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={emptyRecycleBin} className="bg-destructive text-destructive-foreground">
                Delete All
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Info Banner */}
      <div className="metric-card bg-warning/10 border-warning/20">
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-warning" />
          <div>
            <h3 className="font-semibold">Items in recycle bin will be permanently deleted after 30 days</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Restore items before they expire to recover your data. Once permanently deleted, data cannot be recovered.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search deleted items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="item">Items</SelectItem>
            <SelectItem value="party">Parties</SelectItem>
            <SelectItem value="invoice">Invoices</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Items List */}
      {filtered.length === 0 ? (
        <div className="metric-card text-center py-12">
          <Trash2 className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">Recycle Bin is Empty</h3>
          <p className="text-muted-foreground">Deleted items will appear here for 30 days</p>
        </div>
      ) : (
        <div className="metric-card overflow-hidden p-0">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Deleted On</th>
                <th>Deleted By</th>
                <th>Days Left</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td className="font-medium">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(item.type)}
                      {item.name}
                    </div>
                  </td>
                  <td>
                    <span className={cn("px-2 py-1 text-xs font-medium rounded-full capitalize", getTypeBadgeColor(item.type))}>
                      {item.type}
                    </span>
                  </td>
                  <td className="text-muted-foreground">{item.deletedOn}</td>
                  <td>{item.deletedBy}</td>
                  <td>
                    <span className={cn(
                      "font-medium",
                      item.daysLeft <= 7 ? "text-destructive" : item.daysLeft <= 14 ? "text-warning" : "text-muted-foreground"
                    )}>
                      {item.daysLeft} days
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => restoreItem(item.id)}
                      >
                        <RotateCcw className="w-3 h-3" />
                        Restore
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive gap-1">
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Permanently Delete?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete "{item.name}". This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => permanentDelete(item.id)}
                              className="bg-destructive text-destructive-foreground"
                            >
                              Delete Permanently
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
