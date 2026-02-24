# PRD 01 — RAG-Powered Market Intelligence Chat

## 1. Problema

O chat do AI Market Insight hoje usa apenas o conhecimento geral do LLM para responder perguntas de mercado. Isso causa:

- **Alucinações**: Dados inventados sobre mercados, funding, concorrentes
- **Desatualização**: Conhecimento limitado ao training cutoff do modelo
- **Sem fontes**: Usuário não consegue verificar a veracidade das respostas
- **Zero diferenciação**: Qualquer ChatGPT/Gemini responde igual

> [!CAUTION]
> Sem RAG, o produto é apenas um wrapper de LLM — sem moat competitivo real.

---

## 2. Solução

Implementar **Retrieval-Augmented Generation (RAG)** para que o chat responda baseado em **dados reais de mercado** coletados pelos scripts de execução, reports, e fontes confiáveis.

### Fluxo Proposto

```mermaid
graph LR
    A[Pergunta do Usuário] --> B[Query Embedding]
    B --> C[Busca no Vector DB]
    C --> D[Top-K Documentos Relevantes]
    D --> E[Reranking]
    E --> F[LLM + Contexto Recuperado]
    F --> G[Resposta com Citações]
```

---

## 3. Escopo

### In-Scope (Must Have)
- Pipeline de ingestão: converter outputs dos scripts Python (`.tmp/*.json`) em embeddings
- Vector store no Supabase via `pgvector`
- Retrieval endpoint (Supabase Edge Function)
- Chat frontend com citações/fontes nas respostas
- Chunking inteligente por seção de relatórios

### Should Have
- Hybrid search (semântico + keyword BM25)
- Reranking com cross-encoder
- Indicador de confiança por resposta (baseado em similarity score)

### Could Have
- Upload de PDFs pelo usuário (relatórios de mercado)
- Scheduled re-indexing automático

### Out of Scope
- Fine-tuning de modelos de embedding
- Multi-tenancy de knowledge bases por usuário (v2)

---

## 4. Arquitetura Técnica (3 Camadas)

### Layer 1 — Directive
**Novo arquivo**: `directives/rag_pipeline.md`
- Define fluxo de ingestão, formatos aceitos, critérios de chunking
- Regras de quando re-indexar dados
- Thresholds de relevância para incluir/excluir contexto

### Layer 3 — Execution
**Novos scripts**:

| Script | Função |
|--------|--------|
| `execution/rag_ingest.py` | Lê JSONs/textos do `.tmp/`, chunka, gera embeddings, insere no Supabase pgvector |
| `execution/rag_query.py` | Recebe query, busca documentos similares, retorna top-K com scores |

**Dependências** (adicionar ao `requirements.txt`):
```
sentence-transformers
pgvector
supabase
tiktoken
```

### Backend — Supabase
- Extensão `pgvector` habilitada
- Tabela `documents`: `id`, `content`, `embedding`, `metadata`, `source`, `chunk_index`, `created_at`
- Função SQL de busca por similaridade (cosine distance)
- Edge Function `rag-search` para expor via API

### Frontend
- Componente `SourceCitation.tsx` para exibir fontes inline
- Badge de confiança (🟢 Alta | 🟡 Média | 🔴 Baixa) baseado em similarity score
- Fallback gracioso quando nenhum documento relevante é encontrado

---

## 5. Modelo de Embeddings

| Modelo | Dimensões | Prós | Contras |
|--------|-----------|------|---------|
| `text-embedding-ada-002` (OpenAI) | 1536 | Alta qualidade, multilíngue | Pago, depende de API |
| `all-MiniLM-L6-v2` | 384 | Grátis, rápido, local | Qualidade inferior |
| `bge-large-en-v1.5` | 1024 | SOTA performance | Apenas inglês |
| **`e5-large-v2`** ⭐ | 1024 | Alta qualidade, multilíngue | Requer GPU para batch |

**Recomendação**: Começar com `text-embedding-ada-002` pela simplicidade, migrar para modelo local quando volume justificar.

---

## 6. Métricas de Sucesso

| Métrica | Target | Como Medir |
|---------|--------|------------|
| **Respostas com citações** | >80% das respostas | % de respostas que incluem pelo menos 1 fonte |
| **Relevância do retrieval** | MRR >0.7 | Mean Reciprocal Rank dos documentos recuperados |
| **Redução de alucinações** | -60% | Avaliação manual de amostra (antes vs depois) |
| **Latência** | <3s p95 | Tempo total query → resposta com retrieval |
| **Adoção** | >50% dos chats | % de conversas que disparam retrieval |

---

## 7. Riscos e Mitigações

| Risco | Severidade | Mitigação |
|-------|-----------|-----------|
| Base de dados vazia no início | Alta | Seed com dados dos scripts existentes + relatórios públicos |
| Latência alta com reranking | Média | Cache de embeddings, limitar reranking a top-20 |
| Custo de API de embeddings | Média | Batch processing, cache de embeddings já computados |
| Dados desatualizados | Média | Metadata com timestamp, alertar quando dado >30 dias |

---

## 8. Estimativa RICE

| | Valor |
|---|---|
| **Reach** | 100% dos usuários (chat é feature central) |
| **Impact** | 3x (Massive — transforma a proposta de valor) |
| **Confidence** | 80% (Medium — RAG é padrão comprovado) |
| **Effort** | 3 person-weeks |
| **RICE Score** | **(100 × 3 × 0.8) / 3 = 80** |

---

## 9. Critérios de Aceite

- [ ] Dados dos scripts `competitor_discovery.py` e `framework_analysis.py` indexados no vector store
- [ ] Chat retorna respostas com pelo menos 1 citação quando dados relevantes existem
- [ ] Fallback para resposta sem RAG quando similarity score < threshold
- [ ] Latência total < 3s para 95% das queries
- [ ] Badge de confiança visível no frontend
