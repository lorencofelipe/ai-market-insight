# Coremarket Design System

> Output generated based on `tailwind-design-system` and `ui-ux-pro-max` principles.
> Date: 2026-03-01
> Target: Coremarket Web App (assistant-ui Chat Engine & Tool Calls)

---

## 1. Design Philosophy

### "Clean Canvas, Colorful Data"

The interface is minimal and spacious. The "canvas" (backgrounds, borders, standard text) whispers, while the "data" (badges, metrics, charts, citations) pops.

This aesthetic is specifically chosen for **Founders, Analysts, and Consultants** who suffer from cognitive overload when using complex tools. Authority is established through clarity, not clutter.

---

## 2. Global Tokens & Theming (Tailwind)

### 2.1 Color Palette

#### Foundation (The "Canvas")
| Token | Light Mode/Default | Usage |
|-------|--------------------|-------|
| `--background` | `hsl(0 0% 100%)` (White) | Main app background, clean canvas |
| `--foreground` | `hsl(231 28% 14%)` (Near Black) | Primary readable text |
| `--card` | `hsl(0 0% 100%)` | Floating quote cards, main content containers |
| `--secondary` | `hsl(225 33% 98%)` (Soft Gray) | Alternate backgrounds, Market Sizing cards |
| `--muted-foreground`| `hsl(220 9% 46%)` | Supporting text, source citations |
| `--border` | `hsl(214 32% 91%)` | Subtle dividers, component outlines |

#### Brand & Accent
| Token | Light Mode/Default | Usage |
|-------|--------------------|-------|
| `--primary` | `hsl(243 75% 59%)` (Vivid Blue) | Call-to-actions, active states, focus rings |

#### Data Intelligence & Confidence (The "Colorful Data")
| Token | Value | Meaning / Usage |
|-------|-------|-----------------|
| `--confidence-high`| `hsl(160 84% 39%)` (Emerald) | Verified data, Multiple sources, Positive TAM |
| `--confidence-medium`| `hsl(38 92% 50%)` (Amber) | Estimated data, Warning states |
| `--confidence-low`| `hsl(0 84% 60%)` (Red) | High-variance estimate, Missing data |

---

## 3. Typography Architecture

We use a dual-font system to separate narrative text from raw data.

### 3.1 Primary Font: `Inter`
*Used for: Headers, Body Text, UI Labels, Assistant Messages.*

- **Why:** The industry standard for high-end SaaS (Stripe, Linear). Maximizes cognitive ease.
- **Weights:** 
  - `400` (Regular): Chat messages, long-form text.
  - `500` (Medium): UI labels, button text.
  - `600/700` (Semibold/Bold): Section headers, Card titles.

### 3.2 Data Font: `JetBrains Mono`
*Used for: Financial numbers, TAM/SAM/SOM, Tables, Source URLs.*

- **Why:** Monospace aligns digits perfectly, making $2,300,000 and $45,000 visually comparable instantly. Transmits technical authority and exactness.
- **Weights:**
  - `500` (Medium): Data tables, source references.
  - `700` (Bold): Hero metrics (e.g., the TAM number itself).

---

## 4. UI Primitives & Components (Radix + Custom)

### 4.1 `TrustBadge`
**Purpose:** Reassure the user of data validity instantly.
- **Visuals:** Uses the semantic `confidence` tokens mapped to specific hues.
- **Behavior:** Renders as a small `Badge`. If a `sourceText` is provided, wraps it in a Radix `Tooltip` to show the exact origin on hover.

### 4.2 `FloatingQuoteCard`
**Purpose:** Eliminate the "black box" of AI answers by showing exact extractive quotes.
- **Visuals:** An underlined text piece.
- **Behavior:** Powered by Radix `HoverCard`. On hover, shows a clean popover with the exact quote verbatim, its link, and the `TrustBadge` associated with that specific claim.

### 4.3 `MarketSizingToolCall`
**Purpose:** The visual climax of the product. The transition from chat text to a structured, boardroom-ready report.
- **Visuals:** A structured `Card` overriding the default chat bubble.
- **Typography Execution:**
  - Label: "TOTAL ADDRESSABLE MARKET" (`Inter`, text-xs, muted)
  - Value: "$15B" (`JetBrains Mono`, text-3xl, bold, foreground)

---

## 5. Interaction & UX Rules (ui-ux-pro-max Guidelines)

1. **Clear Distinctions:** Never mix `Inter` and `JetBrains Mono` in the same visual block without clear hierarchy. `JetBrains` is strictly for data output and sources.
2. **Stable Hover States:** Use `transition-colors duration-200`. No layout shifts when hovering over `FloatingQuoteCards`.
3. **Cursor Pointers:** Interactive elements (like cited sources) must always have `cursor-help` or `cursor-pointer`.
4. **Spacing:** Maintain generous padding (e.g., `py-6 px-4` inside chat messages) to give data room to breathe.
5. **No Emojis as UI:** Trust is built on professional iconography. Use `Lucide-React` (e.g., `CheckCircle2`, `AlertTriangle`) instead of emojis.
