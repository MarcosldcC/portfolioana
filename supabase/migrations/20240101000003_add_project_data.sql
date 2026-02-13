-- Add project data fields
alter table public.projects
add column if not exists tasks jsonb default '[]'::jsonb,
add column if not exists links jsonb default '[]'::jsonb,
add column if not exists events jsonb default '[]'::jsonb,
add column if not exists notes text default '';
