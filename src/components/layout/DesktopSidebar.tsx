import { MessageSquare, Layers, Search, Zap, Clock, X, PanelLeftClose, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const tabs = [
{ id: "chat", label: "AI Research", icon: MessageSquare },
{ id: "history", label: "History", icon: Clock },
{ id: "frameworks", label: "Frameworks", icon: Layers },
{ id: "discovery", label: "Discovery", icon: Search }];


const mockThreads = [
{ id: "1", title: "TAM Analysis for AI in Finance", date: "2h ago" },
{ id: "2", title: "Competitor Map: Fintech Payments", date: "Yesterday" },
{ id: "3", title: "Market Sizing: EdTech LATAM", date: "2 days ago" },
{ id: "4", title: "Porter's 5 Forces: SaaS Security", date: "3 days ago" },
{ id: "5", title: "SWOT Analysis: Health Tech", date: "1 week ago" }];


interface DesktopSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function DesktopSidebar({ activeTab, onTabChange }: DesktopSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [showHistory, setShowHistory] = useState(true);

  return (
    <aside
      className={cn(
        "flex flex-col h-full border-r border-border bg-card transition-all duration-200",
        collapsed ? "w-[60px]" : "w-56"
      )}>

      <div className={cn(
        "flex items-center h-14 border-b border-border shrink-0",
        collapsed ? "justify-center px-2" : "justify-between px-4"
      )}>
        {collapsed ? (
          <div className="flex flex-col items-center gap-1">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-sm tracking-tight text-foreground">Coremarket</span>
            </div>
            <button
              onClick={() => setCollapsed(true)}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Collapse sidebar">
              <PanelLeftClose className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Expand button when collapsed - positioned next to sidebar */}
      {collapsed && (
        <div className="flex justify-center py-2">
          <button
            onClick={() => setCollapsed(false)}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Expand sidebar">
            <PanelLeft className="h-4 w-4" />
          </button>
        </div>
      )}

      <nav className={cn("py-3 space-y-1", collapsed ? "px-1.5 flex flex-col items-center" : "px-2")}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === "history") {
                  if (collapsed) setCollapsed(false);
                  setShowHistory((v) => !v);
                } else {
                  onTabChange(tab.id);
                }
              }}
              className={cn(
                "flex items-center rounded-lg text-sm font-medium transition-all",
                collapsed ? "justify-center w-10 h-10 p-0" : "gap-3 w-full px-3 py-2.5",
                tab.id === "history" ?
                  showHistory && !collapsed ?
                    "text-foreground bg-muted" :
                    "text-muted-foreground hover:text-foreground hover:bg-muted" :
                  isActive ?
                    "bg-primary text-primary-foreground shadow-sm" :
                    "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              title={collapsed ? tab.label : undefined}>
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{tab.label}</span>}
            </button>);
        })}
      </nav>

      {/* History threads panel */}
      {!collapsed && showHistory &&
      <div className="flex-1 flex flex-col border-t border-border overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Recent
            </span>
            <button
            onClick={() => setShowHistory(false)}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">

              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-2 space-y-0.5 pb-2">
            {mockThreads.map((thread) =>
          <button
            key={thread.id}
            className="flex flex-col w-full px-3 py-2 rounded-lg text-left hover:bg-muted transition-colors group">

                <span className="text-sm text-foreground truncate w-full">
                  {thread.title}
                </span>
                <span className="text-xs text-muted-foreground">{thread.date}</span>
              </button>
          )}
          </div>
        </div>
      }

      {!showHistory && !collapsed && <div className="flex-1" />}

    </aside>);

}