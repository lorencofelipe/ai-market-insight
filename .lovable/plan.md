

# Apply CRM UI Kit Design System to InsightForge AI

## Overview
Redesign the entire app to match the clean, light-themed CRM/SaaS UI Kit from the reference image. This replaces the current Bloomberg-style dark theme with a modern, polished SaaS aesthetic featuring soft blues, rounded elements, and clean typography.

## Key Design Changes

### 1. Typography
- Switch to **Lato** font family (the kit's primary font) for headings and body
- Remove JetBrains Mono / Source Sans Pro / Source Code Pro
- Clean heading hierarchy: H1-H6 with Lato Bold weights
- Body text in Lato Regular 400/600

### 2. Color Palette (from the UI Kit)
- **Primary**: Soft indigo-blue (~#6366F1 / indigo-500)
- **Success/High**: Soft green (~#22C55E)
- **Warning/Medium**: Amber/yellow (~#F59E0B)
- **Danger/Low**: Soft red (~#EF4444)
- **Background**: Clean white (#FFFFFF)
- **Card**: White with subtle border (#F8FAFC)
- **Muted text**: Slate gray (#94A3B8)
- **Borders**: Very light gray (#E2E8F0)
- Remove dark mode defaults; light mode as primary

### 3. Component Styling Updates
- **Buttons**: Rounded pill-style (border-radius: full or large), solid primary fills, outline variants, soft color variants (green, red, yellow, blue)
- **Cards**: White background, subtle shadow, light border, slightly rounded corners
- **Badges/Tags**: Colorful pill badges with soft backgrounds (green, orange, red, blue, gray)
- **Inputs**: Clean bordered inputs with subtle focus rings, label above
- **Tables**: Light header background, clean row borders, comfortable padding
- **Progress bars**: Thin colored bars
- **Avatars**: Rounded with colored backgrounds
- **Pagination**: Pill-style page numbers with active state highlight

### 4. Files to Modify

**`src/index.css`** — Complete color variable overhaul:
- Replace dark theme HSL values with light CRM kit palette
- Update font imports (add Lato, remove Source families)
- Update scrollbar styling for light theme
- Adjust shadow variables for softer, more elevated feel

**`tailwind.config.ts`** — Font family update:
- Change sans to Lato stack
- Adjust border-radius defaults (more rounded)
- Update any custom color references

**`src/components/ui/button.tsx`** — Rounded pill style:
- Increase border-radius to `rounded-full` or `rounded-lg`
- Add soft color variant buttons (success, warning, info)

**`src/components/ui/badge.tsx`** — Pill badges:
- Add color variants matching the kit (green, amber, red, blue)
- Softer background colors with matching text

**`src/components/ui/card.tsx`** — Light card style:
- White background, subtle shadow, softer border

**`src/components/ui/input.tsx`** — Clean input styling:
- Lighter background, cleaner border, softer focus state

**`src/components/layout/BottomTabs.tsx`** — Light navigation bar:
- White/light background, indigo active state

**`src/components/layout/DesktopSidebar.tsx`** — Light sidebar:
- White sidebar, soft active highlight, clean typography

**`src/pages/Dashboard.tsx`** — Update chart colors, card styles:
- Use indigo/blue tones for charts instead of Bloomberg blue
- Lighter card backgrounds, cleaner metric presentation

**`src/pages/Chat.tsx`** — Clean chat bubbles:
- White cards, soft primary tint for user messages

**`src/pages/Frameworks.tsx`** — Softer SWOT colors:
- Match the UI kit's green/red/blue/amber palette

**`src/pages/Discovery.tsx`** — Clean table design:
- Light header, comfortable row spacing

**`src/pages/Sources.tsx`** — Clean audit table:
- Same light table treatment

### 5. Summary of Visual Transformation
- From: Dark, dense, Bloomberg terminal aesthetic
- To: Clean, bright, modern SaaS dashboard with soft colors, rounded elements, and generous whitespace
- Typography shifts from monospace-heavy to clean sans-serif (Lato)
- Color palette shifts from amber/gold primary to indigo/blue primary with colorful accent badges

