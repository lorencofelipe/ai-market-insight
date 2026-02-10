

# InsightForge AI — Phase 1 Core App

## Overview
A mobile-first, data-dense market research and competitive intelligence platform powered by real AI (Lovable AI Gateway). No auth required. Bloomberg-inspired dark UI with dense information panels, charts, and tables.

---

## Pages & Features

### 1. Dashboard (Home)
- **Market Pulse** — summary cards showing key metrics: active research projects, recent insights count, discovery coverage scores
- **Recent Activity Feed** — timeline of latest AI-generated insights, competitor alerts, and framework analyses
- **Quick Action Bar** — one-tap access to start a new analysis, run a framework, or ask a research question
- **Trending Signals** — mini charts showing market trend indicators from recent analyses

### 2. AI Research Chat
- **Streaming AI Chat** — ask market research questions and get real-time streamed responses with source citations
- **Context Modes** — toggle between general market research, competitive analysis, and industry deep-dive
- **Citation Cards** — every AI response shows clickable source attributions with confidence scores
- **Save to Project** — pin important insights from chat to a project for later reference

### 3. Strategic Frameworks
- **Framework Library** — Porter's Five Forces, SWOT Analysis, TAM/SAM/SOM sizing templates
- **Guided Wizard** — step-by-step input flow: define business question → set hypotheses → AI fills in the framework with evidence
- **Visual Output** — each framework rendered as interactive, data-dense visual (e.g., Porter's as a force diagram, SWOT as a quadrant grid)
- **Export-Ready** — formatted output suitable for copy/paste into presentations

### 4. Competitive Discovery
- **Competitor Table** — dense, sortable table of discovered competitors with key attributes (funding, headcount, pricing, positioning)
- **AI-Powered Search** — enter a market/niche and AI discovers competitors beyond just Google results
- **Coverage Score** — transparent metric showing estimated discovery completeness (e.g., "~65% coverage")
- **Comparison Matrix** — side-by-side feature/pricing comparison grid for selected competitors

### 5. Evidence & Audit Panel
- **Source Library** — all sources referenced across analyses, with credibility scores and timestamps
- **Confidence Indicators** — color-coded confidence levels (high/medium/low) on every insight
- **Audit Trail** — for each insight, trace back through the reasoning chain: claim → evidence → source → confidence score

---

## Design System
- **Dark mode by default** — Bloomberg/terminal-inspired dark theme with high-contrast data elements
- **Dense layout** — compact cards, tight spacing, small but readable typography optimized for information density
- **Color coding** — green/amber/red for confidence levels; blue accent for interactive elements
- **Mobile-first** — bottom tab navigation, swipeable panels, collapsible sections for mobile; sidebar layout on desktop
- **Charts** — Recharts for trend lines, bar charts, and radar diagrams within frameworks

## Navigation
- **Mobile**: Bottom tab bar with 5 tabs — Dashboard, Chat, Frameworks, Discovery, Sources
- **Desktop**: Collapsible sidebar with the same navigation items

## AI Backend
- **Lovable Cloud + Lovable AI Gateway** — edge functions calling Gemini 3 Flash for streaming chat, framework analysis, and competitor discovery
- **Multiple edge functions**: one for chat streaming, one for framework generation, one for competitor discovery
- **All responses include structured citations** via tool calling for auditability

