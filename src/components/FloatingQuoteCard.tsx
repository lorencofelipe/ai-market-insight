import { ReactNode } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { TrustBadge } from "./TrustBadge";

interface FloatingQuoteCardProps {
    children: ReactNode;
    quote: string;
    sourceTitle: string;
    sourceUrl?: string;
    confidence: "high" | "medium" | "low";
}

export function FloatingQuoteCard({
    children,
    quote,
    sourceTitle,
    sourceUrl,
    confidence,
}: FloatingQuoteCardProps) {
    return (
        <HoverCard openDelay={200} closeDelay={100}>
            <HoverCardTrigger asChild>
                <span className="underline underline-offset-4 decoration-primary/50 hover:decoration-primary cursor-help transition-all">
                    {children}
                </span>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 p-4 border-2 shadow-xl bg-background rounded-xl" side="top" align="center">
                <div className="flex flex-col space-y-3">
                    <div className="flex items-start justify-between">
                        <h4 className="text-sm font-bold text-foreground">Citação Exata</h4>
                        <TrustBadge level={confidence} />
                    </div>
                    <div className="relative pl-3 border-l-2 border-primary/30">
                        <p className="text-sm text-foreground/90 italic font-sans leading-relaxed">
                            "{quote}"
                        </p>
                    </div>
                    <div className="pt-2 mt-2 border-t border-border">
                        <p className="text-xs text-muted-foreground font-mono">
                            Fonte:{" "}
                            {sourceUrl ? (
                                <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                    {sourceTitle}
                                </a>
                            ) : (
                                <span className="font-semibold">{sourceTitle}</span>
                            )}
                        </p>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}
