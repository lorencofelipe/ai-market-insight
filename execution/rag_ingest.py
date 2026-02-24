"""
RAG Ingest — Execution Script
Reads JSON outputs from .tmp/, chunks them, generates local embeddings,
and inserts into Supabase pgvector.

Directive: directives/rag_pipeline.md
"""

import argparse
import json
import os
import sys
import glob
from datetime import datetime

import numpy as np
from dotenv import load_dotenv

load_dotenv()

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")  # service role key for writes
EMBEDDING_MODEL = "BAAI/bge-small-en-v1.5"
MAX_CHUNK_TOKENS = 500

# Lazy-load heavy imports
_model = None
_supabase = None


def get_model():
    """Lazy-load the embedding model (avoids slow startup if not needed)."""
    global _model
    if _model is None:
        from sentence_transformers import SentenceTransformer
        print(f"Loading embedding model: {EMBEDDING_MODEL}...")
        _model = SentenceTransformer(EMBEDDING_MODEL)
    return _model


def get_supabase():
    """Lazy-load the Supabase client."""
    global _supabase
    if _supabase is None:
        from supabase import create_client
        if not SUPABASE_URL or not SUPABASE_KEY:
            print("ERROR: SUPABASE_URL and SUPABASE_SERVICE_KEY required in .env", file=sys.stderr)
            sys.exit(1)
        _supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    return _supabase


# ---------------------------------------------------------------------------
# Chunking strategies per source type
# ---------------------------------------------------------------------------

def chunk_competitor_discovery(data: dict, source_file: str) -> list[dict]:
    """One chunk per competitor."""
    chunks = []
    query = data.get("query", "unknown")

    for i, comp in enumerate(data.get("competitors", [])):
        text = (
            f"Competitor: {comp.get('name', 'Unknown')}\n"
            f"Market query: {query}\n"
            f"Funding: {comp.get('funding', 'N/A')}\n"
            f"Headcount: {comp.get('headcount', 'N/A')}\n"
            f"Pricing: {comp.get('pricing', 'N/A')}\n"
            f"Positioning: {comp.get('positioning', 'N/A')}\n"
            f"Confidence: {comp.get('confidence', 'N/A')}"
        )
        chunks.append({
            "content": text,
            "source": source_file,
            "source_type": "competitor_discovery",
            "metadata": {"query": query, "competitor_name": comp.get("name")},
            "chunk_index": i,
        })

    return chunks


def chunk_framework_analysis(data: dict, source_file: str) -> list[dict]:
    """One chunk per framework section."""
    chunks = []
    framework = data.get("framework", "unknown")
    inputs_data = data.get("inputs", {})

    # If the analysis has sections (e.g. SWOT quadrants)
    analysis = data.get("analysis", {})
    if isinstance(analysis, dict):
        for i, (section, content) in enumerate(analysis.items()):
            text_content = content if isinstance(content, str) else json.dumps(content, ensure_ascii=False)
            text = (
                f"Framework: {framework}\n"
                f"Section: {section}\n"
                f"Context: {json.dumps(inputs_data, ensure_ascii=False)}\n"
                f"Analysis:\n{text_content}"
            )
            chunks.append({
                "content": text,
                "source": source_file,
                "source_type": "framework_analysis",
                "metadata": {"framework": framework, "section": section},
                "chunk_index": i,
            })
    elif isinstance(analysis, str):
        chunks.append({
            "content": f"Framework: {framework}\nAnalysis:\n{analysis}",
            "source": source_file,
            "source_type": "framework_analysis",
            "metadata": {"framework": framework},
            "chunk_index": 0,
        })

    return chunks


def chunk_chat_analysis(data: dict, source_file: str) -> list[dict]:
    """One chunk per chat response."""
    response = data.get("response", "")
    if not response:
        return []

    return [{
        "content": (
            f"Query: {data.get('query', 'N/A')}\n"
            f"Mode: {data.get('mode', 'general')}\n"
            f"Response:\n{response}"
        ),
        "source": source_file,
        "source_type": "chat_analysis",
        "metadata": {"query": data.get("query"), "mode": data.get("mode")},
        "chunk_index": 0,
    }]

def chunk_scrape_website(data: dict, source_file: str) -> list[dict]:
    """Naive chunking for markdown content (approx 2000 chars per chunk)."""
    chunks = []
    markdown = data.get("markdown", "")
    url = data.get("url", "unknown")
    page_type = data.get("page_type", "unknown")
    
    if not markdown:
        return []
        
    chunk_size = 2000
    overlap = 200
    
    start = 0
    chunk_index = 0
    while start < len(markdown):
        end = start + chunk_size
        text_chunk = markdown[start:end]
        
        content = (
            f"Source URL: {url}\n"
            f"Page Type: {page_type}\n"
            f"Content:\n{text_chunk}"
        )
        
        chunks.append({
            "content": content,
            "source": source_file,
            "source_type": "scrape_website",
            "metadata": {"url": url, "page_type": page_type},
            "chunk_index": chunk_index,
        })
        
        start = end - overlap
        chunk_index += 1
        
    return chunks


