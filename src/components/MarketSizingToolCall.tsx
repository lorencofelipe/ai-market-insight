import { TrustBadge } from "./TrustBadge";
import { FloatingQuoteCard } from "./FloatingQuoteCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Calculator, Target, TrendingUp, BookOpen } from "lucide-react";

interface MarketSizingToolCallProps {
    market: string;
    methodology: string;
    tam: { value: string; calculation: string; sources: string[] };
    sam: { value: string; filters: string };
    som: { value: string; market_share: string };
    growth: { cagr: string; years: number };
}

export function MarketSizingToolCall({
    market = "Target Market",
    methodology = "bottom_up",
    tam = { value: "$15B", calculation: "150K companies × $100K avg contract", sources: ["Gartner 2025"] },
    sam = { value: "$4.5B", filters: "North America (45%) • Mid-market (33%)" },
    som = { value: "$90M", market_share: "2%" },
    growth = { cagr: "24.5%", years: 5 }
}: Partial<MarketSizingToolCallProps>) {
    return (
        <Card className="w-full max-w-2xl overflow-hidden border border-border shadow-sm bg-background mt-4 mb-4">
            <CardHeader className="bg-secondary/30 pb-4 border-b">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-[15px] flex items-center gap-2 text-foreground font-semibold">
                            <Target className="w-4 h-4 text-primary" />
                            Market Sizing: {market}
                        </CardTitle>
                        <TrustBadge level="high" sourceText="Verified Agent Output" />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Calculator className="w-3.5 h-3.5" />
                        <span className="uppercase tracking-wide font-medium">Methodology: {methodology.replace('_', '-')}</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6 relative">
                <div className="flex flex-col gap-8">
                    {/* TAM Block */}
                    <div className="flex flex-col gap-1.5 border-b border-border/50 pb-6">
                        <div className="flex justify-between items-baseline">
                            <span className="text-sm font-semibold text-foreground uppercase tracking-wider">Total Addressable Market (TAM)</span>
                            <span className="font-mono text-4xl font-bold tracking-tight text-primary">{tam.value}</span>
                        </div>
                        <div className="bg-secondary/40 rounded-md p-3 border border-border mt-2">
                            <div className="flex justify-between items-start">
                                <span className="font-mono text-xs text-muted-foreground">{tam.calculation}</span>
                                <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1 font-sans"><BookOpen className="w-3 h-3" /> Sources</span>
                                    {tam.sources.map((src, i) => (
                                        <span key={i} className="font-mono">{src}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SAM & SOM Block */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1 border-l-2 border-border pl-4">
                            <span className="text-sm font-semibold text-foreground uppercase tracking-wider">SAM</span>
                            <span className="font-mono text-2xl font-bold text-foreground mb-1">{sam.value}</span>
                            <span className="text-[11px] text-muted-foreground flex flex-col gap-1 font-mono">
                                <span className="text-foreground/70 font-sans font-medium">Filters Applied:</span>
                                {sam.filters.split('•').map((f, i) => <span key={i}>✓ {f.trim()}</span>)}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1 border-l-2 border-primary/40 pl-4 bg-primary/5 -my-2 py-2 rounded-r-lg">
                            <span className="text-sm font-semibold text-primary uppercase tracking-wider">SOM (Target)</span>
                            <span className="font-mono text-2xl font-bold text-primary mb-1">{som.value}</span>
                            <span className="text-xs text-muted-foreground font-mono">
                                Max Market Share: <span className="text-foreground font-semibold">{som.market_share}</span>
                            </span>
                        </div>
                    </div>

                    {/* Growth Footer */}
                    <div className="flex items-center gap-2 text-xs bg-secondary/80 text-foreground border border-border p-2.5 rounded-lg mt-2">
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                        <span>Projected Market Growth:</span>
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{growth.cagr} CAGR</span>
                        <span className="text-muted-foreground">over {growth.years} years</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
