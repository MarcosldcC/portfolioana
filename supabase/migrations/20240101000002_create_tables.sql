-- Create messages table
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  status text not null default 'novo', -- novo, lido, arquivado
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for messages
alter table public.messages enable row level security;

create policy "Anon can insert messages" 
on public.messages 
for insert 
to anon
with check (true);

create policy "Admin can do everything on messages" 
on public.messages 
for all 
to authenticated
using (true)
with check (true);

-- Create projects table
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  description text,
  image_url text,
  status text not null default 'rascunho', -- rascunho, publicado
  date date not null default (now()::date),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for projects
alter table public.projects enable row level security;

create policy "Public can view published projects" 
on public.projects 
for select 
to anon
using (status = 'publicado');

create policy "Admin can do everything on projects" 
on public.projects 
for all 
to authenticated
using (true)
with check (true);

-- Create posts table (Calendar)
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  client text not null,
  type text not null, -- feed, stories, reels, carousel
  status text not null default 'agendado', -- agendado, publicado, rascunho
  date timestamp with time zone not null,
  caption text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for posts
alter table public.posts enable row level security;

create policy "Admin can do everything on posts" 
on public.posts 
for all 
to authenticated
using (true)
with check (true);
