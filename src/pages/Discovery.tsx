import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Loader2, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";

interface Competitor {
  name: string;
  funding: string;
  headcount: string;
  pricing: string;
  positioning: string;
  confidence: "high" | "medium" | "low";
}

const mockCompetitors: Competitor[] = [
  { name: "Acme Analytics", funding: "$45M Series B", headcount: "120-150", pricing: "$99-499/mo", positioning: "Enterprise analytics", confidence: "high" },
  { name: "DataPulse", funding: "$12M Series A", headcount: "40-60", pricing: "$49-199/mo", positioning: "SMB market intelligence", confidence: "high" },
  { name: "InsightLoop", funding: "$8M Seed", headcount: "15-25", pricing: "$29-149/mo", positioning: "AI-first research", confidence: "medium" },
  { name: "MarketScope", funding: "$200M+ Series D", headcount: "500+", pricing: "Enterprise only", positioning: "Full-stack CI platform", confidence: "high" },
  { name: "TrendRadar", funding: "$3M Pre-seed", headcount: "8-12", pricing: "Freemium", positioning: "Social signal monitoring", confidence: "low" },
];

const confStyles: Record<string, string> = {
  high: "text-confidence-high bg-confidence-high/10",
  medium: "text-confidence-medium bg-confidence-medium/10",
  low: "text-confidence-low bg-confidence-low/10",
};

export default function Discovery() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [competitors, setCompetitors] = useState<Competitor[]>(mockCompetitors);
  const [coverage, setCoverage] = useState(65);

  const discover = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/competitor-discovery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ query: query.trim() }),
      });

      if (!response.ok) {
        if (response.status === 429) throw new Error("Rate limit exceeded");
        if (response.status === 402) throw new Error("AI credits depleted");
        throw new Error("Discovery failed");
      }

      const data = await response.json();
      if (data.competitors?.length) {
        setCompetitors(data.competitors);
        setCoverage(data.coverage || 65);
      }
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 space-y-5 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Competitive Discovery</h1>
        <p className="text-sm text-muted-foreground">AI-powered competitor identification & analysis</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); discover(); }} className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter a market or niche (e.g., 'B2B SaaS analytics')"
          className="text-sm"
        />
        <Button type="submit" size="sm" disabled={loading} className="shrink-0">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </Button>
      </form>

      {/* Coverage Score */}
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="flex-1">
            <div className="text-xs text-muted-foreground mb-1.5 font-semibold">Discovery Coverage</div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${coverage}%` }}
              />
            </div>
          </div>
          <span className="text-lg font-bold text-primary">~{coverage}%</span>
        </CardContent>
      </Card>

      {/* Competitor Table */}
      <Card className="overflow-hidden">
        <CardHeader className="p-4 pb-0">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <ArrowUpDown className="h-3.5 w-3.5" />
            {competitors.length} Competitors Found
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs h-10 px-4">Company</TableHead>
                <TableHead className="text-xs h-10 px-4 hidden sm:table-cell">Funding</TableHead>
                <TableHead className="text-xs h-10 px-4 hidden md:table-cell">Headcount</TableHead>
                <TableHead className="text-xs h-10 px-4">Pricing</TableHead>
                <TableHead className="text-xs h-10 px-4 hidden lg:table-cell">Positioning</TableHead>
                <TableHead className="text-xs h-10 px-4 w-20">Conf.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {competitors.map((c, i) => (
                <TableRow key={i}>
                  <TableCell className="text-sm font-medium px-4 py-3">{c.name}</TableCell>
                  <TableCell className="text-xs text-muted-foreground px-4 py-3 hidden sm:table-cell">{c.funding}</TableCell>
                  <TableCell className="text-xs text-muted-foreground px-4 py-3 hidden md:table-cell">{c.headcount}</TableCell>
                  <TableCell className="text-xs px-4 py-3">{c.pricing}</TableCell>
                  <TableCell className="text-xs text-muted-foreground px-4 py-3 hidden lg:table-cell">{c.positioning}</TableCell>
                  <TableCell className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${confStyles[c.confidence]}`}>
                      {c.confidence}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
