import {
    useLocalRuntime,
    AssistantRuntimeProvider,
    MessagePrimitive,
    ThreadPrimitive,
    ComposerPrimitive,
    type ChatModelAdapter,
    makeAssistantToolUI,
} from "@assistant-ui/react";
import { makeMarkdownText } from "@assistant-ui/react-ui";
import { MarketSizingToolCall } from "./MarketSizingToolCall";
import { TrustBadge } from "./TrustBadge";
import { ArrowRight, Sparkles, Search, Database } from "lucide-react";

const MarkdownText = makeMarkdownText();

const MyModelAdapter: ChatModelAdapter = {
    async run({ messages }) {
        const lastMessage = messages[messages.length - 1];
        const text = lastMessage?.content
            ?.filter((c): c is { type: "text"; text: string } => c.type === "text")
            .map((c) => c.text)
            .join(" ") ?? "";

        const targetMarket = text.trim() || "AI-powered market intelligence tools";

        return {
            content: [
                {
                    type: "text",
                    text: `Based on the latest industry reports and our proprietary data models, here is the market sizing breakdown for **${targetMarket}**:`
                },
                {
                    type: "tool-call" as const,
                    toolName: "render_market_sizing",
                    args: {
                        market: targetMarket,
                        methodology: "bottom_up",
                        tam: { value: "$15.0B", calculation: "150K companies × $100K avg contract", sources: ["Gartner 2025", "IDC Forecast"] },
                        sam: { value: "$2.25B", filters: "North America (45%) • Mid-market 100-1000 employees (33%)" },
                        som: { value: "$45M", market_share: "2%" },
                        growth: { cagr: "24.5%", years: 5 }
                    },
                    argsText: JSON.stringify({ market: targetMarket }),
                    toolCallId: "call_" + Math.random().toString(36).substring(7)
                },
                {
                    type: "text",
                    text: "This represents a highly fragmented market with significant room for consolidation in the mid-market segment. Let me know if you want to explore the Porter's 5 Forces or Competitor Map for this sector."
                }
            ]
        };
    }
};

const MarketSizingToolUI = makeAssistantToolUI({
    toolName: "render_market_sizing",
    render: ({ args }) => {
        const a = args as any;
        return (
            <div className="my-6">
                <MarketSizingToolCall
                    market={a.market}
                    methodology={a.methodology}
                    tam={a.tam}
                    sam={a.sam}
                    som={a.som}
                    growth={a.growth}
                />
            </div>
        );
    },
});

export function CoremarketChat() {
    const runtime = useLocalRuntime(MyModelAdapter, {
        initialMessages: [],
    });

    return (
        <AssistantRuntimeProvider runtime={runtime}>
            <MarketSizingToolUI />
            <ThreadPrimitive.Root
                className="h-full bg-background text-foreground font-sans flex flex-col"
                style={{ ["--thread-max-width" as string]: "48rem" }}
            >
                <ThreadPrimitive.If empty>
                    <div className="flex h-full w-full items-center justify-center p-4">
                        <div className="flex w-full max-w-[var(--thread-max-width)] flex-col gap-10">
                            <div className="space-y-3">
                                <h1 className="text-4xl text-foreground md:text-5xl font-semibold tracking-tight">
                                    Coremarket Intelligence
                                </h1>
                                <p className="text-muted-foreground text-lg">
                                    What market would you like to investigate today?
                                </p>
                            </div>
                            <Composer />
                        </div>
                    </div>
                </ThreadPrimitive.If>

                <ThreadPrimitive.Viewport className="flex-1 overflow-y-auto px-4 md:px-0 scroll-smooth">
                    <div className="mx-auto flex max-w-[var(--thread-max-width)] flex-col gap-8 pb-32 pt-12">
                        <ThreadPrimitive.Messages
                            components={{
                                UserMessage: UserMessage,
                                AssistantMessage: AssistantMessage,
                            }}
                        />
                    </div>
                </ThreadPrimitive.Viewport>

                <ThreadPrimitive.If running={false} empty={false}>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/90 to-transparent pt-10 pb-6 px-4">
                        <div className="mx-auto max-w-[var(--thread-max-width)]">
                            <Composer />
                        </div>
                    </div>
                </ThreadPrimitive.If>



            </ThreadPrimitive.Root>
        </AssistantRuntimeProvider>
    );
}

const Composer = () => {
    return (
        <ComposerPrimitive.Root className="relative flex w-full items-end gap-2 rounded-2xl border border-border bg-secondary/30 p-2 shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 transition-all duration-200">
            <ComposerPrimitive.Input
                placeholder="Ask anything about any market..."
                className="w-full bg-transparent px-3 py-3 text-foreground text-lg placeholder:text-muted-foreground focus:outline-none min-h-[52px] max-h-[200px] resize-none"
            />
            <ComposerPrimitive.Send className="mb-1 ml-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                <ArrowRight className="h-5 w-5" />
            </ComposerPrimitive.Send>
        </ComposerPrimitive.Root>
    );
};

const UserMessage = () => {
    return (
        <MessagePrimitive.Root className="w-full flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-secondary/80 border border-border text-foreground px-6 py-4 rounded-3xl max-w-[85%] text-lg leading-relaxed shadow-sm">
                <MessagePrimitive.Content />
            </div>
        </MessagePrimitive.Root>
    );
};

const AssistantMessage = () => {
    return (
        <MessagePrimitive.Root className="w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border border-primary/20">
                        CM
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-[15px] text-foreground flex items-center gap-1.5">
                            Coremarket Analyst
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Database className="w-3 h-3" /> Data backed by verified sources
                        </span>
                    </div>
                </div>
                <TrustBadge level="high" />
            </div>

            <div className="text-foreground text-[16px] leading-relaxed pl-12 prose prose-neutral dark:prose-invert max-w-none">
                <MessagePrimitive.Content components={{
                    Text: MarkdownText,
                }} />
            </div>
        </MessagePrimitive.Root>
    );
};
