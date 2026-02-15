import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Layers, Shield, Target, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const frameworks = [
  {
    id: "porters",
    name: "Porter's Five Forces",
    icon: Shield,
    description: "Analyze competitive forces shaping an industry",
    fields: ["Industry/Market", "Key Players"],
  },
  {
    id: "swot",
    name: "SWOT Analysis",
    icon: Target,
    description: "Strengths, Weaknesses, Opportunities, Threats",
    fields: ["Company/Product", "Market Context"],
  },
  {
    id: "tam",
    name: "TAM/SAM/SOM",
    icon: Layers,
    description: "Total, Serviceable, and Obtainable market sizing",
    fields: ["Market/Niche", "Geography"],
  },
];

const mockSwotResult = {
  strengths: ["Strong brand recognition", "Proprietary technology", "Experienced leadership team"],
  weaknesses: ["High customer acquisition cost", "Limited international presence", "Dependency on single revenue stream"],
  opportunities: ["Emerging markets expansion", "AI integration potential", "Strategic partnerships"],
  threats: ["Increasing competition", "Regulatory changes", "Economic downturn risk"],
};

export default function Frameworks() {
  const [selected, setSelected] = useState<string | null>(null);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const runFramework = async () => {
    setLoading(true);
    setResult(null);

    const fw = frameworks.find((f) => f.id === selected);
    if (!fw) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/framework-analysis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          framework: selected,
          inputs,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) throw new Error("Rate limit exceeded");
        if (response.status === 402) throw new Error("AI credits depleted");
        throw new Error("Analysis failed");
      }

      const data = await response.json();
      setResult(data.result);
    } catch (e: any) {
      toast.error(e.message);
      if (selected === "swot") setResult(mockSwotResult);
    } finally {
      setLoading(false);
    }
  };

  if (selected) {
    const fw = frameworks.find((f) => f.id === selected)!;
    return (
      <div className="p-5 space-y-5 max-w-2xl mx-auto">
        <button onClick={() => { setSelected(null); setResult(null); }} className="text-sm text-primary font-semibold hover:underline">
          ← Back to frameworks
        </button>
        <h1 className="text-xl font-bold">{fw.name}</h1>
        <p className="text-sm text-muted-foreground">{fw.description}</p>

        <div className="space-y-4">
          {fw.fields.map((field) => (
            <div key={field}>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">{field}</label>
              <Input
                className="text-sm"
                placeholder={`Enter ${field.toLowerCase()}...`}
                value={inputs[field] || ""}
                onChange={(e) => setInputs((prev) => ({ ...prev, [field]: e.target.value }))}
              />
            </div>
          ))}
          <Button onClick={runFramework} disabled={loading} className="w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ArrowRight className="h-4 w-4 mr-2" />}
            Run Analysis
          </Button>
        </div>

        {result && selected === "swot" && (
          <div className="grid grid-cols-2 gap-3 mt-5">
            {(["strengths", "weaknesses", "opportunities", "threats"] as const).map((q) => {
              const colors: Record<string, string> = {
                strengths: "border-[hsl(142_71%_45%/0.3)] bg-[hsl(142_71%_45%/0.05)]",
                weaknesses: "border-[hsl(0_84%_60%/0.3)] bg-[hsl(0_84%_60%/0.05)]",
                opportunities: "border-[hsl(239_84%_67%/0.3)] bg-[hsl(239_84%_67%/0.05)]",
                threats: "border-[hsl(38_92%_50%/0.3)] bg-[hsl(38_92%_50%/0.05)]",
              };
              return (
                <Card key={q} className={cn("border", colors[q])}>
                  <CardHeader className="p-3 pb-1">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider">{q}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0 space-y-1.5">
                    {(result[q] || []).map((item: string, i: number) => (
                      <p key={i} className="text-xs text-foreground/80">• {item}</p>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {result && selected !== "swot" && (
          <Card className="mt-5">
            <CardContent className="p-4 text-sm whitespace-pre-wrap">
              {typeof result === "string" ? result : JSON.stringify(result, null, 2)}
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="p-5 space-y-5 max-w-2xl mx-auto">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Strategic Frameworks</h1>
        <p className="text-sm text-muted-foreground">AI-powered strategic analysis tools</p>
      </div>

      <div className="space-y-3">
        {frameworks.map((fw) => {
          const Icon = fw.icon;
          return (
            <Card
              key={fw.id}
              className="hover:shadow-md cursor-pointer transition-all"
              onClick={() => setSelected(fw.id)}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold">{fw.name}</div>
                  <div className="text-xs text-muted-foreground">{fw.description}</div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
