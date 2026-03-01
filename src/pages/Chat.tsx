import { CoremarketChat } from "@/components/CoremarketChat";

export default function Chat() {
  return (
    <div className="flex flex-col h-full mx-auto w-full max-w-5xl rounded-xl border border-border mt-4 overflow-hidden shadow-sm">
      <div className="bg-secondary/50 p-4 border-b flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-foreground">Coremarket Analytics</h1>
          <p className="text-sm text-muted-foreground">Market Sizing, Competitors & TAM/SAM/SOM</p>
        </div>
      </div>
      <div className="flex-1 overflow-hidden bg-background">
        <CoremarketChat />
      </div>
    </div>
  );
}
