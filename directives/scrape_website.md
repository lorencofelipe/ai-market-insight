# Directive: Website Scraping (Firecrawl)

## Purpose
This directive governs how the orchestrator should scrape external websites to extract structured data and clean markdown. It relies on the `execution/scrape_website.py` script.

## Core Rules
1. **Never scrape manually**: Always use `execution/scrape_website.py`. Do not attempt to use `requests` or `BeautifulSoup` inside the orchestrator flow.
2. **Deterministic output**: The `scrape_website.py` script outputs clean JSON directly to the `.tmp/` directory. This JSON contains the `url`, the timestamp `scraped_at`, the inferred `page_type`, and pure `markdown`.
3. **No Database Writes**: Scraping scripts never save directly to Supabase. They only deposit to `.tmp/`. The `execution/rag_ingest.py` script is fully responsible for indexing scraped JSON documents.

## Usage Format
- **Single URL**: `python execution/scrape_website.py --url https://example.com/pricing`
- **Batch URLs**: `python execution/scrape_website.py --batch "https://example.com,https://example.com/about"`

## Output Schema
The JSON output written to `.tmp/scraped_<domain>_<timestamp>.json` will adhere strictly to:
```json
{
  "url": "https://example.com",
  "scraped_at": "2026-02-24T12:00:00Z",
  "page_type": "unknown",
  "markdown": "# Header\nSome markdown content...",
  "status_code": 200
}
```

## Integration with RAG
Once the file is generated, the agent should invoke `python execution/rag_ingest.py --source-dir .tmp` to automatically embed and index this newly fetched markdown into vector storage.
