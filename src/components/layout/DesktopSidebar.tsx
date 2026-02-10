import { LayoutDashboard, MessageSquare, Layers, Search, FileCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "chat", label: "AI Research", icon: MessageSquare },
  { id: "frameworks", label: "Frameworks", icon: Layers },
  { id: "discovery", label: "Discovery", icon: Search },
  { id: "sources", label: "Sources", icon: FileCheck },
];

interface DesktopSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function DesktopSidebar({ activeTab, onTabChange }: DesktopSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col h-full border-r border-border bg-card transition-all duration-200",
        collapsed ? "w-16" : "w-56"
      )}
    >
      <div className="flex items-center gap-2 px-4 h-14 border-b border-border">
        <Zap className="h-5 w-5 text-primary shrink-0" />
        {!collapsed && (
          <span className="font-mono font-bold text-sm tracking-tight text-foreground">
            InsightForge
          </span>
        )}
      </div>

      <nav className="flex-1 py-2 space-y-0.5 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{tab.label}</span>}
            </button>
          );
        })}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-10 border-t border-border text-muted-foreground hover:text-foreground text-xs"
      >
        {collapsed ? "→" : "← Collapse"}
      </button>
    </aside>
  );
}
