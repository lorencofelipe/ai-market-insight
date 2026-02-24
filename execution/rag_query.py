"""
RAG Query — Execution Script
Embeds a query, searches Supabase pgvector for similar documents,
and applies MMR for diversity.

Directive: directives/rag_pipeline.md
"""

import argparse
import json
import os
import sys
from datetime import datetime

import numpy as np
from dotenv import load_dotenv

load_dotenv()

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
EMBEDDING_MODEL = "BAAI/bge-small-en-v1.5"
DEFAULT_THRESHOLD = 0.65
DEFAULT_TOP_K = 5
DEFAULT_FETCH_K = 20

_model = None
_supabase = None


def get_model():
    global _model
    if _model is None:
        from sentence_transformers import SentenceTransformer
        _model = SentenceTransformer(EMBEDDING_MODEL)
    return _model


def get_supabase():
    global _supabase
    if _supabase is None:
        from supabase import create_client
        if not SUPABASE_URL or not SUPABASE_KEY:
            print("ERROR: SUPABASE_URL and SUPABASE_SERVICE_KEY required in .env", file=sys.stderr)
            sys.exit(1)
        _supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    return _supabase


# ---------------------------------------------------------------------------
# MMR (Maximal Marginal Relevance)
# ---------------------------------------------------------------------------

def mmr_rerank(
    query_embedding: np.ndarray,
    doc_embeddings: list[np.ndarray],
    documents: list[dict],
    k: int = 5,
    lambda_mult: float = 0.7,
) -> list[dict]:
    """Re-rank documents using Maximal Marginal Relevance.

    Balances relevance to query (lambda_mult) with diversity (1 - lambda_mult).
    """
    if not documents:
        return []
    if len(documents) <= k:
        return documents

    query_emb = np.array(query_embedding).reshape(1, -1)
    doc_embs = np.array(doc_embeddings)

    # Cosine similarities to query
    query_sims = np.dot(doc_embs, query_emb.T).flatten()

    selected_indices = []
    remaining_indices = list(range(len(documents)))

    # First pick: most similar to query
    best_idx = int(np.argmax(query_sims))
    selected_indices.append(best_idx)
    remaining_indices.remove(best_idx)

    # Iteratively pick next best
    while len(selected_indices) < k and remaining_indices:
        best_score = -float("inf")
        best_remaining = -1

        for idx in remaining_indices:
            # Relevance to query
            relevance = query_sims[idx]

            # Max similarity to already selected docs
            selected_embs = doc_embs[selected_indices]
            redundancy = float(np.max(np.dot(selected_embs, doc_embs[idx].reshape(-1, 1))))

            # MMR score
            score = lambda_mult * relevance - (1 - lambda_mult) * redundancy

            if score > best_score:
                best_score = score
                best_remaining = idx

        if best_remaining >= 0:
            selected_indices.append(best_remaining)
            remaining_indices.remove(best_remaining)

    return [documents[i] for i in selected_indices]


# ---------------------------------------------------------------------------
# Query
# ---------------------------------------------------------------------------

def query_documents(
    query: str,
    threshold: float = DEFAULT_THRESHOLD,
    top_k: int = DEFAULT_TOP_K,
    fetch_k: int = DEFAULT_FETCH_K,
    source_type: str = None,
) -> dict:
    """Query the vector store and return relevant documents with MMR reranking."""

    # 1. Generate query embedding
    model = get_model()
    query_embedding = model.encode(query, normalize_embeddings=True).tolist()

    # 2. Search Supabase
    sb = get_supabase()
    params = {
        "query_embedding": query_embedding,
        "match_threshold": threshold,
        "match_count": fetch_k,
    }
    if source_type:
        params["filter_source_type"] = source_type

    result = sb.rpc("match_documents", params).execute()
    documents = result.data or []

    if not documents:
        return {
            "query": query,
            "documents": [],
            "count": 0,
            "timestamp": datetime.now().isoformat(),
        }

    # 3. Extract embeddings for MMR (re-embed to compute diversity)
    doc_texts = [d["content"] for d in documents]
    doc_embeddings = model.encode(doc_texts, normalize_embeddings=True)
    query_emb = np.array(query_embedding)

    # 4. Apply MMR
    reranked = mmr_rerank(query_emb, doc_embeddings, documents, k=top_k)

    return {
        "query": query,
        "documents": reranked,
        "count": len(reranked),
        "total_candidates": len(documents),
        "timestamp": datetime.now().isoformat(),
    }


def format_context_for_llm(documents: list[dict]) -> str:
    """Format retrieved documents as context string for LLM prompt."""
    if not documents:
        return ""

    parts = []
    for i, doc in enumerate(documents, 1):
        similarity = doc.get("similarity", 0)
        source = doc.get("source", "unknown")
        parts.append(
            f"[Source {i}: {source} (relevance: {similarity:.0%})]\n"
            f"{doc['content']}"
        )

    return "\n\n---\n\n".join(parts)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Query RAG vector store")
    parser.add_argument("--query", required=True, help="Search query")
    parser.add_argument("--top-k", type=int, default=DEFAULT_TOP_K, help="Number of results")
    parser.add_argument("--threshold", type=float, default=DEFAULT_THRESHOLD, help="Similarity threshold")
    parser.add_argument("--source-type", help="Filter by source type")
    parser.add_argument("--format", choices=["json", "context"], default="json", help="Output format")
    args = parser.parse_args()

    result = query_documents(
        query=args.query,
        top_k=args.top_k,
        threshold=args.threshold,
        source_type=args.source_type,
    )

    if args.format == "context":
        ctx = format_context_for_llm(result["documents"])
        print(ctx if ctx else "No relevant documents found.")
    else:
        print(json.dumps(result, indent=2, ensure_ascii=False, default=str))


if __name__ == "__main__":
    main()
