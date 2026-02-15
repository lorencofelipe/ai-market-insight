import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./Dashboard";
import Chat from "./Chat";
import Frameworks from "./Frameworks";
import Discovery from "./Discovery";
import Sources from "./Sources";

const pages: Record<string, React.ComponentType> = {
  dashboard: Dashboard,
  chat: Chat,
  frameworks: Frameworks,
  discovery: Discovery,
  sources: Sources,
};

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const Page = pages[activeTab] || Dashboard;

  return (
    <AppLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <Page />
    </AppLayout>
  );
};

export default Index;
