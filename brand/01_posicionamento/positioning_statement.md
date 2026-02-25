# Fase 1 — Posicionamento & Diferenciação

> Output gerado via brainstorming interativo (3 rodadas de perguntas).
> Data: 2026-02-25

---

## 1. Positioning Statement

### Frase-chave

> **"Market intelligence para quem precisa de respostas, não de prompts."**

### Framework Completo

| Elemento | Conteúdo |
|----------|----------|
| **Para quem** | Qualquer profissional que precisa fazer análise de mercado — founders validando ideias, investidores fazendo due diligence, consultores montando relatórios, gerentes de produto estudando concorrentes |
| **O que é** | Um copilot de market intelligence que transforma uma descrição de negócio em um dossiê completo de mercado |
| **O que faz** | Entrega TAM/SAM/SOM, mapa de concorrentes, frameworks estratégicos (SWOT, Porter, BCG) — tudo em um fluxo guiado, sem exigir que o usuário saiba o que perguntar |
| **Por que é diferente** | Concorrentes genéricos (Perplexity, ChatGPT) exigem 10-15 prompts para montar uma análise fragmentada. O AI Market Insight entrega o dossiê completo a partir de uma única descrição |
| **Por que agora** | LLMs commoditizaram o acesso à informação, mas ninguém resolveu a *estruturação e confiabilidade* dessa informação para decisões de negócio |

### Elevator Pitch (30 segundos)

> *"Founders e investidores perdem horas tentando montar análises de mercado com prompts avulsos no ChatGPT — e no final, os dados não batem. O AI Market Insight é o copilot que transforma uma descrição da sua ideia em um dossiê completo: tamanho de mercado, concorrentes, frameworks estratégicos. Em um único fluxo. Com fontes. Sem precisar saber o que perguntar."*

---

## 2. Análise Competitiva: AI Market Insight vs Perplexity

### Concorrente principal: Perplexity

| Dimensão | Perplexity | AI Market Insight |
|----------|------------|-------------------|
| **Modelo** | Search engine + LLM | Copilot de market intelligence |
| **Input do usuário** | Precisa saber o que perguntar (prompt) | Descreve a ideia/negócio e o sistema guia |
| **Output** | Texto corrido com links de fontes genéricas | Dossiê estruturado (tabelas, números, frameworks) |
| **Citações** | Links de blogs, artigos SEO, Wikipedia | Dados processados por scripts determinísticos com fontes rastreáveis |
| **Consistência entre queries** | Cada prompt é uma sessão isolada | Fluxo único onde cada análise alimenta a próxima |
| **Frameworks** | Não tem; o usuário precisa pedir e interpretar | SWOT, Porter, BCG, TAM/SAM/SOM nativos e visual |
| **Formato** | Texto para leitura | Relatório pronto para pitch deck |

### Onde o Perplexity ganha (ser honesto importa)

- **Marca e base de usuários** — milhões de usuários, reconhecimento global
- **Amplitude** — responde qualquer pergunta, não só business
- **Velocidade percebida** — resposta quase instantânea
- **Gratuito para uso básico** — barreira zero

### Onde o AI Market Insight ganha

- **Profundidade vertical** — feito para análise de mercado, não para perguntas genéricas
- **Fluxo guiado** — o usuário não precisa ser analista
- **Output estruturado** — dados tabelados, prontos para uso, não parágrafos para interpretar
- **Consistência** — pipeline determinístico (Python) garante que TAM > SAM > SOM sempre
- **All-in-one** — concorrentes + sizing + frameworks em um único fluxo

### Gap explorado

```
Perplexity dá RESPOSTAS (texto)
AI Market Insight dá ANÁLISES (estrutura + dados + fontes)

Respostas ≠ Análises
```

---

## 3. Mapa de Audiência

### Hierarquia de comunicação

```
┌──────────────────────────────────────────────────┐
│  🎯 Âncora de comunicação: Founders early-stage  │
│  "Validando uma ideia de negócio"                │
│                                                  │
│  → Marketing, copy, exemplos, onboarding         │
│    falam PRIMEIRO com esse perfil                 │
└──────────────────────┬───────────────────────────┘
                       │ atrai naturalmente
                       ▼
┌──────────────────────────────────────────────────┐
│  👥 Audiência ampla: Qualquer profissional que   │
│  precisa de análise de mercado                   │
│                                                  │
│  Investidores, consultores, PMs, analistas,      │
│  estudantes de MBA, jornalistas de negócios      │
└──────────────────────────────────────────────────┘
```

### Job-to-be-done por persona

| Persona | Job-to-be-done | Que análise precisa |
|---------|---------------|---------------------|
| Founder (pré-seed) | Validar ideia antes de investir tempo/dinheiro | TAM/SAM/SOM + concorrentes + SWOT |
| Founder (seed/A) | Montar slide deck com dados sólidos para captar | TAM/SAM/SOM + Porter + market trends |
| Investidor (VC/Angel) | Due diligence rápida de uma startup em avaliação | Concorrentes + sizing + benchmarks |
| Consultor | Entregar relatório profissional para cliente | Todos os frameworks + export |
| Gerente de Produto | Entender mercado para priorizar features | Concorrentes + SWOT + Porter |

### Decisão estratégica

> **Não segmentar o produto. Segmentar a comunicação.**
>
> O produto serve todos. A homepage fala com founders. A adoção por investidores e consultores vem por proximidade natural.

---

## 4. Modelos Psicológicos Aplicados (PLFS)

> Baseado na skill `marketing-psychology`. PLFS = Psychological Leverage & Feasibility Score.

