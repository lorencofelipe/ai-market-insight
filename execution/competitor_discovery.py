"""
Competitor Discovery — Execution Script
Discovers and profiles competitors in a given market.

Directive: directives/competitor_discovery.md
"""

import argparse
import json
import os
import sys
from datetime import datetime

import requests
from dotenv import load_dotenv

load_dotenv()

API_URL = os.getenv("AI_API_URL", "https://ai.gateway.lovable.dev/v1/chat/completions")
API_KEY = os.getenv("AI_API_KEY") or os.getenv("LOVABLE_API_KEY")

MAX_RETRIES = 3
RETRY_DELAY_SECONDS = 60

TOOL_SPEC = {
    "type": "function",
    "function": {
        "name": "deliver_competitors",
        "description": "Return discovered competitors with structured data",
        "parameters": {
            "type": "object",
            "properties": {
                "competitors": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "name": {"type": "string"},
                            "funding": {"type": "string"},
                            "headcount": {"type": "string"},
                            "pricing": {"type": "string"},
                            "positioning": {"type": "string"},
                            "confidence": {"type": "string", "enum": ["high", "medium", "low"]},
                        },
                        "required": ["name", "funding", "headcount", "pricing", "positioning", "confidence"],
                    },
                },
                "coverage": {
                    "type": "number",
                    "description": "Estimated discovery coverage percentage (0-100)",
                },
            },
            "required": ["competitors", "coverage"],
        },
    },
}


def discover_competitors(query: str) -> dict:
    """Discover competitors in a given market."""
    if not API_KEY:
        print("ERROR: AI_API_KEY or LOVABLE_API_KEY not found in .env", file=sys.stderr)
        sys.exit(1)

    prompt = (
        f'Discover the top 6-8 competitors in this market: "{query}". '
        "For each competitor provide: company name, estimated funding stage/amount, "
        "approximate headcount range, pricing model/range, market positioning, "
        "and your confidence level (high/medium/low) in the data accuracy."
    )

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            resp = requests.post(
                API_URL,
                headers={
                    "Authorization": f"Bearer {API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "google/gemini-3-flash-preview",
                    "messages": [
                        {
                            "role": "system",
                            "content": (
                                "You are a competitive intelligence analyst. "
                                "Discover and analyze competitors in a given market. "
                                "Be specific with real company names, funding amounts, "
                                "and data points where possible."
                            ),
                        },
                        {"role": "user", "content": prompt},
                    ],
                    "tools": [TOOL_SPEC],
                    "tool_choice": {"type": "function", "function": {"name": "deliver_competitors"}},
                },
                timeout=120,
            )

            if resp.status_code == 429:
                print(f"Rate limited (attempt {attempt}/{MAX_RETRIES}). Waiting {RETRY_DELAY_SECONDS}s...")
                import time
                time.sleep(RETRY_DELAY_SECONDS)
                continue

            resp.raise_for_status()
            data = resp.json()

            tool_call = data.get("choices", [{}])[0].get("message", {}).get("tool_calls", [None])[0]
            if tool_call:
                result = json.loads(tool_call["function"]["arguments"])
                result["query"] = query
                result["timestamp"] = datetime.now().isoformat()
                return result

            return {"competitors": [], "coverage": 0, "query": query, "timestamp": datetime.now().isoformat()}

        except requests.RequestException as e:
            print(f"Request error (attempt {attempt}/{MAX_RETRIES}): {e}", file=sys.stderr)
            if attempt == MAX_RETRIES:
                raise

    return {"competitors": [], "coverage": 0, "error": "Max retries exceeded"}


def main():
    parser = argparse.ArgumentParser(description="Discover competitors in a market")
    parser.add_argument("--query", required=True, help="Market or niche description")
    parser.add_argument("--output", help="Output file path (default: .tmp/competitors_<timestamp>.json)")
    args = parser.parse_args()

    result = discover_competitors(args.query)

    # Save to .tmp/
    os.makedirs(".tmp", exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_path = args.output or f".tmp/competitors_{timestamp}.json"

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

    print(f"Saved to: {output_path}")
    print(f"\nFound {len(result.get('competitors', []))} competitors (coverage: {result.get('coverage', 0)}%)")
    for c in result.get("competitors", []):
        print(f"  • {c['name']} — {c['funding']} — {c['confidence']} confidence")


if __name__ == "__main__":
    main()
