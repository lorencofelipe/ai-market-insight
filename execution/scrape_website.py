"""
Website Scraper — Execution Script
Scrapes external websites to extract content as clean markdown and structured data using Firecrawl.

Directive: directives/scrape_website.md
"""

import argparse
import json
import os
import sys
from datetime import datetime
from urllib.parse import urlparse

from dotenv import load_dotenv

try:
    from firecrawl import FirecrawlApp
except ImportError:
    print("ERROR: firecrawl-py is not installed. Run 'pip install firecrawl-py'", file=sys.stderr)
    sys.exit(1)

load_dotenv()

API_KEY = os.getenv("FIRECRAWL_API_KEY")

def get_domain(url: str) -> str:
    """Extract domain from URL for naming files."""
    try:
        domain = urlparse(url).netloc
        if domain.startswith("www."):
            domain = domain[4:]
        return domain.replace(".", "_") if domain else "unknown"
    except Exception:
        return "unknown"


def save_scrape_result(url: str, content: str, status_code: int = 200, error: str | None = None) -> str:
    """Save the single scrape result into .tmp as a JSON document."""
    os.makedirs(".tmp", exist_ok=True)
    domain = get_domain(url)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_path = f".tmp/scraped_{domain}_{timestamp}.json"
    
    # Inferred loosely; PRD 02 agents will use LLMs to strictly classify
    page_type = "unknown"
    if "/pricing" in url.lower():
        page_type = "pricing"
    elif "/about" in url.lower():
        page_type = "about"
    elif "/blog" in url.lower():
        page_type = "blog"
    
    result = {
        "url": url,
        "scraped_at": datetime.now().isoformat() + "Z",
        "page_type": page_type,
        "markdown": content,
        "status_code": status_code
    }
    
    if error:
        result["error"] = error

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    
    return output_path


def scrape_single(url: str) -> str:
    """Scrapes a single website and saves the output."""
    if not API_KEY or API_KEY == "your_firecrawl_api_key_here":
        print("ERROR: FIRECRAWL_API_KEY not found or invalid in .env", file=sys.stderr)
        sys.exit(1)
        
    app = FirecrawlApp(api_key=API_KEY)
    
    print(f"Scraping URL: {url} ...")
    try:
        # We only request markdown for now to keep the payload clean
        scrape_result = app.scrape_url(url, params={'formats': ['markdown']})
        
        md_content = scrape_result.get("markdown", "")
        if not md_content:
            print("WARNING: No markdown content returned.")
        status_code = scrape_result.get("metadata", {}).get("statusCode", 200)

        output_path = save_scrape_result(url, md_content, status_code=status_code)
        print(f"✅ Saved clean markdown for {url} to {output_path}")
        return output_path
        
    except Exception as e:
        print(f"❌ Failed to scrape {url}: {e}", file=sys.stderr)
        output_path = save_scrape_result(url, "", status_code=500, error=str(e))
        return output_path


def scrape_batch(urls: list[str]) -> list[str]:
    """Scrapes multiple URLs. Firecrawl SDK provides batch capabilities, but we output individual files."""
    if not API_KEY or API_KEY == "your_firecrawl_api_key_here":
        print("ERROR: FIRECRAWL_API_KEY not found or invalid in .env", file=sys.stderr)
        sys.exit(1)
        
    app = FirecrawlApp(api_key=API_KEY)
    
    print(f"Starting batch scrape for {len(urls)} URLs...")
    try:
        # Firecrawl native batch scraping
        batch_result = app.async_scrape_urls(urls, params={'formats': ['markdown']})
        
        saved_paths = []
        if batch_result and "data" in batch_result:
            for item in batch_result["data"]:
                url = item.get("metadata", {}).get("sourceURL", "") or item.get("url", "unknown")
                md_content = item.get("markdown", "")
                status_code = item.get("metadata", {}).get("statusCode", 200)
                path = save_scrape_result(url, md_content, status_code=status_code)
                saved_paths.append(path)
                print(f"✅ Saved {url} to {path}")
        else:
            print("WARNING: Unrecognized batch scrape response format.")
        
        return saved_paths

    except Exception as e:
        print(f"❌ Batch scrape failed: {e}", file=sys.stderr)
        return []


def main():
    parser = argparse.ArgumentParser(description="Scrape websites into clean markdown using Firecrawl")
    parser.add_argument("--url", help="Single URL to scrape")
    parser.add_argument("--batch", help="Comma-separated list of URLs to scrape in batch")
    
    args = parser.parse_args()
    
    if args.url:
        scrape_single(args.url)
    elif args.batch:
        urls = [u.strip() for u in args.batch.split(",") if u.strip()]
        if urls:
            scrape_batch(urls)
        else:
            print("ERROR: No valid URLs provided in batch argument.")
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
