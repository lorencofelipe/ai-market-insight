# Phase 2 — Brand Identity & Voice

> Output generated via interactive brainstorming (4 rounds of questions).
> Date: 2026-02-25

---

## 1. Brand Voice Definition

### Core Voice Attributes

| Attribute | What it means | How it sounds |
|-----------|--------------|---------------|
| **Confident** | States facts, doesn't hedge unnecessarily | "Your market is $15B" not "Your market could potentially be around $15B" |
| **Direct** | Gets to the point fast, respects the reader's time | Short sentences. Active voice. No filler words |
| **Clear** | Anyone can understand, no jargon explained by more jargon | "We analyze your competitors" not "We leverage competitive intelligence frameworks" |
| **Warm but professional** | Approachable without being cutesy | "Let's look at your market" not "OMG let's dive in!! 🚀🔥" |
| **Data-first** | Always leads with evidence, not opinions | "$15B TAM based on Gartner 2025" not "The market is huge" |

### Voice Compass: "This, Not That"

| ✅ AI Market Insight sounds like | ❌ AI Market Insight does NOT sound like |
|----------------------------------|----------------------------------------|
| "Your market is worth $2.3B. Here's how we calculated it." | "The market represents a significant opportunity for growth." |
| "We found 6 competitors. Here's how they compare." | "Our AI-powered engine leverages cutting-edge algorithms to..." |
| "This takes 60 seconds." | "Experience the future of market research!!" |
| "No relevant data found for this query. Try narrowing the market." | "Oopsie! We couldn't find anything 😅" |
| "TAM methodology: bottom-up, based on 3 data sources." | "According to the paradigmatic framework of addressable market sizing methodology..." |
| "Describe your idea. We'll handle the rest." | "Reimagine everything. Powered by AI. Built for tomorrow." |

### Tone References

| Brand | What we borrow |
|-------|---------------|
| **Stripe** | Technical clarity without being intimidating. Docs that a developer AND a CEO can read |
| **Notion** | Friendly authority. Makes complex tools feel simple and welcoming |
| **Linear** | Ruthlessly direct. No marketing fluff. Says what it does, does what it says |

### Anti-Tone (What We Actively Avoid)

| Anti-pattern | Why it fails for our audience |
|-------------|-------------------------------|
| **Academic/Dense** | Founders don't have time. Walls of text = instant bounce |
| **Too casual/Childish** | Undermines credibility. Nobody trusts market data from a brand that uses memes |
| **Generic AI speak** | "Powered by AI" means nothing in 2026. Every tool is "powered by AI". It's noise |

---

## 2. Writing Guidelines

### Sentence Structure
- **Lead with the output, not the process.** "6 competitors found" beats "We ran our analysis and identified several key players."
- **One idea per sentence.** If there's a comma and then a new clause, it's probably two sentences.
- **Active voice always.** "We calculate your TAM" not "Your TAM is calculated by our engine."

### Word Choices

| Use | Instead of |
|-----|-----------|
| Shows | Leverages |
| Finds | Surfaces |
| Calculates | Derives |
| Competitors | Competitive landscape actors |
| Market size | Addressable market opportunity |
| Works with | Integrates seamlessly with |
| Fast | In real-time |
| Simple | Intuitive and streamlined |

### Formatting Rules
- **Headlines:** Short, benefit-driven, no periods. Max 8 words
- **Body text:** 2-3 sentences per paragraph max
- **CTAs:** Action verb + outcome. "Get your market report" not "Learn more"
- **Numbers:** Always specific. "$2.3B" not "billions". "6 competitors" not "several"

---

## 3. Visual Identity

### Design Philosophy

> **Clean foundation, colorful data.**
>
> The interface is minimal and spacious (Notion/Linear DNA). Color enters through the data — charts, graphs, badges, and interactive elements. The structure whispers. The insights pop.

### Color Palette

#### Primary Colors
| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| **Background** | White | `#FFFFFF` | Main canvas, content areas |
| **Surface** | Soft Gray | `#F8F9FC` | Cards, panels, secondary backgrounds |
| **Text Primary** | Near Black | `#1A1A2E` | Headlines, body text, critical UI |
| **Text Secondary** | Mid Gray | `#6B7280` | Descriptions, labels, metadata |

#### Accent Colors
| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| **Primary Accent** | Vivid Blue | `#4F46E5` | CTAs, links, active states, primary charts |
| **Success / TAM** | Emerald | `#10B981` | Positive indicators, high confidence badge 🟢 |
| **Warning / Caution** | Amber | `#F59E0B` | Medium confidence badge 🟡, attention states |
| **Danger / Low** | Rose | `#EF4444` | Low confidence badge 🔴, errors |
| **Gradient Accent** | Blue → Purple | `#4F46E5 → #7C3AED` | Hero sections, feature highlights, chart fills |

