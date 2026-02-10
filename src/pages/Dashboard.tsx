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
  framework: "bg-primary/20 text-primary",
  discovery: "bg-confidence-high/20 text-confidence-high",
  insight: "bg-signal-neutral/20 text-signal-neutral",
  alert: "bg-confidence-low/20 text-confidence-low",
};

export default function Dashboard() {
  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold font-mono tracking-tight">Market Pulse</h1>
          <p className="text-xs text-muted-foreground">Real-time intelligence overview</p>
        </div>
        <span className="text-2xs font-mono text-muted-foreground">
          {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
        </span>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <Card key={m.label} className="border-border bg-card">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className={`text-2xs font-mono flex items-center gap-0.5 ${m.up ? "text-signal-up" : "text-signal-down"}`}>
                    {m.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {m.change}
                  </span>
                </div>
                <div className="text-xl font-bold font-mono">{m.value}</div>
                <div className="text-2xs text-muted-foreground">{m.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Trend Chart */}
        <Card className="lg:col-span-2 border-border bg-card">
          <CardHeader className="p-3 pb-1">
            <CardTitle className="text-xs font-mono font-semibold">Insights Trend</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(210 100% 55%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(210 100% 55%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v" stroke="hsl(210 100% 55%)" fill="url(#areaGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Framework Usage */}
        <Card className="border-border bg-card">
          <CardHeader className="p-3 pb-1">
            <CardTitle className="text-xs font-mono font-semibold">Framework Usage</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="hsl(220 12% 55%)" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(220 12% 55%)" width={24} />
                  <Bar dataKey="count" fill="hsl(210 100% 55%)" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card className="border-border bg-card">
        <CardHeader className="p-3 pb-1">
          <CardTitle className="text-xs font-mono font-semibold">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-1">
          <div className="space-y-2">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span className="text-2xs text-muted-foreground font-mono w-12 shrink-0 pt-0.5">{a.time}</span>
                <span className={`px-1.5 py-0.5 rounded text-2xs font-medium shrink-0 ${typeColors[a.type]}`}>
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
