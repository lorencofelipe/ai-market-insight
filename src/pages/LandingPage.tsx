import { useState, useEffect } from "react";
import { ArrowRight, BarChart3, Search, GitFork, FileCheck, ChevronRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const LandingPage = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [waitlistCount, setWaitlistCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase
        .from("waitlist")
        .select("*", { count: "exact", head: true });
      if (count !== null) setWaitlistCount(count);
    };
    fetchCount();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    setError("");

    try {
      const { error: insertError } = await supabase
        .from("waitlist")
        .insert({ email, source: "landing_page" });

      if (insertError) {
        if (insertError.code === "23505") {
          setError("You're already on the waitlist!");
        } else {
          setError("Something went wrong. Please try again.");
        }
      } else {
        setSubmitted(true);
        setWaitlistCount((prev) => prev + 1);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#1A1A2E]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#4F46E5]" />
            <span className="font-semibold text-lg tracking-tight">AI Market Insight</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-[#6B7280]">
            <a href="#features" className="hover:text-[#1A1A2E] transition-colors cursor-pointer">Features</a>
            <a href="#how-it-works" className="hover:text-[#1A1A2E] transition-colors cursor-pointer">How it works</a>
          </div>
          <a
            href="#waitlist"
            className="bg-[#4F46E5] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4338CA] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            Join waitlist
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </nav>

      {/* Section 1: Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
              You've spent hours on market research and still don't trust your{" "}
              <span className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent">
                numbers
              </span>
            </h1>
            <p className="text-lg md:text-xl text-[#6B7280] leading-relaxed max-w-2xl mx-auto mb-8">
              Describe your idea once. Get the full market dossier — TAM, competitors, and strategic frameworks. With sources. In one flow.
            </p>
            <a
              href="#waitlist"
              className="inline-flex items-center gap-2 bg-[#4F46E5] text-white px-8 py-3.5 rounded-xl text-base font-medium hover:bg-[#4338CA] transition-all hover:shadow-lg hover:shadow-[#4F46E5]/25 cursor-pointer"
            >
              Join the waitlist
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Demo mockup */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#F8F9FC] rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-200 bg-white">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-3 text-xs text-[#6B7280]">AI Market Insight</span>
              </div>
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                  {/* Input side */}
                  <div className="md:w-2/5">
                    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                      <label className="text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-2 block">
                        Your idea
                      </label>
                      <p className="text-[#1A1A2E] font-medium mb-4">
                        "B2B SaaS for HR teams"
                      </p>
                      <div className="bg-[#4F46E5] text-white text-sm font-medium px-4 py-2 rounded-lg inline-flex items-center gap-2 cursor-default">
                        <Search className="w-3.5 h-3.5" />
                        Analyze
                      </div>
                    </div>
                  </div>

                  {/* Output side */}
                  <div className="md:w-3/5 space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                        <p className="text-xs text-[#6B7280] mb-1">TAM</p>
                        <p className="text-xl font-bold font-mono text-[#1A1A2E]">$8.2B</p>
                        <p className="text-2xs text-[#6B7280] mt-1">Gartner '25</p>
                      </div>
                      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                        <p className="text-xs text-[#6B7280] mb-1">SAM</p>
                        <p className="text-xl font-bold font-mono text-[#1A1A2E]">$1.8B</p>
                        <p className="text-2xs text-[#6B7280] mt-1">North America</p>
                      </div>
                      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                        <p className="text-xs text-[#6B7280] mb-1">SOM</p>
                        <p className="text-xl font-bold font-mono text-[#1A1A2E]">$36M</p>
                        <p className="text-2xs text-[#6B7280] mt-1">3yr target</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <div className="bg-white rounded-lg border border-gray-200 px-3 py-2 text-sm flex items-center gap-2 shadow-sm">
                        <Search className="w-3.5 h-3.5 text-[#4F46E5]" />
                        <span className="font-medium">6</span>
                        <span className="text-[#6B7280]">competitors found</span>
                      </div>
                      <div className="bg-white rounded-lg border border-gray-200 px-3 py-2 text-sm flex items-center gap-2 shadow-sm">
                        <FileCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-[#6B7280]">SWOT</span>
                        <span className="font-medium text-emerald-600">Complete</span>
                      </div>
                      <div className="bg-white rounded-lg border border-gray-200 px-3 py-2 text-sm flex items-center gap-2 shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-[#6B7280]">High confidence</span>
                      </div>
                    </div>
                    <p className="text-xs text-[#6B7280] pt-1">Generated in 47 seconds</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: How it works */}
      <section id="how-it-works" className="py-20 md:py-28 px-6 bg-[#F8F9FC]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 tracking-tight">
            How it works
          </h2>
          <p className="text-[#6B7280] text-center mb-12 md:mb-16 text-lg max-w-xl mx-auto">
            From idea to market dossier in three steps.
          </p>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                step: "01",
                title: "Describe your idea",
                description: "Tell us what you're building or researching. One sentence is enough.",
                icon: <Search className="w-5 h-5" />,
              },
              {
                step: "02",
                title: "We analyze the market",
                description: "Our engine calculates market size, maps competitors, and runs strategic frameworks — automatically.",
                icon: <GitFork className="w-5 h-5" />,
              },
              {
                step: "03",
                title: "Get your dossier",
                description: "A structured report with TAM/SAM/SOM, competitor profiles, SWOT, Porter's 5 Forces — all with sources.",
                icon: <FileCheck className="w-5 h-5" />,
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#4F46E5]/10 flex items-center justify-center text-[#4F46E5]">
                    {item.icon}
                  </div>
                  <span className="text-sm font-mono font-medium text-[#6B7280]">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-[#6B7280] leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Features */}
      <section id="features" className="py-20 md:py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 tracking-tight">
            Everything you need to validate your market
          </h2>
          <p className="text-[#6B7280] text-center mb-12 md:mb-16 text-lg max-w-xl mx-auto">
            No prompts to memorize. No tabs to juggle.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: <BarChart3 className="w-5 h-5" />,
                title: "Market Sizing",
                description: "TAM, SAM, and SOM calculated with transparent methodology. Top-down or bottom-up. Not a guess — a calculation.",
                color: "bg-[#4F46E5]",
              },
              {
                icon: <Search className="w-5 h-5" />,
                title: "Competitor Discovery",
                description: "Find who you're up against. Funding, headcount, pricing, positioning — profiled and compared side by side.",
                color: "bg-emerald-500",
              },
              {
                icon: <GitFork className="w-5 h-5" />,
                title: "Strategic Frameworks",
                description: "SWOT, Porter's 5 Forces, BCG Matrix — generated automatically. Ready for your pitch deck.",
                color: "bg-[#7C3AED]",
              },
              {
                icon: <FileCheck className="w-5 h-5" />,
                title: "Sources, Not Guesses",
                description: "Every data point comes with its source. Confidence badges so you know what to trust and what to question.",
                color: "bg-amber-500",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-[#F8F9FC] rounded-2xl border border-gray-100 p-8 hover:border-gray-200 transition-colors group"
              >
                <div className={`w-10 h-10 rounded-xl ${feature.color} flex items-center justify-center text-white mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-[#4F46E5] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-[#6B7280] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Social Proof (Framework Authority) */}
      <section className="py-20 md:py-28 px-6 bg-[#F8F9FC]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Built on frameworks that work
          </h2>
          <p className="text-[#6B7280] text-lg mb-10 max-w-2xl mx-auto">
            These aren't our inventions. They've been used by the world's top consultancies for decades. We just made them accessible to everyone.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {[
              "Porter's 5 Forces",
              "BCG Matrix",
              "SWOT Analysis",
              "TAM / SAM / SOM",
              "PESTEL",
            ].map((framework) => (
              <span
                key={framework}
                className="bg-white border border-gray-200 rounded-full px-5 py-2.5 text-sm font-medium text-[#1A1A2E] shadow-sm"
              >
                {framework}
              </span>
            ))}
          </div>

          <p className="text-[#6B7280] text-sm italic">
            The same frameworks used by McKinsey, Bain, and BCG — without the $50K invoice.
          </p>
        </div>
      </section>

      {/* Section 5: Final CTA / Waitlist */}
      <section id="waitlist" className="py-20 md:py-28 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Your market report is almost ready
          </h2>
          <p className="text-[#6B7280] text-lg mb-8">
            Join the waitlist for early access.
          </p>

          {!submitted ? (
            <>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@startup.com"
                  required
                  disabled={submitting}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white text-[#1A1A2E] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all text-base disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#4F46E5] text-white px-6 py-3 rounded-xl text-base font-medium hover:bg-[#4338CA] transition-all hover:shadow-lg hover:shadow-[#4F46E5]/25 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      Join waitlist
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
              {error && (
                <p className="text-sm text-amber-600 mb-3">{error}</p>
              )}
            </>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-6 py-4 max-w-md mx-auto mb-4">
              <p className="text-emerald-700 font-medium">
                You're in. We'll notify you when early access opens.
              </p>
            </div>
          )}

          <p className="text-sm text-[#6B7280]">
            No spam. Just early access and your first free market report.
          </p>
          {waitlistCount > 0 && (
            <p className="text-xs text-[#6B7280] mt-2">
              Join {waitlistCount} others on the waitlist
            </p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#4F46E5]" />
            <span className="font-semibold tracking-tight">AI Market Insight</span>
          </div>
          <p className="text-sm text-[#6B7280]">
            Market intelligence for people who need answers, not prompts.
          </p>
          <p className="text-xs text-[#6B7280]">
            © 2026 AI Market Insight
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
