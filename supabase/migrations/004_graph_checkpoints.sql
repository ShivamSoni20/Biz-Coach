create table if not exists graph_checkpoints (
  thread_id text primary key,
  checkpoint jsonb not null,
  updated_at timestamptz default now()
);

alter table graph_checkpoints enable row level security;

create policy "Public graph_checkpoints access" on graph_checkpoints
  for select using (true);

create policy "Service role write access on graph_checkpoints" on graph_checkpoints
  for all using (true);
