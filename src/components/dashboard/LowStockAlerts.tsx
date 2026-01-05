interface LowStockItem {
  name: string;
  stock: number;
  minStock: number;
}

interface LowStockAlertsProps {
  items: LowStockItem[];
}

export function LowStockAlerts({ items }: LowStockAlertsProps) {
  return (
    <div className="metric-card">
      <h3 className="font-semibold text-lg mb-4">Low Stock Alerts</h3>
      {items.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No low stock alerts</p>
          <p className="text-sm">All items are well-stocked</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
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
      )}
    </div>
  );
}
