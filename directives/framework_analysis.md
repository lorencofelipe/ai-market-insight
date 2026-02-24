# Framework Analysis

## Goal
Run strategic analysis frameworks (SWOT, Porter's Five Forces, TAM/SAM/SOM) on a given company, product, or market.

## Inputs
- `framework` (string): One of `swot`, `porters`, `tam`
- `inputs` (dict): Framework-specific inputs (see below)

### Input Fields by Framework

| Framework | Field 1 | Field 2 |
|-----------|---------|---------|
| `swot` | Company/Product | Market Context |
| `porters` | Industry/Market | Key Players |
| `tam` | Market/Niche | Geography |

## Script
`execution/framework_analysis.py`

## Usage
```bash
python execution/framework_analysis.py --framework swot --inputs '{"Company/Product": "Slack", "Market Context": "Enterprise communication"}'
```

## Outputs
JSON file at `.tmp/framework_<framework>_<timestamp>.json`

### SWOT Output
```json
{
  "strengths": ["...", "..."],
  "weaknesses": ["...", "..."],
  "opportunities": ["...", "..."],
  "threats": ["...", "..."]
}
```

### Porter's Output
```json
{
  "supplier_power": { "rating": 3, "analysis": "...", "key_factors": ["..."] },
  "buyer_power": { "rating": 4, "analysis": "...", "key_factors": ["..."] },
  "competitive_rivalry": { "rating": 5, "analysis": "...", "key_factors": ["..."] },
  "threat_of_substitution": { "rating": 2, "analysis": "...", "key_factors": ["..."] },
  "threat_of_new_entry": { "rating": 3, "analysis": "...", "key_factors": ["..."] }
}
```

### TAM/SAM/SOM Output
```json
{
  "tam": { "value": "$50B", "methodology": "...", "growth_rate": "12%", "confidence": "medium" },
  "sam": { "value": "$12B", "methodology": "...", "growth_rate": "15%", "confidence": "medium" },
  "som": { "value": "$800M", "methodology": "...", "growth_rate": "20%", "confidence": "low" }
}
```

## Edge Cases
- **Unknown framework**: Reject with list of valid frameworks
- **Missing inputs**: Use defaults and note in output
- **Rate limits**: Wait 60s and retry (max 3)
- **Invalid JSON from AI**: Retry once, then return raw text with warning

## Learnings
<!-- Updated by orchestrator as issues are discovered -->
