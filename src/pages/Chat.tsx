import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, Globe, Swords, TrendingUp } from "lucide-react";
import { streamChat, type Msg } from "@/lib/stream-chat";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const contextModes = [
  { id: "general", label: "Market Research", icon: Globe },
  { id: "competitive", label: "Competitive Intel", icon: Swords },
  { id: "industry", label: "Industry Deep-Dive", icon: TrendingUp },
];

export default function Chat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState("general");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Msg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: [...messages, userMsg],
        mode,
        onDelta: upsertAssistant,
        onDone: () => setIsLoading(false),
      });
    } catch (e: any) {
      toast.error(e.message || "Failed to get AI response");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="p-4 pb-2">
        <h1 className="text-lg font-bold font-mono tracking-tight">AI Research</h1>
        <div className="flex gap-1.5 mt-2">
          {contextModes.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-2xs font-medium transition-colors",
                  mode === m.id
                    ? "bg-primary/15 text-primary border border-primary/30"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-3 w-3" />
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 space-y-3 pb-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Ask a market research question</p>
              <div className="flex flex-wrap gap-1.5 justify-center max-w-sm">
                {[
                  "What's the TAM for AI-powered CRM?",
                  "Top competitors in EdTech SaaS",
                  "SWOT for vertical SaaS in healthcare",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => { setInput(q); }}
                    className="text-2xs px-2 py-1 rounded bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <Card
              className={cn(
                "max-w-[85%] border-border",
                m.role === "user" ? "bg-primary/10" : "bg-card"
              )}
            >
              <CardContent className="p-2.5 text-xs leading-relaxed whitespace-pre-wrap">
                {m.content}
                {isLoading && i === messages.length - 1 && m.role === "assistant" && (
                  <span className="inline-block w-1.5 h-3.5 bg-primary ml-0.5 animate-pulse-glow" />
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 pt-2 border-t border-border">
        <form
          onSubmit={(e) => { e.preventDefault(); send(); }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about markets, competitors, trends..."
            className="text-xs bg-muted/50"
            disabled={isLoading}
          />
          <Button size="icon" type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
}
