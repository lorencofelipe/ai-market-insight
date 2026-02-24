"""
Chat Analysis — Execution Script
Runs AI-powered market research conversations.

Directive: directives/chat_analysis.md
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

SYSTEM_PROMPTS = {
    "general": (
        "You are InsightForge AI, an expert market research analyst. "
        "Provide data-driven, concise market insights with specific numbers, trends, "
        "and actionable intelligence. Structure responses with clear headers and bullet points. "
        "Always cite reasoning and note confidence levels (high/medium/low) for claims."
    ),
    "competitive": (
        "You are InsightForge AI in Competitive Intelligence mode. "
        "Focus on competitor analysis, market positioning, competitive advantages, "
        "pricing strategies, and market share dynamics. Be specific with company names, "
        "funding data, and strategic moves. Rate confidence on each claim."
    ),
    "industry": (
        "You are InsightForge AI in Industry Deep-Dive mode. "
        "Provide comprehensive industry analysis including market size, growth rates, "
        "key trends, regulatory landscape, technology shifts, and value chain analysis. "
        "Use frameworks like Porter's Five Forces where relevant. Include confidence levels."
    ),
}

MAX_RETRIES = 3
RETRY_DELAY_SECONDS = 60


def run_chat(query: str, mode: str = "general") -> dict:
    """Run a chat analysis and return the response."""
    if not API_KEY:
        print("ERROR: AI_API_KEY or LOVABLE_API_KEY not found in .env", file=sys.stderr)
        sys.exit(1)

    system_prompt = SYSTEM_PROMPTS.get(mode, SYSTEM_PROMPTS["general"])
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": query},
    ]

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
                    "messages": messages,
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
            content = data["choices"][0]["message"]["content"]

            return {"query": query, "mode": mode, "response": content, "timestamp": datetime.now().isoformat()}

        except requests.RequestException as e:
            print(f"Request error (attempt {attempt}/{MAX_RETRIES}): {e}", file=sys.stderr)
            if attempt == MAX_RETRIES:
                raise

    return {"error": "Max retries exceeded"}


def main():
    parser = argparse.ArgumentParser(description="Run AI-powered market research chat analysis")
    parser.add_argument("--query", required=True, help="Market research question")
    parser.add_argument("--mode", choices=["general", "competitive", "industry"], default="general")
    parser.add_argument("--output", help="Output file path (default: .tmp/chat_<timestamp>.json)")
    args = parser.parse_args()

    result = run_chat(args.query, args.mode)

    # Save to .tmp/
    os.makedirs(".tmp", exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_path = args.output or f".tmp/chat_{timestamp}.json"

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

    print(f"Saved to: {output_path}")
    print(f"\nResponse:\n{result.get('response', result.get('error', 'No response'))}")


if __name__ == "__main__":
    main()