### Modelo 1: Loss Aversion (PLFS: +14)

| Item | Detalhe |
|------|---------|
| **Viés** | Pessoas sentem a dor da perda ~2x mais do que o prazer do ganho |
| **Aplicação** | Destacar o custo de NÃO usar: "3 horas perdidas montando análise prompt por prompt" / "decisão de $50K baseada em dados que o ChatGPT inventou" |
| **Onde usar** | Homepage (sub-headline), ads, emails de reativação |
| **Exemplo** | *"Founders perdem em média 4 horas por semana montando análises de mercado fragmentadas. Você tem certeza que seus dados estão certos?"* |
| **Guardrail** | Não inventar estatísticas. Usar dados reais ou framing honesto ("em média", "estimamos") |

### Modelo 2: Cognitive Ease / Fluency (PLFS: +13)

| Item | Detalhe |
|------|---------|
| **Viés** | Coisas fáceis de processar parecem mais confiáveis e verdadeiras |
| **Aplicação** | O produto deve parecer simples de usar desde o primeiro segundo. O onboarding deve ser: "Descreva sua ideia" → output. Sem formulários, sem configuração |
| **Onde usar** | UX do produto, homepage (demonstração visual), onboarding |
| **Exemplo** | Hero section com um input simples: "Descreva sua ideia de negócio..." → e o dossiê aparece abaixo |
| **Guardrail** | Simplicidade na interface não pode significar superficialidade no output |

### Modelo 3: Authority Bias (PLFS: +12)

| Item | Detalhe |
|------|---------|
| **Viés** | Pessoas confiam mais em informações que parecem vir de fontes autoritativas |
| **Aplicação** | Cada dado no output deve ter fonte citada. Badge de confiança (🟢/🟡/🔴). Usar nomes de frameworks reconhecidos (Porter, BCG, etc.) |
| **Onde usar** | Output do produto, marketing materials, social proof |
| **Exemplo** | *"TAM de $15B — fonte: Gartner Market Guide 2025"* ao invés de *"o mercado é grande"* |
| **Guardrail** | Nunca fabricar fontes. Se não tem fonte, marcar como "estimativa do modelo" com badge 🔴 |

### Modelo 4: Paradox of Choice → Guided Flow (PLFS: +11)

| Item | Detalhe |
|------|---------|
| **Viés** | Muitas opções paralisam. Um caminho guiado reduz ansiedade e aumenta ação |
| **Aplicação** | O usuário NÃO escolhe qual framework rodar. O sistema decide e entrega tudo. Eliminar decisões desnecessárias |
| **Onde usar** | Arquitetura do produto e messaging ("sem precisar saber o que perguntar") |
| **Exemplo** | Ao invés de "Escolha: SWOT / Porter / BCG / TAM", o produto roda todos e apresenta de forma organizada |
| **Guardrail** | Oferecer opção de aprofundar (drill-down) para usuários avançados que querem controle |

---

## 5. Headlines & Messaging

### Headlines ranqueadas

| # | Headline | Ângulo | Para onde |
|---|----------|--------|----------|
| 1 | **"Market intelligence para quem precisa de respostas, não de prompts."** | Anti-fragmentação | Homepage |
| 2 | **"Da ideia ao dossiê de mercado. Uma pergunta. Um fluxo."** | Copilot + simplicidade | Homepage alternativa |
| 3 | **"Pare de montar sua análise de mercado prompt por prompt."** | Dor + loss aversion | Ads / LinkedIn |
| 4 | **"O relatório de mercado que o Perplexity não gera."** | Comparativo direto | Blog / SEO |
| 5 | **"Valide sua ideia com dados. Não com achismo."** | Confiança + dados | Product Hunt |

### Sub-headlines

| Headline | Sub-headline sugerida |
|----------|----------------------|
| #1 | *"Descreva seu negócio. Receba TAM, concorrentes e frameworks estratégicos — com fontes, em formato de relatório."* |
| #2 | *"Para founders, investidores e qualquer pessoa que precisa de dados de mercado confiáveis sem virar analista."* |
| #3 | *"O AI Market Insight reúne sizing, concorrentes e frameworks em um fluxo guiado. Com fontes. Sem interpretação."* |

### Taglines para Product Hunt

| Opção | Tagline |
|-------|---------|
| A | *"Market validation for people who hate doing research"* |
| B | *"From idea to market dossier in one question"* |
| C | *"Stop Googling your TAM. Calculate it."* |

---

## 6. Decisões Tomadas nesta Fase

| # | Decisão | O que descartamos | Por quê |
|---|---------|-------------------|---------|
| 1 | Concorrente-alvo: **Perplexity** (e wrappers genéricos) | CB Insights / PitchBook | Perplexity é o mais usado pelo ICP. Competir com CB Insights em dados é inviável no curto prazo |
| 2 | Ângulo combinado: **Copilot de validação + Fluxo único** | Ângulo de preço ("CB Insights de $0") / Ângulo técnico puro | Copilot + Fluxo ataca comportamento real (prompts avulsos). Preço diminui valor percebido. Técnico não ressoa emocionalmente |
| 3 | Audiência: **Ampla, com founders como âncora de comunicação** | Segmentação exclusiva para founders / Mensagem 100% genérica | O produto serve todos. Marketing que fala com founders atrai naturalmente investidores e consultores por proximidade |
| 4 | Posicionamento: **"Respostas ≠ Análises"** | "Mais barato" / "Mais fontes" / "Mais frameworks" | Cria categoria própria. Não compete em features — compete em *tipo de output* |
