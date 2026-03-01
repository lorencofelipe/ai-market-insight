import { useState } from "react";
import {
    useLocalRuntime,
    Composer,
    Message,
    MessagePrimitive,
    MessageContext
} from "@assistant-ui/react";
import { Thread, makeMarkdownText } from "@assistant-ui/react-ui";
import { MarketSizingToolCall } from "./MarketSizingToolCall";
import { Card } from "@/components/ui/card";
import { TrustBadge } from "./TrustBadge";

const MarkdownText = makeMarkdownText();

export function CoremarketChat() {
    const runtime = useLocalRuntime({
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
        async onNew(message) {
            if (message.content[0]?.type === "text" && message.content[0].text.toLowerCase().includes("tam")) {
                return {
                    content: [
                        {
                            type: "text",
                            text: "Here is the market sizing breakdown based on the latest PitchBook and Gartner reports:"
                        },
                        {
                            type: "tool-call",
                            toolName: "render_market_sizing",
                            args: { tam: "$15B", sam: "$4.2B", som: "$800M" },
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
    });

    return (
        <div className="h-full w-full bg-background flex flex-col">
            <Thread
                runtime={runtime}
                components={{
                    AssistantMessage: MyAssistantMessage,
                }}
            />
        </div>
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
                    tools: {
                        render_market_sizing: ({ args }: any) => {
                            return (
                                <MarketSizingToolCall
                                    tam={args.tam}
                                    sam={args.sam}
                                    som={args.som}
                                />
                            )
                        }
                    }
                }} />
            </div>
        </MessagePrimitive.Root>
    );
};
