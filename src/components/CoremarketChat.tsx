import {
    useLocalRuntime,
    AssistantRuntimeProvider,
    MessagePrimitive,
    type ChatModelAdapter,
    makeAssistantToolUI,
} from "@assistant-ui/react";
import { Thread, makeMarkdownText } from "@assistant-ui/react-ui";
import { MarketSizingToolCall } from "./MarketSizingToolCall";
import { TrustBadge } from "./TrustBadge";

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
            <MarketSizingToolCall
                tam={a.tam}
                sam={a.sam}
                som={a.som}
            />
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
            <div className="h-full w-full bg-background flex flex-col">
                <MarketSizingToolUI />
                <Thread
                    components={{
                        AssistantMessage: MyAssistantMessage,
                    }}
                />
            </div>
        </AssistantRuntimeProvider>
    );
}

const MyAssistantMessage = () => {
    return (
        <MessagePrimitive.Root className="flex flex-col gap-2 relative w-full max-w-2xl py-6 px-4">
            <div className="flex items-center gap-2 mb-1">
                <div className="bg-primary/10 text-primary w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm">
                    CM
                </div>
                <span className="font-semibold text-sm text-foreground">Coremarket Analyst</span>
                <TrustBadge level="high" className="ml-2 scale-90 origin-left" />
            </div>
            <div className="text-foreground pl-10">
                <MessagePrimitive.Content components={{
                    Text: MarkdownText,
                }} />
            </div>
        </MessagePrimitive.Root>
    );
};
