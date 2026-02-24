# Chat Analysis

## Goal
Run AI-powered market research conversations. The orchestrator reads a user query, calls the execution script, and returns structured insights.

## Inputs
- `query` (string): The market research question or topic
- `mode` (string, optional): One of `general`, `competitive`, `industry`. Default: `general`

## Script
`execution/chat_analysis.py`

## Usage
```bash
python execution/chat_analysis.py --query "What is the SaaS B2B market size?" --mode general
```

## Outputs
- Streaming text response with market insights
- Saved to `.tmp/chat_<timestamp>.json` for reference

## Edge Cases
- **Rate limits**: If 429 returned, wait 60s and retry (max 3 retries)
- **Empty query**: Reject with clear error message
- **Long responses**: Truncate at 4000 tokens and append "[truncated]"
- **API key missing**: Fail loudly with instructions to check `.env`

## Confidence Levels
All claims should include confidence ratings:
- **High**: Backed by multiple credible sources
- **Medium**: Single source or reasonable inference
- **Low**: Speculative or limited data

## Learnings
<!-- Updated by orchestrator as issues are discovered -->
