-- Secure n8n_chat_histories with RLS and session-based access via header

-- 1) Enable RLS
alter table public.n8n_chat_histories enable row level security;

-- 2) Helper function to read request headers safely (case-insensitive)
create or replace function public.request_header(name text)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    nullif(current_setting('request.headers', true), '')::jsonb ->> lower(name),
    nullif(current_setting('request.header.' || lower(name), true), '')
  );
$$;

-- 3) Session-based policies using x-session-id header matching the session_id column
-- Drop if they already exist to make this migration idempotent
drop policy if exists "Session can read own chat history" on public.n8n_chat_histories;
create policy "Session can read own chat history"
  on public.n8n_chat_histories
  for select
  to anon, authenticated
  using (
    public.request_header('x-session-id') is not null
    and public.request_header('x-session-id') = session_id
  );

drop policy if exists "Session can insert own chat history" on public.n8n_chat_histories;
create policy "Session can insert own chat history"
  on public.n8n_chat_histories
  for insert
  to anon, authenticated
  with check (
    public.request_header('x-session-id') is not null
    and public.request_header('x-session-id') = session_id
  );

drop policy if exists "Session can update own chat history" on public.n8n_chat_histories;
create policy "Session can update own chat history"
  on public.n8n_chat_histories
  for update
  to anon, authenticated
  using (
    public.request_header('x-session-id') = session_id
  )
  with check (
    public.request_header('x-session-id') = session_id
  );

drop policy if exists "Session can delete own chat history" on public.n8n_chat_histories;
create policy "Session can delete own chat history"
  on public.n8n_chat_histories
  for delete
  to anon, authenticated
  using (
    public.request_header('x-session-id') = session_id
  );