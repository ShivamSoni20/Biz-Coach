-- Enable vector extension for RAG chunk embeddings
create extension if not exists vector;

-- Table for storing chunked Company Brain sections and embeddings
create table if not exists brain_chunks (
  id uuid primary key default gen_random_uuid(),
  brain_id text not null,
  section text not null,
  chunk_index integer not null,
  content text not null,
  embedding vector(1536),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for fast similarity search
create index if not exists brain_chunks_brain_id_idx on brain_chunks(brain_id);
create index if not exists brain_chunks_embedding_idx on brain_chunks using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- Enable RLS
alter table brain_chunks enable row level security;

create policy "Public brain_chunks access" on brain_chunks
  for select using (true);

create policy "Service role write access on brain_chunks" on brain_chunks
  for all using (true);

-- Table for agent harness tool executions audit log
create table if not exists tool_runs (
  id uuid primary key default gen_random_uuid(),
  brain_id text not null,
  tool_name text not null,
  args_hash text not null,
  args_json jsonb not null,
  result_json jsonb,
  user_id text,
  status text not null check (status in ('pending', 'completed', 'failed')),
  executed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists tool_runs_brain_id_idx on tool_runs(brain_id);

alter table tool_runs enable row level security;

create policy "Public tool_runs access" on tool_runs
  for select using (true);

create policy "Service role write access on tool_runs" on tool_runs
  for all using (true);
