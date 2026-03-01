import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type ConfidenceLevel = "high" | "medium" | "low";

interface TrustBadgeProps {
    level: ConfidenceLevel;
    sourceText?: string;
    className?: string;
}

export function TrustBadge({ level, sourceText, className }: TrustBadgeProps) {
    const config = {
        high: {
            icon: <CheckCircle2 className="w-3 h-3 mr-1" />,
            text: "Alta Confiança",
            className: "bg-confidence-high/10 text-confidence-high border-confidence-high/20 hover:bg-confidence-high/20",
        },
        medium: {
            icon: <AlertTriangle className="w-3 h-3 mr-1" />,
            text: "Confiança Média",
            className: "bg-confidence-medium/10 text-confidence-medium border-confidence-medium/20 hover:bg-confidence-medium/20",
        },
        low: {
            icon: <XCircle className="w-3 h-3 mr-1" />,
            text: "Baixa Confiança",
            className: "bg-confidence-low/10 text-confidence-low border-confidence-low/20 hover:bg-confidence-low/20",
        },
    };

    const { icon, text, className: levelClassName } = config[level];

    const badge = (
        <Badge variant="outline" className={cn("font-medium transition-colors cursor-help px-2 py-0.5", levelClassName, className)}>
            {icon}
            {text}
        </Badge>
    );

    if (!sourceText) return badge;

    return (
        <TooltipProvider delayDuration={200}>
            <Tooltip>
                <TooltipTrigger asChild>{badge}</TooltipTrigger>
                <TooltipContent className="max-w-[300px] text-sm font-sans" side="top">
                    <p className="font-semibold mb-1">Fonte Base:</p>
                    <p className="text-muted-foreground">{sourceText}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
