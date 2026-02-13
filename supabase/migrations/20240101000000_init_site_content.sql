-- Create table for storing site dynamic content (JSON structure)
create table if not exists public.site_content (
  id text primary key default 'main', -- Single row for now with id 'main'
  content jsonb not null default '{}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.site_content enable row level security;

-- Policy 1: Allow public read access to site_content
create policy "Allow public read access" 
on public.site_content 
for select 
using (true);

-- Policy 2: Allow authenticated users (admin) to update content
-- Note: 'anon' role is for unauthenticated users. 'service_role' bypasses RLS.
-- Here we'll allow authenticated users via the auth system.
create policy "Allow authenticated update" 
on public.site_content 
for update 
to authenticated
using (true)
with check (true);

-- Policy 3: Allow authenticated users to insert (initial setup)
create policy "Allow authenticated insert" 
on public.site_content 
for insert 
to authenticated
with check (true);

-- Create storage bucket for images
insert into storage.buckets (id, name, public)
values ('portfolio-images', 'portfolio-images', true)
on conflict (id) do nothing;

-- Storage policies
create policy "Public Access" 
on storage.objects 
for select 
to anon
using ( bucket_id = 'portfolio-images' );

create policy "Auth Upload" 
on storage.objects 
for insert 
to authenticated
with check ( bucket_id = 'portfolio-images' );

create policy "Auth Update" 
on storage.objects 
for update 
to authenticated
using ( bucket_id = 'portfolio-images' );

create policy "Auth Delete" 
on storage.objects 
for delete 
to authenticated
using ( bucket_id = 'portfolio-images' );
