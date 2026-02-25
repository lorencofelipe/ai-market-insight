import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import Chat from "./Chat";
import Frameworks from "./Frameworks";
import Discovery from "./Discovery";
import Sources from "./Sources";

const pages: Record<string, React.ComponentType> = {
  chat: Chat,
  frameworks: Frameworks,
  discovery: Discovery,
  sources: Sources,
};

const Index = () => {
  const [activeTab, setActiveTab] = useState("chat");

  const Page = pages[activeTab] || Chat;

  return (
    <AppLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <Page />
    </AppLayout>
  );
};

export default Index;
