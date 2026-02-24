"""
Framework Analysis — Execution Script
Runs strategic analysis frameworks: SWOT, Porter's Five Forces, TAM/SAM/SOM.

Directive: directives/framework_analysis.md
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

FRAMEWORK_PROMPTS = {
    "swot": lambda inputs: (
        f"Perform a comprehensive SWOT analysis for: "
        f"{inputs.get('Company/Product', 'the company')} in the context of: "
        f"{inputs.get('Market Context', 'their market')}. "
        "Return a JSON object with keys: strengths, weaknesses, opportunities, threats. "
        "Each key should have an array of 4-6 specific, data-informed bullet points. "
        "Be concrete with market data where possible."
    ),
    "porters": lambda inputs: (
        f"Analyze Porter's Five Forces for the industry: "
        f"{inputs.get('Industry/Market', 'the industry')} with key players: "
        f"{inputs.get('Key Players', 'major players')}. "
        "Return a JSON object with keys: supplier_power, buyer_power, competitive_rivalry, "
        "threat_of_substitution, threat_of_new_entry. Each should have: rating (1-5), "
        "analysis (2-3 sentences), key_factors (array of strings)."
    ),
    "tam": lambda inputs: (
        f"Estimate TAM/SAM/SOM for: {inputs.get('Market/Niche', 'the market')} "
        f"in geography: {inputs.get('Geography', 'Global')}. "
        "Return a JSON object with keys: tam, sam, som. Each should have: "
        "value (dollar amount string), methodology (1-2 sentences), "
        "growth_rate (annual %), confidence (high/medium/low)."
    ),
}

TOOL_SPEC = {
    "type": "function",
    "function": {
        "name": "deliver_analysis",
        "description": "Return the structured framework analysis result",
        "parameters": {
            "type": "object",
            "properties": {
                "result": {
                    "type": "object",
                    "description": "The framework analysis result object",
                },
            },
            "required": ["result"],
        },
    },
}


def run_framework(framework: str, inputs: dict) -> dict:
    """Run a strategic analysis framework."""
    if not API_KEY:
        print("ERROR: AI_API_KEY or LOVABLE_API_KEY not found in .env", file=sys.stderr)
        sys.exit(1)

    prompt_fn = FRAMEWORK_PROMPTS.get(framework)
    if not prompt_fn:
        valid = ", ".join(FRAMEWORK_PROMPTS.keys())
        print(f"ERROR: Unknown framework '{framework}'. Valid: {valid}", file=sys.stderr)
        sys.exit(1)

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
                                "You are a strategic analysis AI. Return ONLY valid JSON, "
                                "no markdown formatting or code blocks. Be specific and data-driven."
                            ),
                        },
                        {"role": "user", "content": prompt_fn(inputs)},
                    ],
                    "tools": [TOOL_SPEC],
                    "tool_choice": {"type": "function", "function": {"name": "deliver_analysis"}},
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
                result = json.loads(tool_call["function"]["arguments"]).get("result", {})
            else:
                # Fallback: try parsing the content directly
                content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
                try:
                    result = json.loads(content)
                except json.JSONDecodeError:
                    result = content

            return {
                "framework": framework,
                "inputs": inputs,
                "result": result,
                "timestamp": datetime.now().isoformat(),
            }

        except requests.RequestException as e:
            print(f"Request error (attempt {attempt}/{MAX_RETRIES}): {e}", file=sys.stderr)
            if attempt == MAX_RETRIES:
                raise

    return {"error": "Max retries exceeded"}


def main():
    parser = argparse.ArgumentParser(description="Run strategic framework analysis")
    parser.add_argument("--framework", required=True, choices=["swot", "porters", "tam"],
                        help="Framework to run")
    parser.add_argument("--inputs", required=True,
                        help='JSON string of inputs, e.g. \'{"Company/Product": "Slack"}\'')
    parser.add_argument("--output", help="Output file path")
    args = parser.parse_args()

    try:
        inputs = json.loads(args.inputs)
    except json.JSONDecodeError as e:
        print(f"ERROR: Invalid JSON for --inputs: {e}", file=sys.stderr)
        sys.exit(1)

    result = run_framework(args.framework, inputs)

    # Save to .tmp/
    os.makedirs(".tmp", exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_path = args.output or f".tmp/framework_{args.framework}_{timestamp}.json"

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

    print(f"Saved to: {output_path}")
    print(f"\nResult:\n{json.dumps(result.get('result', {}), indent=2)}")


if __name__ == "__main__":
    main()
