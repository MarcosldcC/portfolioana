-- Create table for site content versions
create table if not exists public.site_content_versions (
  id uuid primary key default gen_random_uuid(),
  content jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references auth.users(id),
  note text
);

-- Enable RLS
alter table public.site_content_versions enable row level security;

-- Only authenticated users can see/manage versions
create policy "Allow authenticated view versions" 
on public.site_content_versions 
for select 
to authenticated
using (true);

create policy "Allow authenticated insert versions" 
on public.site_content_versions 
for insert 
to authenticated
with check (true);
