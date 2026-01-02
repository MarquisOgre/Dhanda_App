import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Apr", sales: 240000, purchase: 180000 },
  { name: "May", sales: 320000, purchase: 220000 },
  { name: "Jun", sales: 280000, purchase: 190000 },
  { name: "Jul", sales: 420000, purchase: 280000 },
  { name: "Aug", sales: 380000, purchase: 250000 },
  { name: "Sep", sales: 520000, purchase: 340000 },
  { name: "Oct", sales: 480000, purchase: 310000 },
  { name: "Nov", sales: 560000, purchase: 380000 },
  { name: "Dec", sales: 620000, purchase: 420000 },
];

export function SalesChart() {
  return (
    <div className="metric-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg">Sales vs Purchase</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">Sales</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent" />
            <span className="text-sm text-muted-foreground">Purchase</span>
          </div>
        </div>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(199 89% 48%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(199 89% 48%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="purchaseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(172 66% 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(172 66% 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215 16% 47%)", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215 16% 47%)", fontSize: 12 }}
              tickFormatter={(value) => `₹${value / 1000}K`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0 0% 100%)",
                border: "1px solid hsl(214 32% 91%)",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [`₹${value.toLocaleString()}`, ""]}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="hsl(199 89% 48%)"
              strokeWidth={2}
              fill="url(#salesGradient)"
            />
            <Area
              type="monotone"
              dataKey="purchase"
              stroke="hsl(172 66% 50%)"
              strokeWidth={2}
              fill="url(#purchaseGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
