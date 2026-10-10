# Biz Coach — Integration Plan (v2: AI Engineer Showcase)

Goal: turn Biz Coach from a solid hackathon build into a portfolio centerpiece for
Applied AI Engineer / AI Engineer / FDE roles — LangChain RAG, LangGraph multi-agent
orchestration, an agent harness, and an eval suite, all at zero cost (OpenRouter free tier).

## Phase 0 — Rename OPT Coach → Biz Coach ✅ DONE

- Full repo rename applied across 19 files (`Biz Coach` brand, `BIZ_COACH_SYSTEM`
  constant, `BC` logo badges, `biz-coach` package name, pitch deck + slide route renamed).
- TypeScript compiles clean (`tsc --noEmit` passes).
- Delivered as `biz-coach.zip`.
- **Manual steps left for you:**
  1. GitHub repo Settings → rename to `Biz-Coach` (history/stars preserved, old URL redirects).
  2. Vercel project → rename to `biz-coach`, redeploy so `biz-coach.vercel.app` resolves.
  3. Drop the new README (delivered alongside this plan) into the repo root.

## Phase 1 — RAG: "Ask your Company Brain" (~1 week)

**Why:** the generated brain (KNOWLEDGE.md / PROCESSES.md / JUDGMENT.md + skills) is a
perfect RAG corpus. A cited Q&A over it is the single most legible "I can ship RAG"
artifact for recruiters.

1. **DB migration** (`supabase/migrations/003_rag.sql`):
   - `enable extension vector;`
   - `brain_chunks(id uuid pk, brain_id text, section text, chunk_index int, content text, embedding vector(768))`
   - ivfflat index on embedding; RLS: chunk readable iff its brain is.
2. **Embeddings (zero-cost):** pick a free-tier embedding model on OpenRouter at
   implementation time and verify dimensionality; fallback is a local transformers.js
   model. Record the choice in `.env.example` (`EMBEDDING_MODEL`).
3. **Ingestion** (`lib/rag/ingest.ts`): after brain generation, split the three markdown
   docs + skill records into ~500-token chunks with 50-token overlap, embed, upsert.
   Backfill script for existing brains (`scripts/backfill-chunks.ts`).
4. **Retrieval API** (`app/api/brain/[id]/ask/route.ts`): embed query → top-k cosine
   search → answer with the chat model, forced to cite `[section:chunk]` sources →
   return `{ answer, citations[] }`.
5. **UI:** new "Ask" tab on `app/brain/[id]/page.tsx` — chat input, streamed answer,
   clickable citations that scroll to the source section.
6. **Acceptance:** 10 hand-written questions over a sample brain; every answer carries
   ≥1 correct citation; no uncited factual claims.

## Phase 2 — LangGraph multi-agent coaching flow (~1 week)

**Why:** LangGraph on the résumé, and a genuinely better product (adaptive follow-ups,
gap detection).

- New `lib/agents/coaching-graph.ts` using `@langchain/langgraph`:
  - **Nodes:** `interviewer` (asks/adapts the 5 questions), `completeness_checker`
    (scores coverage of knowledge/processes/judgment after each answer, requests a
    targeted follow-up when thin), `writer` (drafts the brain JSON).
  - **Edges:** `interviewer → completeness_checker → (interviewer | writer)` —
    conditional on coverage score.
  - **State:** typed `CoachingState` (messages, coverage scores, extracted fields);
    **checkpointer** persisted to Supabase so sessions survive restarts.
- Keep the existing 5-question UX and streaming; the graph runs behind
  `app/api/chat/route.ts`. Feature-flag it (`COACHING_GRAPH_ENABLED`) so the old path
  stays as fallback.
- **Acceptance:** session survives server restart mid-flow; checker triggers ≥1
  follow-up on deliberately thin answers in testing.

## Phase 3 — Agent harness (~3–4 days)

**Why:** FDE roles want to see tool-use done safely, not just chat.

- `lib/harness/tools.ts`: JSON-schema-validated tool registry —
  `create_share_link`, `export_brain_markdown`, `regenerate_section`.
- Execution wrapper: schema validation → dry-run preview → confirmed run →
  append-only audit log (`tool_runs` table: who, what, args hash, result).
- Surface in UI: brain page "Actions" menu with dry-run diffs before anything executes.
- **Acceptance:** invalid args are rejected before any side effect; every run is auditable.

## Phase 4 — Eval harness (~3–4 days)

**Why:** the highest-signal artifact for AI Engineer interviews. Anyone can demo;
  few can show a regression suite.

- `scripts/eval/` + `npm run eval`:
  - **Golden set** (15–20 cases): question → expected cited sections over 2–3 fixture brains.
  - **Metrics:** faithfulness (claims supported by citations), citation precision,
    answer relevance. LLM-as-judge with the chat model, prompts versioned in-repo.
  - **CI gate:** `.github/workflows/eval.yml` runs on PRs; fails below thresholds.
- **Acceptance:** suite runs green on main; a deliberately broken prompt change fails CI.

## Phase 5 — Landing page in Mark Lou style ⏳ BLOCKED

- Blocked on the missing "mark lou" skill — not found in the skill catalog or workspace.
- **Needed from you:** upload the skill file (or tell me where it lives).
- Once received: rebuild `app/page.tsx` following the skill's system — hero, social
  proof, feature bento, how-it-works, FAQ, CTA — while keeping the existing design
  tokens (teal/sage/ink palette in `app/globals.css`).

## Phase 6 — README rewrite ✅ DONE

- New README delivered alongside this plan — problem-first narrative, architecture
  diagram, AI-engineering highlights, setup guide, and the v2 roadmap.

## Phase 7 — Launch checklist

1. Phases 0–1 merged, demo redeployed.
2. Record a 60-second demo GIF → embed in README.
3. Update portfolio projects section + GitHub profile pins (Biz Coach first).
4. Launch posts: LinkedIn + X (build-in-public thread works well for this concept).

## Effort summary

| Phase | Estimate |
|---|---|
| 0 Rename | Done |
| 1 RAG | ~1 week |
| 2 LangGraph agents | ~1 week |
| 3 Agent harness | 3–4 days |
| 4 Evals | 3–4 days |
| 5 Landing page | 2–3 days (after skill arrives) |
| 6 README | Done |

Suggested order: 1 → 4 (evals early pay off while building 2–3) → 2 → 3 → 5 → 7.
