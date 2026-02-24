# Scrape Website

## Goal
Scrape a single website for market intelligence data (pricing pages, about pages, product features, etc.)

## Inputs
- `url` (string): Target URL to scrape
- `extract` (string, optional): What to extract — `pricing`, `features`, `about`, `all`. Default: `all`

## Script
`execution/scrape_single_site.py` *(not yet implemented)*

## Usage
```bash
python execution/scrape_single_site.py --url "https://example.com/pricing" --extract pricing
```

## Outputs
JSON file at `.tmp/scrape_<domain>_<timestamp>.json`:
```json
{
  "url": "https://example.com/pricing",
  "extracted_at": "2026-02-24T12:00:00Z",
  "data": { ... }
}
```

## Edge Cases
- **403/Blocked**: Log and skip, note in output
- **JavaScript-heavy pages**: May need headless browser — flag for manual review
- **Rate limiting**: Respect robots.txt, add 2s delay between requests
- **Large pages**: Truncate content at 50KB

## Status
🔲 Not yet implemented — template only

## Learnings
<!-- Updated by orchestrator as issues are discovered -->
