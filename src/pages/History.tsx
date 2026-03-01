import { Plus, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const mockThreads = [
  { id: "1", title: "TAM Analysis for AI in Finance", date: "2 hours ago" },
  { id: "2", title: "Competitor Map: Fintech Payments", date: "Yesterday" },
  { id: "3", title: "Market Sizing: EdTech LATAM", date: "2 days ago" },
  { id: "4", title: "Porter's 5 Forces: SaaS Security", date: "3 days ago" },
  { id: "5", title: "SWOT Analysis: Health Tech", date: "1 week ago" },
];

export default function History() {
  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto w-full">
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-xl font-bold text-foreground">History</h1>
        <p className="text-sm text-muted-foreground mt-1">Your past research threads</p>
      </div>

      <div className="px-4 pb-4">
        <button className="flex items-center gap-2 w-full px-4 py-3 rounded-xl border border-border bg-secondary/50 text-foreground font-medium text-sm hover:bg-secondary transition-colors">
          <Plus className="h-4 w-4" />
          New Thread
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-1 pb-20">
        {mockThreads.map((thread) => (
          <button
            key={thread.id}
            className={cn(
              "flex items-start gap-3 w-full px-4 py-3 rounded-xl text-left transition-colors",
              "hover:bg-secondary/80 text-foreground"
            )}
          >
            <MessageSquare className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{thread.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{thread.date}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
