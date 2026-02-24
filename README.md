# AI Market Insight

AI-powered market research and competitive intelligence platform.

## Architecture

This project follows a **3-Layer Architecture** (see [Gemini.md](Gemini.md)):

| Layer | Purpose | Location |
|-------|---------|----------|
| **Directives** | SOPs in Markdown — what to do | `directives/` |
| **Orchestration** | AI decision-making — routing & error handling | (AI agent) |
| **Execution** | Deterministic Python scripts — doing the work | `execution/` |

## Project Structure

```
ai-market-insight/
├── Gemini.md               # Architecture specification
├── directives/             # SOPs (Standard Operating Procedures)
│   ├── chat_analysis.md
│   ├── competitor_discovery.md
│   ├── framework_analysis.md
│   └── scrape_website.md
├── execution/              # Python scripts (deterministic tools)
│   ├── requirements.txt
│   ├── chat_analysis.py
│   ├── competitor_discovery.py
│   └── framework_analysis.py
├── .tmp/                   # Intermediate files (never committed)
├── frontend/               # React/Vite web application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
├── supabase/               # Supabase Edge Functions
│   └── functions/
└── .env                    # API keys and environment variables
```

## Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Execution Scripts
```bash
pip install -r execution/requirements.txt
python execution/competitor_discovery.py --query "B2B SaaS analytics"
python execution/framework_analysis.py --framework swot --inputs '{"Company/Product": "Slack", "Market Context": "Enterprise communication"}'
python execution/chat_analysis.py --query "What is the cloud infrastructure market size?" --mode industry
```

## Key Principles

1. **Directives are living documents** — Updated as the system learns
2. **Execution is deterministic** — Python scripts handle all API calls and data processing
3. **Self-annealing** — Errors are learning opportunities; fix → update tool → update directive
4. **Deliverables live in the cloud** — Google Sheets, Slides, etc.
5. **Local files are for processing** — Everything in `.tmp/` can be regenerated

## Technologies

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn-ui
- **Backend**: Supabase Edge Functions
- **Execution**: Python 3.10+
- **AI**: Gemini via Lovable AI Gateway
