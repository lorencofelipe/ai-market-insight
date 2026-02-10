import { useIsMobile } from "@/hooks/use-mobile";
import { BottomTabs } from "./BottomTabs";
import { DesktopSidebar } from "./DesktopSidebar";

interface AppLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AppLayout({ children, activeTab, onTabChange }: AppLayoutProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <main className="flex-1 overflow-y-auto pb-16">{children}</main>
        <BottomTabs activeTab={activeTab} onTabChange={onTabChange} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <DesktopSidebar activeTab={activeTab} onTabChange={onTabChange} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
