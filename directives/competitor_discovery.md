# Competitor Discovery

## Goal
Discover and profile competitors in a given market or niche. Returns structured data with confidence levels for each data point.

## Inputs
- `query` (string): Market description, e.g. "B2B SaaS analytics"

## Script
`execution/competitor_discovery.py`

## Usage
```bash
python execution/competitor_discovery.py --query "B2B SaaS analytics"
```

## Outputs
JSON file at `.tmp/competitors_<timestamp>.json`:
```json
{
  "competitors": [
    {
      "name": "Acme Analytics",
      "funding": "$45M Series B",
      "headcount": "120-150",
      "pricing": "$99-499/mo",
      "positioning": "Enterprise analytics",
      "confidence": "high"
    }
  ],
  "coverage": 72
}
```

## Expected Results
- 6-8 competitors per query
- Each with: name, funding, headcount, pricing, positioning, confidence
- Coverage score (0-100) estimating how complete the discovery is

## Edge Cases
- **Niche markets**: May return fewer competitors — that's ok, note low coverage
- **Rate limits**: Wait 60s and retry (max 3)
- **No results**: Return empty array with coverage=0 and log warning
- **Ambiguous query**: Ask orchestrator for clarification before running

## Learnings
<!-- Updated by orchestrator as issues are discovered -->
