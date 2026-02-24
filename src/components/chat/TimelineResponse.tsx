import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  Target,
  BarChart3,
  Lightbulb,
  Shield,
  AlertTriangle,
  CheckCircle2,
  FileText,
} from "lucide-react";

const sectionIcons: Record<string, React.ElementType> = {
  summary: FileText,
  overview: FileText,
  market: BarChart3,
  size: BarChart3,
  trend: TrendingUp,
  growth: TrendingUp,
  competitor: Target,
  player: Target,
  swot: Shield,
  strength: CheckCircle2,
  weakness: AlertTriangle,
  opportunit: Lightbulb,
  threat: AlertTriangle,
  recommend: Lightbulb,
  insight: Lightbulb,
  conclusion: CheckCircle2,
};

function getIconForTitle(title: string) {
  const lower = title.toLowerCase();
  for (const [key, Icon] of Object.entries(sectionIcons)) {
    if (lower.includes(key)) return Icon;
  }
  return FileText;
}

function detectConfidence(text: string): "high" | "medium" | "low" | null {
  const lower = text.toLowerCase();
  if (lower.includes("high confidence") || lower.includes("confidence: high") || lower.includes("**high**"))
    return "high";
  if (lower.includes("medium confidence") || lower.includes("confidence: medium") || lower.includes("**medium**"))
    return "medium";
  if (lower.includes("low confidence") || lower.includes("confidence: low") || lower.includes("**low**"))
    return "low";
  return null;
}

const confidenceColors: Record<string, string> = {
  high: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  medium: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  low: "bg-red-500/15 text-red-700 border-red-500/30",
};

interface TimelineSection {
  title: string;
  content: string;
  confidence: "high" | "medium" | "low" | null;
}

function parseSections(text: string): TimelineSection[] {
  // Split by markdown headers (## or ###)
  const parts = text.split(/^(#{1,3})\s+(.+)$/m);

  if (parts.length <= 1) {
    // No headers found — treat as single block
    return [{ title: "Resposta", content: text.trim(), confidence: detectConfidence(text) }];
  }

  const sections: TimelineSection[] = [];
  let i = 0;

  // Content before first header
  const preamble = parts[0].trim();
  if (preamble) {
    sections.push({ title: "Resumo", content: preamble, confidence: detectConfidence(preamble) });
  }

  i = 1;
  while (i < parts.length) {
    // parts[i] = "##", parts[i+1] = title, parts[i+2] = content until next header
    const title = parts[i + 1]?.trim() || "Seção";
    const content = parts[i + 2]?.trim() || "";
    sections.push({ title, content, confidence: detectConfidence(content) });
    i += 3;
  }

  return sections;
}

interface TimelineResponseProps {
  content: string;
  isStreaming?: boolean;
}

export function TimelineResponse({ content, isStreaming }: TimelineResponseProps) {
  const sections = useMemo(() => parseSections(content), [content]);

  if (sections.length <= 1 && sections[0]?.content.length < 80) {
    // Short response — render inline
    return (
      <div className="text-sm leading-relaxed prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-foreground/85">
        <ReactMarkdown>{content}</ReactMarkdown>
        {isStreaming && (
          <span className="inline-block w-1.5 h-4 bg-primary ml-0.5 animate-pulse rounded-sm" />
        )}
      </div>
    );
  }

  return (
    <div className="relative space-y-0">
      {sections.map((section, idx) => {
        const Icon = getIconForTitle(section.title);
        const isLast = idx === sections.length - 1;

        return (
          <div key={idx} className="relative flex gap-3">
            {/* Timeline connector */}
            <div className="flex flex-col items-center pt-1">
              <div className="h-7 w-7 rounded-full bg-primary/10 border-2 border-primary/40 flex items-center justify-center shrink-0 z-10">
                <Icon className="h-3.5 w-3.5 text-primary" />
              </div>
              {!isLast && (
                <div className="w-0.5 flex-1 bg-gradient-to-b from-primary/30 to-primary/10 min-h-[16px]" />
              )}
            </div>

            {/* Content */}
            <div className={cn("flex-1 pb-5", isLast && "pb-1")}>
              <div className="flex items-center gap-2 mb-1.5">
                <h4 className="text-sm font-bold text-foreground leading-tight">
                  {section.title}
                </h4>
                {section.confidence && (
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] px-1.5 py-0 h-4 font-semibold capitalize",
                      confidenceColors[section.confidence]
                    )}
                  >
                    {section.confidence}
                  </Badge>
                )}
              </div>
              <div className="text-sm leading-relaxed prose prose-sm max-w-none prose-headings:text-foreground prose-headings:text-xs prose-p:text-foreground/80 prose-li:text-foreground/80 prose-strong:text-foreground prose-ul:my-1 prose-li:my-0">
                <ReactMarkdown>{section.content}</ReactMarkdown>
              </div>
              {isStreaming && isLast && (
                <span className="inline-block w-1.5 h-4 bg-primary ml-0.5 animate-pulse rounded-sm" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
