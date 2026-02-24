# RAG Pipeline — Standard Operating Procedure

## Purpose
Index outputs from execution scripts into a vector store (Supabase pgvector) so the chat can retrieve relevant context before calling the LLM.

## When to Ingest
- After every successful run of `competitor_discovery.py`, `framework_analysis.py`, or `chat_analysis.py`
- When new JSON files appear in `.tmp/`
- Duplicate detection: skip files already indexed (check `source` field in `documents` table)

## Chunking Strategy

### competitor_discovery outputs
- One chunk per competitor (name + funding + pricing + positioning)
- Source type: `competitor_discovery`

### framework_analysis outputs
- One chunk per framework section (e.g. each SWOT quadrant)
- Source type: `framework_analysis`

### chat_analysis outputs
- One chunk per response (full response text)
- Source type: `chat_analysis`

### Chunk Size Limits
- Max 500 tokens per chunk
- Overlap: 50 tokens between consecutive chunks (only for long-form text)

## Relevance Thresholds
- **Include in context**: similarity ≥ 0.65
- **High confidence badge**: similarity ≥ 0.85
- **Medium confidence**: 0.65 ≤ similarity < 0.85

## Query Cache
- Cache key: MD5 hash of `query.strip().lower()`
- Cache TTL: 24 hours (stale entries ignored but not deleted)
- On cache hit: return cached response + sources without calling LLM

## Re-indexing
- Re-ingest when directive is updated with new chunking rules
- Delete + re-insert all chunks from a given source file
- Never modify embeddings in place

## Tools
- `execution/rag_ingest.py` — ingest pipeline
- `execution/rag_query.py` — retrieval pipeline
- Model: `BAAI/bge-small-en-v1.5` (384 dimensions, local, free)
