# Biz Coach

> **Your business runs on tribal knowledge. Let's fix that.**
>
> Biz Coach guides founders through 5 focused questions and auto-generates a **Company Brain** —
> structured SOPs, judgment rules, and skills your team *and* your AI agents can use from day one.

[![Live Demo](https://img.shields.io/badge/Live-biz--coach.vercel.app-teal?style=for-the-badge)](https://biz-coach.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![OpenRouter](https://img.shields.io/badge/AI-OpenRouter-6366F1?style=flat-square)](https://openrouter.ai/)
[![License](https://img.shields.io/badge/License-MIT-8B5CF6?style=flat-square)](LICENSE)

[Live Demo](https://biz-coach.vercel.app) · [Pitch Deck](https://biz-coach.vercel.app/bizcoachslides) · [How it works](#how-it-works) · [Architecture](#architecture) · [Setup](#getting-started) · [Roadmap](#roadmap)

---

## The problem

Every service business runs on knowledge that lives in exactly one place: the founder's head.
How clients are onboarded. What "good enough" looks like. Who approves what. The edge cases
a new hire takes six months to learn.

That knowledge is never written down — so teammates guess, AI tools hallucinate, and the
business can't scale past its founder.

## What Biz Coach does

A founder picks their business type (agency, freelancer, consultant, startup), answers
**5 questions in plain language** — Hinglish welcome — and Biz Coach generates their
**Company Brain**:

| Output | What it is |
|---|---|
| `KNOWLEDGE.md` | Operating model, client profile, pricing logic, team structure, key metrics |
| `PROCESSES.md` | Workflows with owners, triggers, step-by-step actions, decision points |
| `JUDGMENT.md` | Quality criteria, hard rules, scoring frameworks, approval guardrails |
| `skills[]` | Reusable skill records (name, inputs, outputs, steps) extracted from the conversation |
| Share link | Read-only page that onboards teammates without dumping raw prompts on them |
| JSON API | A live endpoint (`/brain/[id]/api`) any AI tool or agent can query |

**20 minutes, 5 questions, 3 files, 1 live URL.**

## How it works

```
Founder ──► 5-question AI coaching chat (streamed, adaptive, Hinglish-aware)
                  │
                  ▼
         Structured extraction → JSON-schema-constrained generation
                  │
                  ▼
         Validation & normalization layer (never trust raw model output)
                  │
                  ▼
         Company Brain → markdown files + share page + dashboard + JSON API
```

1. **Onboard** — pick a business type; the conversation adapts from the first question.
2. **Coach** — one question at a time. The coach confirms understanding after each answer
   and probes once when an answer is vague ("Can you give me a specific example?").
3. **Generate** — the full conversation is compiled into a typed `BrainRecord`
   (knowledge, processes, judgment, skills) plus clean markdown, with a rule baked into
   the prompt: *use only what was said — never invent details.*
4. **Ship** — view it as file tabs, share a read-only link, pull it over the JSON API.

## Why it's interesting (the AI engineering)

- **Structured extraction, not chat-and-hope.** Brain generation uses JSON-mode output
  against an exact schema, then a deterministic normalization layer
  (`lib/brain-generator.ts`) coerces, defaults, and validates every field — the model
  proposes, code disposes.
- **Anti-hallucination by design.** The generation prompt forbids inventing unstated
  details and requires "Not specified" over guessing — verified behavior, not vibes.
- **Stateful coaching sessions.** Conversation state, question progress, and brain
  readiness detection persist in Supabase with TTLs; sessions survive refreshes.
- **Streaming UX.** Token-streamed coaching responses via `ReadableStream`, with the
  session persisted only after the stream completes.
- **Multilingual grounding.** The coach mirrors the founder's language — Hinglish in,
  Hinglish out — because that's how Indian service businesses actually talk.

## Architecture

```
app/
├── page.tsx                 Landing page
├── onboard/page.tsx         Business-type picker
├── coach/page.tsx           5-question streaming chat
├── dashboard/page.tsx       Past brains
├── brain/[id]/page.tsx      Brain viewer (file tabs, share, API)
├── brain/[id]/share/        Public read-only view
└── api/
    ├── chat/route.ts        Coaching chat (streams, tracks progress)
    ├── generate/route.ts    Brain generation → BrainRecord
    └── brain/[id]/api/      Public JSON endpoint per brain
lib/
├── prompts.ts               Coaching system prompt + generation schema prompt
├── brain-generator.ts       JSON parsing, normalization, validation
├── ai.ts                    Model client (OpenRouter-compatible)
├── kv.ts                    Supabase-backed session/brain store
└── types.ts                 BrainRecord, SessionState, Process, Skill
supabase/migrations/         sessions + brains tables
```

**Stack:** Next.js 14 · TypeScript · Tailwind CSS · Supabase (Postgres + Auth) ·
OpenRouter-compatible chat models · Vercel

## Getting started

```bash
git clone https://github.com/ShivamSoni20/Biz-Coach.git
cd Biz-Coach
npm install
```

1. Create a Supabase project and run the migrations in `supabase/migrations/`.
2. Copy `.env.example` → `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
   - `AIML_API_KEY` (or any OpenRouter-compatible key), `AIML_API_BASE_URL`, `AIML_MODEL`
3. `npm run dev` → http://localhost:3000

## Roadmap → v2: the AI Engineer showcase

Biz Coach is being upgraded into a portfolio centerpiece for Applied AI / AI Engineer roles:

- [ ] **RAG — "Ask your Company Brain."** Chunk brains into Supabase pgvector; cited Q&A
      over company knowledge (`/brain/[id]/ask`).
- [ ] **LangGraph multi-agent coaching.** Interviewer → completeness-checker → writer
      agents with conditional edges and Supabase checkpointing.
- [ ] **Agent harness.** JSON-schema-validated tool registry with dry-run mode and an
      append-only audit log.
- [ ] **Eval harness.** Golden Q&A set + faithfulness/citation metrics in CI
      (`npm run eval`).
- [ ] **Landing page refresh** in the Mark Lou style.

Full details in [`plan/biz-coach-integration-plan.md`](./plan/biz-coach-integration-plan.md).

## License

MIT — build on it.