# ---------------------------------------------------------------------------
# Detect source type from JSON content
# ---------------------------------------------------------------------------

def detect_source_type(data: dict) -> str:
    """Detect what kind of script produced this JSON."""
    if "competitors" in data:
        return "competitor_discovery"
    if "framework" in data or "analysis" in data:
        return "framework_analysis"
    if "response" in data and "mode" in data:
        return "chat_analysis"
    if "markdown" in data and "url" in data:
        return "scrape_website"
    return "unknown"


def chunk_data(data: dict, source_file: str, source_type: str) -> list[dict]:
    """Route to appropriate chunking strategy."""
    if source_type == "competitor_discovery":
        return chunk_competitor_discovery(data, source_file)
    elif source_type == "framework_analysis":
        return chunk_framework_analysis(data, source_file)
    elif source_type == "chat_analysis":
        return chunk_chat_analysis(data, source_file)
    elif source_type == "scrape_website":
        return chunk_scrape_website(data, source_file)
    else:
        # Generic: treat entire JSON as one chunk
        return [{
            "content": json.dumps(data, indent=2, ensure_ascii=False),
            "source": source_file,
            "source_type": source_type,
            "metadata": {},
            "chunk_index": 0,
        }]


# ---------------------------------------------------------------------------
# Embedding & Insert
# ---------------------------------------------------------------------------

def generate_embeddings(texts: list[str]) -> list[list[float]]:
    """Generate embeddings for a batch of texts using local model."""
    model = get_model()
    embeddings = model.encode(texts, normalize_embeddings=True, show_progress_bar=False)
    return embeddings.tolist()


def is_already_indexed(source_file: str) -> bool:
    """Check if a source file has already been indexed."""
    sb = get_supabase()
    result = sb.table("documents").select("id").eq("source", source_file).limit(1).execute()
    return len(result.data) > 0


def insert_chunks(chunks: list[dict]) -> int:
    """Generate embeddings and insert chunks into Supabase."""
    if not chunks:
        return 0

    texts = [c["content"] for c in chunks]
    embeddings = generate_embeddings(texts)

    sb = get_supabase()
    rows = []
    for chunk, emb in zip(chunks, embeddings):
        rows.append({
            "content": chunk["content"],
            "embedding": emb,
            "source": chunk["source"],
            "source_type": chunk["source_type"],
            "metadata": chunk["metadata"],
            "chunk_index": chunk["chunk_index"],
        })

    # Batch insert
    sb.table("documents").insert(rows).execute()
    return len(rows)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def ingest_directory(source_dir: str, force: bool = False) -> dict:
    """Ingest all JSON files from a directory."""
    json_files = glob.glob(os.path.join(source_dir, "*.json"))

    if not json_files:
        print(f"No JSON files found in {source_dir}")
        return {"files": 0, "chunks": 0}

    total_chunks = 0
    total_files = 0

    for filepath in json_files:
        filename = os.path.basename(filepath)

        # Skip if already indexed (unless force)
        if not force and is_already_indexed(filename):
            print(f"  ⏭️  {filename} — already indexed, skipping")
            continue

        try:
            with open(filepath, "r", encoding="utf-8") as f:
                data = json.load(f)
        except (json.JSONDecodeError, IOError) as e:
            print(f"  ❌ {filename} — failed to read: {e}")
            continue

        source_type = detect_source_type(data)
        if source_type == "unknown":
            print(f"  ⚠️  {filename} — unknown format, skipping")
            continue

        chunks = chunk_data(data, filename, source_type)
        if not chunks:
            print(f"  ⚠️  {filename} — no chunks generated")
            continue

        count = insert_chunks(chunks)
        total_chunks += count
        total_files += 1
        print(f"  ✅ {filename} — {count} chunks ({source_type})")

    return {"files": total_files, "chunks": total_chunks}


def main():
    parser = argparse.ArgumentParser(description="Ingest JSON data into RAG vector store")
    parser.add_argument("--source-dir", default=".tmp", help="Directory with JSON files (default: .tmp)")
    parser.add_argument("--force", action="store_true", help="Re-index even if already indexed")
    args = parser.parse_args()

    print(f"RAG Ingest — scanning {args.source_dir}/")
    result = ingest_directory(args.source_dir, force=args.force)
    print(f"\nDone: ingested {result['chunks']} chunks from {result['files']} files")


if __name__ == "__main__":
    main()
