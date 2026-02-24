"""
Chat Analysis — Execution Script
Runs AI-powered market research conversations.
Supports RAG (Retrieval-Augmented Generation) when USE_RAG=true.

Directive: directives/chat_analysis.md
"""

import argparse
import hashlib
import json
import os
import sys
from datetime import datetime, timedelta

import requests
from dotenv import load_dotenv

load_dotenv()

API_URL = os.getenv("AI_API_URL", "https://ai.gateway.lovable.dev/v1/chat/completions")
API_KEY = os.getenv("AI_API_KEY") or os.getenv("LOVABLE_API_KEY")
USE_RAG = os.getenv("USE_RAG", "false").lower() == "true"
CACHE_TTL_HOURS = 24

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

RAG_SYSTEM_SUFFIX = (
    "\n\nYou have access to retrieved market intelligence data below. "
    "ALWAYS use this data to ground your response when relevant. "
    "Cite sources using [Source N] notation. "
    "If the retrieved data doesn't cover the question, say so and provide your best analysis. "
    "Never invent data that contradicts the retrieved sources."
)

MAX_RETRIES = 3
RETRY_DELAY_SECONDS = 60


# ---------------------------------------------------------------------------
# RAG helpers (lazy-loaded only when USE_RAG=true)
# ---------------------------------------------------------------------------

def get_rag_context(query: str) -> tuple[str, list[dict]]:
    """Retrieve relevant documents for the query. Returns (context_str, sources)."""
    try:
        from execution.rag_query import query_documents, format_context_for_llm
    except ImportError:
        # Fallback: import from same directory
        sys.path.insert(0, os.path.dirname(__file__))
        from rag_query import query_documents, format_context_for_llm

    result = query_documents(query=query, top_k=5, threshold=0.65)
    documents = result.get("documents", [])

    if not documents:
        return "", []

    context = format_context_for_llm(documents)
    sources = [
        {
            "source": d.get("source", "unknown"),
            "source_type": d.get("source_type", "unknown"),
            "similarity": round(d.get("similarity", 0), 3),
            "preview": d.get("content", "")[:100] + "...",
        }
        for d in documents
    ]

    return context, sources


def check_cache(query: str, mode: str) -> dict | None:
    """Check query cache for a previous response. Returns cached result or None."""
    try:
        from supabase import create_client
    except ImportError:
        return None

    url = os.getenv("VITE_SUPABASE_URL") or os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_KEY")
    if not url or not key:
        return None

    sb = create_client(url, key)
    query_hash = hashlib.md5(f"{query.strip().lower()}:{mode}".encode()).hexdigest()

    result = sb.table("query_cache").select("*").eq("query_hash", query_hash).limit(1).execute()

    if result.data:
        cached = result.data[0]
        # Check TTL
        created = datetime.fromisoformat(cached["created_at"].replace("Z", "+00:00"))
        if datetime.now(created.tzinfo) - created < timedelta(hours=CACHE_TTL_HOURS):
            return {
                "query": cached["query_text"],
                "mode": cached.get("mode", mode),
                "response": cached["response"],
                "sources": cached.get("sources", []),
                "cached": True,
                "timestamp": cached["created_at"],
            }

    return None


def save_to_cache(query: str, mode: str, response: str, sources: list):
    """Save a response to the query cache."""
    try:
        from supabase import create_client
    except ImportError:
        return

    url = os.getenv("VITE_SUPABASE_URL") or os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_KEY")
    if not url or not key:
        return

    sb = create_client(url, key)
    query_hash = hashlib.md5(f"{query.strip().lower()}:{mode}".encode()).hexdigest()

    sb.table("query_cache").upsert({
        "query_hash": query_hash,
        "query_text": query,
        "response": response,
        "sources": sources,
        "mode": mode,
    }, on_conflict="query_hash").execute()


# ---------------------------------------------------------------------------
# Chat
# ---------------------------------------------------------------------------

def run_chat(query: str, mode: str = "general") -> dict:
    """Run a chat analysis and return the response."""
    if not API_KEY:
        print("ERROR: AI_API_KEY or LOVABLE_API_KEY not found in .env", file=sys.stderr)
        sys.exit(1)

    sources = []
    rag_context = ""

    # --- RAG: cache check ---
    if USE_RAG:
        cached = check_cache(query, mode)
        if cached:
            print("✅ Cache hit — returning cached response")
            return cached

        # --- RAG: retrieve context ---
        rag_context, sources = get_rag_context(query)
        if rag_context:
            print(f"📚 RAG: found {len(sources)} relevant sources")
        else:
            print("📭 RAG: no relevant documents found, using LLM only")

    # Build prompt
    system_prompt = SYSTEM_PROMPTS.get(mode, SYSTEM_PROMPTS["general"])
    if rag_context:
        system_prompt += RAG_SYSTEM_SUFFIX

    user_content = query
    if rag_context:
        user_content = (
            f"## Retrieved Market Intelligence\n\n{rag_context}\n\n"
            f"---\n\n## Question\n\n{query}"
        )

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_content},
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

            result = {
                "query": query,
                "mode": mode,
                "response": content,
                "sources": sources,
                "rag_enabled": USE_RAG and bool(rag_context),
                "timestamp": datetime.now().isoformat(),
            }

            # Save to cache
            if USE_RAG:
                save_to_cache(query, mode, content, sources)

            return result

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

    if USE_RAG:
        print("🔍 RAG mode enabled")

    result = run_chat(args.query, args.mode)

    # Save to .tmp/
    os.makedirs(".tmp", exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_path = args.output or f".tmp/chat_{timestamp}.json"

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

    print(f"Saved to: {output_path}")
    if result.get("cached"):
        print("(from cache)")
    print(f"\nResponse:\n{result.get('response', result.get('error', 'No response'))}")

    if result.get("sources"):
        print(f"\n📎 Sources ({len(result['sources'])}):")
        for s in result["sources"]:
            print(f"  • {s['source']} ({s['source_type']}) — {s['similarity']:.0%} match")


if __name__ == "__main__":
    main()
