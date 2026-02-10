import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExternalLink, Shield } from "lucide-react";

interface Source {
  url: string;
  domain: string;
  title: string;
  credibility: "high" | "medium" | "low";
  lastUsed: string;
  citations: number;
}

const mockSources: Source[] = [
  { url: "#", domain: "crunchbase.com", title: "Startup Funding Database", credibility: "high", lastUsed: "2m ago", citations: 34 },
  { url: "#", domain: "statista.com", title: "Market Statistics Portal", credibility: "high", lastUsed: "15m ago", citations: 28 },
  { url: "#", domain: "gartner.com", title: "Gartner Magic Quadrant Reports", credibility: "high", lastUsed: "1h ago", citations: 22 },
  { url: "#", domain: "techcrunch.com", title: "Industry News & Analysis", credibility: "medium", lastUsed: "2h ago", citations: 15 },
  { url: "#", domain: "linkedin.com", title: "Professional Network Data", credibility: "medium", lastUsed: "3h ago", citations: 12 },
  { url: "#", domain: "reddit.com", title: "Community Discussions", credibility: "low", lastUsed: "5h ago", citations: 8 },
  { url: "#", domain: "arxiv.org", title: "Research Papers", credibility: "high", lastUsed: "1d ago", citations: 6 },
];

const confStyles: Record<string, string> = {
  high: "text-confidence-high bg-confidence-high/10",
  medium: "text-confidence-medium bg-confidence-medium/10",
  low: "text-confidence-low bg-confidence-low/10",
};

const confBars: Record<string, string> = {
  high: "bg-confidence-high",
  medium: "bg-confidence-medium",
  low: "bg-confidence-low",
};

export default function Sources() {
  const totalSources = mockSources.length;
  const highConf = mockSources.filter((s) => s.credibility === "high").length;

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto">
      <div>
        <h1 className="text-lg font-bold font-mono tracking-tight">Evidence & Sources</h1>
        <p className="text-xs text-muted-foreground">Audit trail for all AI-generated insights</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="border-border bg-card">
          <CardContent className="p-3 text-center">
            <div className="text-xl font-mono font-bold">{totalSources}</div>
            <div className="text-2xs text-muted-foreground">Total Sources</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-3 text-center">
            <div className="text-xl font-mono font-bold text-confidence-high">{highConf}</div>
            <div className="text-2xs text-muted-foreground">High Confidence</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-3 text-center">
            <div className="text-xl font-mono font-bold">125</div>
            <div className="text-2xs text-muted-foreground">Total Citations</div>
          </CardContent>
        </Card>
      </div>

      {/* Credibility Distribution */}
      <Card className="border-border bg-card">
        <CardHeader className="p-3 pb-1">
          <CardTitle className="text-xs font-mono font-semibold flex items-center gap-2">
            <Shield className="h-3 w-3" /> Credibility Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-1">
          <div className="flex gap-1 h-2 rounded-full overflow-hidden">
            {(["high", "medium", "low"] as const).map((level) => {
              const count = mockSources.filter((s) => s.credibility === level).length;
              const pct = (count / totalSources) * 100;
              return <div key={level} className={`${confBars[level]} rounded-full`} style={{ width: `${pct}%` }} />;
            })}
          </div>
          <div className="flex justify-between mt-1">
            {(["high", "medium", "low"] as const).map((level) => (
              <span key={level} className={`text-2xs ${confStyles[level].split(" ")[0]}`}>{level}</span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Source Table */}
      <Card className="border-border bg-card overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-2xs font-mono h-8 px-3">Source</TableHead>
                <TableHead className="text-2xs font-mono h-8 px-3 hidden sm:table-cell">Domain</TableHead>
                <TableHead className="text-2xs font-mono h-8 px-3 w-14">Cred.</TableHead>
                <TableHead className="text-2xs font-mono h-8 px-3 hidden md:table-cell text-right">Cites</TableHead>
                <TableHead className="text-2xs font-mono h-8 px-3 text-right">Last Used</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSources.map((s, i) => (
                <TableRow key={i} className="border-border">
                  <TableCell className="text-xs font-medium px-3 py-2">
                    <div className="flex items-center gap-1">
                      {s.title}
                      <ExternalLink className="h-2.5 w-2.5 text-muted-foreground" />
                    </div>
                  </TableCell>
                  <TableCell className="text-2xs text-muted-foreground font-mono px-3 py-2 hidden sm:table-cell">{s.domain}</TableCell>
                  <TableCell className="px-3 py-2">
                    <span className={`text-2xs px-1.5 py-0.5 rounded font-medium ${confStyles[s.credibility]}`}>
                      {s.credibility}
                    </span>
                  </TableCell>
                  <TableCell className="text-2xs text-muted-foreground font-mono px-3 py-2 hidden md:table-cell text-right">{s.citations}</TableCell>
                  <TableCell className="text-2xs text-muted-foreground font-mono px-3 py-2 text-right">{s.lastUsed}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
