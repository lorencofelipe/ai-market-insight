import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, Globe, Swords, TrendingUp } from "lucide-react";
import { streamChat, type Msg } from "@/lib/stream-chat";
import { cn } from "@/lib/utils";
import { TimelineResponse } from "@/components/chat/TimelineResponse";
import { SourceCitation, type Source } from "@/components/chat/SourceCitation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const contextModes = [
  { id: "general", label: "Market Research", icon: Globe },
  { id: "competitive", label: "Competitive Intel", icon: Swords },
  { id: "industry", label: "Industry Deep-Dive", icon: TrendingUp },
];

export default function Chat() {
  const [messages, setMessages] = useState<(Msg & { sources?: Source[] })[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState("general");
  const [pendingMode, setPendingMode] = useState<string | null>(null);
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
      <div className="p-5 pb-3">
        <h1 className="text-xl font-bold tracking-tight">AI Research</h1>
        <div className="flex gap-2 mt-3">
          {contextModes.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => {
                  if (m.id === mode) return;
                  if (messages.length > 0) {
                    setPendingMode(m.id);
                  } else {
                    setMode(m.id);
                  }
                }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
                  mode === m.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 space-y-3 pb-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-3">
              <p className="text-sm text-muted-foreground">Ask a market research question</p>
              <div className="flex flex-wrap gap-2 justify-center max-w-sm">
                {[
                  "What's the TAM for AI-powered CRM?",
                  "Top competitors in EdTech SaaS",
                  "SWOT for vertical SaaS in healthcare",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => { setInput(q); }}
                    className="text-xs px-3 py-1.5 rounded-full bg-muted text-muted-foreground hover:text-foreground transition-colors"
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
            {m.role === "user" ? (
              <Card className="max-w-[85%] bg-primary text-primary-foreground border-primary">
                <CardContent className="p-3 text-sm leading-relaxed whitespace-pre-wrap">
                  {m.content}
                </CardContent>
              </Card>
            ) : (
              <Card className="max-w-[90%] bg-card border-border/60 shadow-sm">
                <CardContent className="p-4">
                  <TimelineResponse
                    content={m.content}
                    isStreaming={isLoading && i === messages.length - 1}
                  />
                  {!isLoading && m.sources && m.sources.length > 0 && (
                    <SourceCitation sources={m.sources} />
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-5 pt-3 border-t border-border">
        <form
          onSubmit={(e) => { e.preventDefault(); send(); }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about markets, competitors, trends..."
            className="text-sm"
            disabled={isLoading}
          />
          <Button size="icon" type="submit" disabled={isLoading || !input.trim()} className="rounded-lg">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
      {/* Confirmation dialog */}
      <AlertDialog open={!!pendingMode} onOpenChange={(open) => !open && setPendingMode(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Fechar conversa atual?</AlertDialogTitle>
            <AlertDialogDescription>
              Ao trocar de modo, a conversa atual será encerrada. Deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingMode) {
                  setMessages([]);
                  setMode(pendingMode);
                  setPendingMode(null);
                }
              }}
            >
              Sim, fechar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
