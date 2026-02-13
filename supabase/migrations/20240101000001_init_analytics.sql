create table if not exists public.analytics (
  id text primary key default 'main',
  data jsonb not null default '{}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.analytics enable row level security;

create policy "Allow public read access analytics" 
on public.analytics 
for select 
using (true);

create policy "Allow authenticated update analytics" 
on public.analytics 
for update 
to authenticated
using (true)
with check (true);

-- Insert initial empty data
insert into public.analytics (id, data)
values ('main', '{"page_views": 0, "unique_visitors": 0, "cta_clicks": 0, "project_clicks": 0, "contact_clicks": 0}'::jsonb)
on conflict (id) do nothing;
