-- ============================================
-- RAG Pipeline — Supabase Migration
-- PRD 01: RAG-Powered Market Intelligence Chat
-- ============================================

-- 1. Enable pgvector extension
create extension if not exists vector with schema extensions;

-- 2. Documents table (vector store)
create table if not exists public.documents (
  id bigint primary key generated always as identity,
  content text not null,
  embedding vector(384) not null,  -- bge-small-en-v1.5 output dimension
  source text not null,            -- original filename e.g. "competitors_20260224.json"
  source_type text not null,       -- "competitor_discovery" | "framework_analysis" | "chat_analysis"
  metadata jsonb default '{}',     -- extra context (query, mode, etc.)
  chunk_index integer default 0,
  created_at timestamptz default now()
);

-- Index for fast vector search
create index if not exists documents_embedding_idx
  on public.documents
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- Index for source_type filtering
create index if not exists documents_source_type_idx
  on public.documents (source_type);

-- 3. Query cache table
create table if not exists public.query_cache (
  id bigint primary key generated always as identity,
  query_hash text unique not null,
  query_text text not null,
  response text not null,
  sources jsonb default '[]',
  mode text default 'general',
  created_at timestamptz default now()
);

create index if not exists query_cache_hash_idx
  on public.query_cache (query_hash);

-- 4. Similarity search function
create or replace function public.match_documents(
  query_embedding vector(384),
  match_threshold float default 0.65,
  match_count int default 10,
  filter_source_type text default null
)
returns table (
  id bigint,
  content text,
  source text,
  source_type text,
  metadata jsonb,
  chunk_index integer,
  similarity float
)
language plpgsql
as $$
begin
  return query
    select
      d.id,
      d.content,
      d.source,
      d.source_type,
      d.metadata,
      d.chunk_index,
      1 - (d.embedding <=> query_embedding) as similarity
    from public.documents d
    where
      (filter_source_type is null or d.source_type = filter_source_type)
      and 1 - (d.embedding <=> query_embedding) > match_threshold
    order by d.embedding <=> query_embedding
    limit match_count;
end;
$$;
