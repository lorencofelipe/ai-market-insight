import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Activity, Target, BarChart3, Zap } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";

const metrics = [
  { label: "Active Projects", value: "12", change: "+3", up: true, icon: Target },
  { label: "Insights Generated", value: "847", change: "+24%", up: true, icon: Zap },
  { label: "Coverage Score", value: "72%", change: "+5%", up: true, icon: BarChart3 },
  { label: "Competitor Alerts", value: "8", change: "-2", up: false, icon: Activity },
];

const trendData = [
  { d: "W1", v: 40 }, { d: "W2", v: 55 }, { d: "W3", v: 48 },
  { d: "W4", v: 72 }, { d: "W5", v: 68 }, { d: "W6", v: 85 },
  { d: "W7", v: 92 },
];

const barData = [
  { name: "SWOT", count: 14 }, { name: "Porter", count: 9 },
  { name: "TAM", count: 7 }, { name: "Comp", count: 22 },
];

const recentActivity = [
  { time: "2m ago", text: "SWOT analysis completed for Fintech sector", type: "framework" },
  { time: "15m ago", text: "3 new competitors discovered in EdTech market", type: "discovery" },
  { time: "1h ago", text: "Market sizing updated: SaaS B2B — $847B TAM", type: "insight" },
  { time: "3h ago", text: "Competitor alert: Acme Corp raised Series C ($120M)", type: "alert" },
  { time: "5h ago", text: "Porter's Five Forces completed for Cloud Infrastructure", type: "framework" },
];

const typeColors: Record<string, string> = {
  framework: "bg-primary/10 text-primary",
  discovery: "bg-confidence-high/10 text-confidence-high",
  insight: "bg-[hsl(199_89%_48%/0.1)] text-[hsl(199_89%_48%)]",
  alert: "bg-confidence-low/10 text-confidence-low",
};

export default function Dashboard() {
  return (
    <div className="p-5 space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Market Pulse</h1>
          <p className="text-sm text-muted-foreground">Real-time intelligence overview</p>
        </div>
        <span className="text-xs text-muted-foreground">
          {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
        </span>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <Card key={m.label}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className={`text-xs font-semibold flex items-center gap-0.5 ${m.up ? "text-signal-up" : "text-signal-down"}`}>
                    {m.up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                    {m.change}
                  </span>
                </div>
                <div className="text-2xl font-bold">{m.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{m.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Trend Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-semibold">Insights Trend</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(239 84% 67%)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="hsl(239 84% 67%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v" stroke="hsl(239 84% 67%)" fill="url(#areaGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Framework Usage */}
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-semibold">Framework Usage</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(215 16% 57%)" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(215 16% 57%)" width={24} />
                  <Bar dataKey="count" fill="hsl(239 84% 67%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-1">
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <span className="text-xs text-muted-foreground w-14 shrink-0 pt-0.5">{a.time}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 ${typeColors[a.type]}`}>
                  {a.type}
                </span>
                <span className="text-foreground/90">{a.text}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
