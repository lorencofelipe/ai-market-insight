import { TrustBadge } from "./TrustBadge";
import { FloatingQuoteCard } from "./FloatingQuoteCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

interface MarketSizingToolCallProps {
    tam: string;
    sam: string;
    som: string;
    sourceUrl?: string;
}

export function MarketSizingToolCall({
    tam = "$15B",
    sam = "$4.2B",
    som = "$800M",
    sourceUrl = "https://example.com/report",
}: Partial<MarketSizingToolCallProps>) {
    return (
        <Card className="w-full max-w-lg overflow-hidden border-2 shadow-sm bg-secondary/30 mt-4 mb-4">
            <CardHeader className="bg-secondary/50 pb-4 border-b">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm flex items-center gap-2 text-foreground font-semibold">
                        <Info className="w-4 h-4 text-primary" />
                        Market Sizing Result
                    </CardTitle>
                    <TrustBadge level="high" sourceText="Gartner / PitchBook 2024" />
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-end border-b pb-4">
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Total Addressable Market (TAM)</span>
                            <FloatingQuoteCard
                                confidence="high"
                                quote="The global market for AI-driven financial analytics is projected to reach $15 billion by 2028, driven by the need for automated pitch-deck data."
                                sourceTitle="PitchBook: AI in Finance 2024"
                                sourceUrl={sourceUrl}
                            >
                                <span className="text-muted-foreground text-sm">Source: Pitchbook Data Inc.</span>
                            </FloatingQuoteCard>
                        </div>
                        <span className="font-mono text-3xl font-bold tracking-tight text-foreground">{tam}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col px-4 border-l-2 border-border">
                            <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">SAM</span>
                            <span className="font-mono text-xl font-semibold text-foreground">{sam}</span>
                        </div>
                        <div className="flex flex-col px-4 border-l-2 border-primary/50">
                            <span className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">SOM (Target)</span>
                            <span className="font-mono text-xl font-bold text-primary">{som}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
