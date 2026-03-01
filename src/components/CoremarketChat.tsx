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
import { ArrowUp, BookOpen, Search } from "lucide-react";
import { Button } from "./ui/button";

const MarkdownText = makeMarkdownText();

const MyModelAdapter: ChatModelAdapter = {
    async run({ messages }) {
        const lastMessage = messages[messages.length - 1];
        const text = lastMessage?.content
            ?.filter((c): c is { type: "text"; text: string } => c.type === "text")
            .map((c) => c.text)
            .join(" ") ?? "";

        if (text.toLowerCase().includes("tam")) {
            return {
                content: [
                    {
                        type: "text",
                        text: "Here is the market sizing breakdown based on the latest PitchBook and Gartner reports:"
                    },
                    {
                        type: "tool-call" as const,
                        toolName: "render_market_sizing",
                        args: { tam: "$15B", sam: "$4.2B", som: "$800M" },
                        argsText: JSON.stringify({ tam: "$15B", sam: "$4.2B", som: "$800M" }),
                        toolCallId: "call_123"
                    },
                    {
                        type: "text",
                        text: "This represents a highly fragmented market with significant room for consolidation in the mid-market segment."
                    }
                ]
            };
        }
        return {
            content: [
                {
                    type: "text",
                    text: "I can help with that. To see our special Coremarket rendering, try asking me 'What is the TAM for AI in Finance?'"
                }
            ]
        };
    }
};

const MarketSizingToolUI = makeAssistantToolUI({
    toolName: "render_market_sizing",
    render: ({ args }) => {
        const a = args as { tam: string; sam: string; som: string };
        return (
            <div className="my-6">
                <MarketSizingToolCall
                    tam={a.tam}
                    sam={a.sam}
                    som={a.som}
                />
            </div>
        );
    },
});

export function CoremarketChat() {
    const runtime = useLocalRuntime(MyModelAdapter, {
        initialMessages: [
            {
                role: "assistant",
                content: [
                    {
                        type: "text",
                        text: "Welcome to Coremarket. I can help you analyze market sizes, competitive landscapes, and financial metrics. What would you like to investigate today?"
                    }
                ]
            },
        ],
    });

    return (
        <AssistantRuntimeProvider runtime={runtime}>
            <MarketSizingToolUI />
            <div className="h-full w-full bg-background flex flex-col font-sans relative">
                <ThreadPrimitive.Root className="flex-1 flex flex-col min-h-0">
                    <ThreadPrimitive.Viewport className="flex-1 overflow-y-auto px-4 md:px-0">
                        <div className="max-w-3xl mx-auto w-full py-8 md:py-12 flex flex-col gap-8">
                            <ThreadPrimitive.Messages
                                components={{
                                    AssistantMessage: MyAssistantMessage,
                                    UserMessage: MyUserMessage,
                                }}
                            />
                        </div>
                    </ThreadPrimitive.Viewport>

                    <div className="w-full bg-gradient-to-t from-background via-background to-transparent pb-6 pt-4 px-4 md:px-0 z-10">
                        <div className="max-w-3xl mx-auto w-full relative">
                            <MyComposer />
                        </div>
                    </div>
                </ThreadPrimitive.Root>
            </div>
        </AssistantRuntimeProvider>
    );
}

const MyAssistantMessage = () => {
    return (
        <MessagePrimitive.Root className="flex flex-col gap-3 w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-2 mb-2">
                <div className="bg-primary/10 text-primary w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0">
                    <Search className="w-4 h-4" />
                </div>
                <span className="font-semibold text-sm text-foreground">Coremarket Sources</span>
                <TrustBadge level="high" className="ml-auto" />
            </div>

            <div className="flex flex-wrap gap-2 mb-2 pl-10">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary px-2.5 py-1.5 rounded-md border border-border">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Gartner '25 Report</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary px-2.5 py-1.5 rounded-md border border-border">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>PitchBook Q3</span>
                </div>
            </div>

            <div className="text-foreground text-[15px] leading-relaxed pl-10">
                <MessagePrimitive.Content components={{
                    Text: MarkdownText,
                }} />
            </div>
        </MessagePrimitive.Root>
    );
};

const MyUserMessage = () => {
    return (
        <MessagePrimitive.Root className="w-full flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-secondary border border-border text-foreground px-5 py-3 rounded-2xl max-w-[85%] text-[15px] leading-relaxed">
                <MessagePrimitive.Content />
            </div>
        </MessagePrimitive.Root>
    );
};

const MyComposer = () => {
    return (
        <ComposerPrimitive.Root className="relative flex items-end w-full bg-secondary/50 border border-border focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 rounded-2xl p-2 transition-all duration-200 shadow-sm hover:border-border/80">
            <ComposerPrimitive.Input
                placeholder="Ask anything about any market..."
                className="w-full bg-transparent text-foreground placeholder-muted-foreground focus:outline-none min-h-[44px] max-h-[200px] resize-none px-3 py-3 text-[15px]"
            />
            <ThreadPrimitive.If running={false}>
                <ComposerPrimitive.Send asChild>
                    <Button size="icon" className="shrink-0 h-10 w-10 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground ml-2 mb-1">
                        <ArrowUp className="w-5 h-5" />
                    </Button>
                </ComposerPrimitive.Send>
            </ThreadPrimitive.If>
            <ThreadPrimitive.If running>
                <ComposerPrimitive.Cancel asChild>
                    <Button size="icon" variant="destructive" className="shrink-0 h-10 w-10 rounded-xl ml-2 mb-1">
                        <div className="w-3 h-3 bg-destructive-foreground rounded-sm" />
                    </Button>
                </ComposerPrimitive.Cancel>
            </ThreadPrimitive.If>
        </ComposerPrimitive.Root>
    );
};
