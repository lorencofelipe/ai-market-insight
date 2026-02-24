import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, FileText, Database, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Source {
    source: string;
    source_type: string;
    similarity: number;
    preview?: string;
}

const sourceTypeIcons: Record<string, React.ElementType> = {
    competitor_discovery: Database,
    framework_analysis: FileText,
    chat_analysis: MessageSquare,
};

const sourceTypeLabels: Record<string, string> = {
    competitor_discovery: "Competitor Intel",
    framework_analysis: "Framework",
    chat_analysis: "Research",
};

function getConfidenceBadge(similarity: number) {
    if (similarity >= 0.85) {
        return { label: "Alta", emoji: "🟢", className: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" };
    }
    if (similarity >= 0.65) {
        return { label: "Média", emoji: "🟡", className: "bg-amber-500/15 text-amber-700 border-amber-500/30" };
    }
    return { label: "Baixa", emoji: "🔴", className: "bg-red-500/15 text-red-700 border-red-500/30" };
}

interface SourceCitationProps {
    sources: Source[];
}

export function SourceCitation({ sources }: SourceCitationProps) {
    const [isOpen, setIsOpen] = useState(false);

    if (!sources || sources.length === 0) return null;

    return (
        <div className="mt-3 border-t border-border/40 pt-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-full"
            >
                <FileText className="h-3 w-3" />
                <span className="font-medium">
                    {sources.length} fonte{sources.length > 1 ? "s" : ""} utilizada{sources.length > 1 ? "s" : ""}
                </span>
                {isOpen ? <ChevronUp className="h-3 w-3 ml-auto" /> : <ChevronDown className="h-3 w-3 ml-auto" />}
            </button>

            {isOpen && (
                <div className="mt-2 space-y-1.5">
                    {sources.map((source, idx) => {
                        const Icon = sourceTypeIcons[source.source_type] || FileText;
                        const label = sourceTypeLabels[source.source_type] || source.source_type;
                        const confidence = getConfidenceBadge(source.similarity);

                        return (
                            <div
                                key={idx}
                                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-muted/50 text-xs"
                            >
                                <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                <span className="font-medium text-foreground/80 truncate flex-1">
                                    {source.source}
                                </span>
                                <Badge
                                    variant="outline"
                                    className="text-[10px] px-1.5 py-0 h-4 font-medium shrink-0"
                                >
                                    {label}
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className={cn("text-[10px] px-1.5 py-0 h-4 font-semibold shrink-0", confidence.className)}
                                >
                                    {confidence.emoji} {Math.round(source.similarity * 100)}%
                                </Badge>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
