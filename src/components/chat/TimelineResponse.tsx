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

/** Strip leftover markdown symbols so text renders clean */
function cleanMarkdown(text: string): string {
  return text
    .replace(/^#{1,4}\s+/gm, "") // remove header markers
    .replace(/\*\*\*(.*?)\*\*\*/g, "$1") // bold-italic → plain
    .replace(/\*\*(.*?)\*\*/g, "$1") // bold → plain
    .replace(/\*(.*?)\*/g, "$1") // italic → plain
    .replace(/^[-*]\s+/gm, "• ") // normalize bullets
    .replace(/\n{3,}/g, "\n\n") // collapse extra newlines
    .trim();
}

function parseSections(text: string): TimelineSection[] {
  const headerRegex = /^#{1,3}\s+(.+)$/gm;
  const matches = [...text.matchAll(headerRegex)];

  if (matches.length === 0) {
    const cleaned = cleanMarkdown(text);
    return [{ title: "Resposta", content: cleaned, confidence: detectConfidence(cleaned) }];
  }

  const sections: TimelineSection[] = [];

  // Content before first header
  const preamble = text.slice(0, matches[0].index).trim();
  if (preamble) {
    const cleaned = cleanMarkdown(preamble);
    sections.push({ title: "Resumo", content: cleaned, confidence: detectConfidence(cleaned) });
  }

  matches.forEach((match, idx) => {
    const title = match[1].replace(/\*+/g, "").trim();
    const start = (match.index ?? 0) + match[0].length;
    const end = idx + 1 < matches.length ? matches[idx + 1].index : text.length;
    const raw = text.slice(start, end).trim();
    const cleaned = cleanMarkdown(raw);
    sections.push({ title, content: cleaned, confidence: detectConfidence(cleaned) });
  });

  return sections;
}

interface TimelineResponseProps {
  content: string;
  isStreaming?: boolean;
}

export function TimelineResponse({ content, isStreaming }: TimelineResponseProps) {
  const sections = useMemo(() => parseSections(content), [content]);

  if (sections.length <= 1 && sections[0]?.content.length < 80) {
    return (
      <div className="text-[14px] leading-7 text-foreground/85">
        {cleanMarkdown(content)}
        {isStreaming && (
          <span className="inline-block w-1.5 h-4 bg-primary ml-0.5 animate-pulse rounded-sm" />
        )}
      </div>
    );
  }

  return (
    <div className="relative space-y-1">
      {sections.map((section, idx) => {
        const Icon = getIconForTitle(section.title);
        const isLast = idx === sections.length - 1;

        return (
          <div key={idx} className="relative flex gap-4">
            {/* Timeline connector */}
            <div className="flex flex-col items-center pt-0.5">
              <div className="h-8 w-8 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center shrink-0 z-10">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              {!isLast && (
                <div className="w-0.5 flex-1 bg-gradient-to-b from-primary/25 to-primary/5 min-h-[24px]" />
              )}
            </div>

            {/* Content */}
            <div className={cn("flex-1 pt-0.5", isLast ? "pb-1" : "pb-6")}>
              <div className="flex items-center gap-2.5 mb-2">
                <h4 className="text-[15px] font-bold text-foreground leading-snug">
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
              <div className="text-[13.5px] leading-7 text-foreground/75 whitespace-pre-line">
                {section.content}
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