#### How Color Works in the System

```
┌─────────────────────────────────────────┐
│  White/Gray base (90% of the screen)    │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ 📊 Chart: gradient fills, vivid   │  │
│  │    colors, the data POPS here     │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌──────┐  ┌──────┐  ┌──────┐          │
│  │ 🟢   │  │ 🟡   │  │ 🔴   │ Badges   │
│  │ High │  │ Med  │  │ Low  │          │
│  └──────┘  └──────┘  └──────┘          │
│                                         │
│  [ Get your report → ]  ← Blue CTA     │
│                                         │
└─────────────────────────────────────────┘
```

### Typography

| Role | Font | Weight | Size Range | Fallback |
|------|------|--------|------------|----------|
| **Headings** | Inter | 600 (Semi-bold), 700 (Bold) | 24–48px | system-ui, sans-serif |
| **Body** | Inter | 400 (Regular), 500 (Medium) | 14–18px | system-ui, sans-serif |
| **Data/Numbers** | JetBrains Mono | 500 (Medium) | 14–32px | monospace |
| **Labels/Captions** | Inter | 500 (Medium) | 11–13px | system-ui, sans-serif |

> **Why Inter?** It's the Stripe/Linear/Vercel font. Clean, highly readable at all sizes, supports all languages, free on Google Fonts. No need to be clever with typography when the data is the star.
>
> **Why JetBrains Mono for numbers?** Market data needs to be scannable. Monospace fonts align digits perfectly in tables, making $2,300,000 and $45,000 visually comparable at a glance.

### Spacing & Layout
- **Base unit:** 4px grid
- **Content max-width:** 1200px (centered)
- **Card padding:** 24px
- **Section spacing:** 48–64px
- **Border radius:** 8px (cards), 6px (buttons), 4px (badges)
- **Shadows:** Subtle, low-opacity. `0 1px 3px rgba(0,0,0,0.08)` for cards

### Iconography
- **Style:** Outline, 1.5px stroke (Lucide Icons or Heroicons)
- **Size:** 20px default, 16px inline
- **Color:** Inherits text color, accent color for interactive elements

---

## 4. Brand Samples (Voice + Visual Combined)

### Sample 1: Homepage Hero

```
HEADLINE:    Market intelligence that answers, not echoes.
SUBHEADLINE: Describe your business. Get your market size, 
             competitors, and strategic frameworks — 
             with sources, in one flow.
CTA:         [Get your market report]
```

### Sample 2: LinkedIn Post

```
Founders spend 4 hours building market analyses 
with copy-pasted ChatGPT answers.

The problem isn't the AI. It's the process.

You ask for TAM. Then competitors. Then SWOT. 
Then you realize none of the numbers match.

What if you described your idea once 
and got the full dossier back?

TAM/SAM/SOM. Competitor map. Porter's 5 Forces.
One flow. With sources.

That's what we're building at AI Market Insight.

→ [link]
```

### Sample 3: Welcome Email

```
Subject: Your first market report is 60 seconds away

Hi [name],

Welcome to AI Market Insight.

Here's how it works:
1. Describe your business idea
2. We generate your market dossier
3. You get TAM, competitors, and frameworks — with sources

No prompts to memorize. No tabs to juggle. No data to reconcile.

→ [Create your first report]

— The AI Market Insight team
```

### Sample 4: Feature Announcement (TAM/SAM/SOM)

```
HEADLINE:    Stop Googling your TAM.
BODY:        Market sizing is now live. Describe your market,
             pick your methodology (top-down or bottom-up),
             and get TAM/SAM/SOM calculated with sources.
CTA:         [Calculate your market size]
```

---

## 5. Decisions Made in This Phase

| # | Decision | Alternatives Discarded | Rationale |
|---|----------|----------------------|-----------|
| 1 | Tone: Stripe + Notion + Linear blend | Corporate tone / Casual startup tone | Matches ICP expectations: professional but not intimidating |
| 2 | Visual: Clean minimal + colorful accents | Full dark mode / Full colorful | Clean base = credibility. Color in data = accessibility and delight |
| 3 | Language: English | Portuguese / Bilingual | Global market, simpler typography, larger audience |
| 4 | Anti-patterns: Academic, Casual, Generic AI | Allowing some academic depth | Every anti-pattern directly contradicts our positioning of clarity and trust |
| 5 | Font: Inter + JetBrains Mono | Poppins, Lora, custom fonts | Inter is the proven SaaS standard. JetBrains Mono makes numbers scannable |
| 6 | Color strategy: "Clean canvas, colorful data" | Uniform color application | Data should be the visual hero, not the chrome around it |
