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
    <div className="p-5 space-y-5 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Evidence & Sources</h1>
        <p className="text-sm text-muted-foreground">Audit trail for all AI-generated insights</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{totalSources}</div>
            <div className="text-xs text-muted-foreground">Total Sources</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-confidence-high">{highConf}</div>
            <div className="text-xs text-muted-foreground">High Confidence</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">125</div>
            <div className="text-xs text-muted-foreground">Total Citations</div>
          </CardContent>
        </Card>
      </div>

      {/* Credibility Distribution */}
      <Card>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Shield className="h-4 w-4" /> Credibility Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-1">
          <div className="flex gap-1 h-2.5 rounded-full overflow-hidden">
            {(["high", "medium", "low"] as const).map((level) => {
              const count = mockSources.filter((s) => s.credibility === level).length;
              const pct = (count / totalSources) * 100;
              return <div key={level} className={`${confBars[level]} rounded-full`} style={{ width: `${pct}%` }} />;
            })}
          </div>
          <div className="flex justify-between mt-1.5">
            {(["high", "medium", "low"] as const).map((level) => (
              <span key={level} className={`text-xs font-semibold ${confStyles[level].split(" ")[0]}`}>{level}</span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Source Table */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs h-10 px-4">Source</TableHead>
                <TableHead className="text-xs h-10 px-4 hidden sm:table-cell">Domain</TableHead>
                <TableHead className="text-xs h-10 px-4 w-20">Cred.</TableHead>
                <TableHead className="text-xs h-10 px-4 hidden md:table-cell text-right">Cites</TableHead>
                <TableHead className="text-xs h-10 px-4 text-right">Last Used</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSources.map((s, i) => (
                <TableRow key={i}>
                  <TableCell className="text-sm font-medium px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {s.title}
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground px-4 py-3 hidden sm:table-cell">{s.domain}</TableCell>
                  <TableCell className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${confStyles[s.credibility]}`}>
                      {s.credibility}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground px-4 py-3 hidden md:table-cell text-right">{s.citations}</TableCell>
                  <TableCell className="text-xs text-muted-foreground px-4 py-3 text-right">{s.lastUsed}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
