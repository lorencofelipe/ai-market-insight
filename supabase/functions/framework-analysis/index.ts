import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const frameworkPrompts: Record<string, (inputs: Record<string, string>) => string> = {
  swot: (inputs) =>
    `Perform a comprehensive SWOT analysis for: ${inputs["Company/Product"] || "the company"} in the context of: ${inputs["Market Context"] || "their market"}. Return a JSON object with keys: strengths, weaknesses, opportunities, threats. Each key should have an array of 4-6 specific, data-informed bullet points. Be concrete with market data where possible.`,
  porters: (inputs) =>
    `Analyze Porter's Five Forces for the industry: ${inputs["Industry/Market"] || "the industry"} with key players: ${inputs["Key Players"] || "major players"}. Return a JSON object with keys: supplier_power, buyer_power, competitive_rivalry, threat_of_substitution, threat_of_new_entry. Each should have: rating (1-5), analysis (2-3 sentences), key_factors (array of strings).`,
  tam: (inputs) =>
    `Estimate TAM/SAM/SOM for: ${inputs["Market/Niche"] || "the market"} in geography: ${inputs["Geography"] || "Global"}. Return a JSON object with keys: tam (total addressable market), sam (serviceable addressable market), som (serviceable obtainable market). Each should have: value (dollar amount string), methodology (1-2 sentences on how estimated), growth_rate (annual %), confidence (high/medium/low).`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { framework, inputs } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const promptFn = frameworkPrompts[framework];
    if (!promptFn) throw new Error(`Unknown framework: ${framework}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: "You are a strategic analysis AI. Return ONLY valid JSON, no markdown formatting or code blocks. Be specific and data-driven.",
          },
          { role: "user", content: promptFn(inputs) },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "deliver_analysis",
              description: "Return the structured framework analysis result",
              parameters: {
                type: "object",
                properties: {
                  result: {
                    type: "object",
                    description: "The framework analysis result object",
                  },
                },
                required: ["result"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "deliver_analysis" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429)
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      if (response.status === 402)
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    let result;

    if (toolCall) {
      result = JSON.parse(toolCall.function.arguments).result;
    } else {
      // Fallback: try parsing the content directly
      const content = data.choices?.[0]?.message?.content || "";
      try {
        result = JSON.parse(content);
      } catch {
        result = content;
      }
    }

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("framework error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
