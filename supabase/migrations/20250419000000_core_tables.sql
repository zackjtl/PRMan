-- Core tables: projects, resources, todos, notes
-- RLS: each row is scoped to the owning user via user_id = auth.uid()

-- ─── Helper: auto-update updated_at ───────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─── projects ─────────────────────────────────────────────────────────────────
create table if not exists public.projects (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  name        text        not null,
  description text        not null default '',
  status      text        not null default 'active'
                          check (status in ('active', 'paused', 'launched', 'idea')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.projects enable row level security;

drop policy if exists "projects_select_own" on public.projects;
drop policy if exists "projects_insert_own" on public.projects;
drop policy if exists "projects_update_own" on public.projects;
drop policy if exists "projects_delete_own" on public.projects;

create policy "projects_select_own" on public.projects for select to authenticated using (auth.uid() = user_id);
create policy "projects_insert_own" on public.projects for insert to authenticated with check (auth.uid() = user_id);
create policy "projects_update_own" on public.projects for update to authenticated using (auth.uid() = user_id);
create policy "projects_delete_own" on public.projects for delete to authenticated using (auth.uid() = user_id);

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- ─── resources ────────────────────────────────────────────────────────────────
create table if not exists public.resources (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  project_id  uuid        not null references public.projects(id) on delete cascade,
  title       text        not null,
  category    text        not null
                          check (category in ('frontend', 'backend', 'repository', 'database', 'auth', 'domain')),
  url         text        not null,
  note        text        not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.resources enable row level security;

drop policy if exists "resources_select_own" on public.resources;
drop policy if exists "resources_insert_own" on public.resources;
drop policy if exists "resources_update_own" on public.resources;
drop policy if exists "resources_delete_own" on public.resources;

create policy "resources_select_own" on public.resources for select to authenticated using (auth.uid() = user_id);
create policy "resources_insert_own" on public.resources for insert to authenticated with check (auth.uid() = user_id);
create policy "resources_update_own" on public.resources for update to authenticated using (auth.uid() = user_id);
create policy "resources_delete_own" on public.resources for delete to authenticated using (auth.uid() = user_id);

drop trigger if exists resources_set_updated_at on public.resources;
create trigger resources_set_updated_at
  before update on public.resources
  for each row execute function public.set_updated_at();

-- ─── todos ────────────────────────────────────────────────────────────────────
create table if not exists public.todos (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  project_id  uuid        not null references public.projects(id) on delete cascade,
  text        text        not null,
  completed   boolean     not null default false,
  priority    text        not null default 'medium'
                          check (priority in ('low', 'medium', 'high')),
  due_date    date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.todos enable row level security;

drop policy if exists "todos_select_own" on public.todos;
drop policy if exists "todos_insert_own" on public.todos;
drop policy if exists "todos_update_own" on public.todos;
drop policy if exists "todos_delete_own" on public.todos;

create policy "todos_select_own" on public.todos for select to authenticated using (auth.uid() = user_id);
create policy "todos_insert_own" on public.todos for insert to authenticated with check (auth.uid() = user_id);
create policy "todos_update_own" on public.todos for update to authenticated using (auth.uid() = user_id);
create policy "todos_delete_own" on public.todos for delete to authenticated using (auth.uid() = user_id);

drop trigger if exists todos_set_updated_at on public.todos;
create trigger todos_set_updated_at
  before update on public.todos
  for each row execute function public.set_updated_at();

-- ─── notes ────────────────────────────────────────────────────────────────────
create table if not exists public.notes (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  project_id  uuid        not null references public.projects(id) on delete cascade,
  content     text        not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.notes enable row level security;

drop policy if exists "notes_select_own" on public.notes;
drop policy if exists "notes_insert_own" on public.notes;
drop policy if exists "notes_update_own" on public.notes;
drop policy if exists "notes_delete_own" on public.notes;

create policy "notes_select_own" on public.notes for select to authenticated using (auth.uid() = user_id);
create policy "notes_insert_own" on public.notes for insert to authenticated with check (auth.uid() = user_id);
create policy "notes_update_own" on public.notes for update to authenticated using (auth.uid() = user_id);
create policy "notes_delete_own" on public.notes for delete to authenticated using (auth.uid() = user_id);

drop trigger if exists notes_set_updated_at on public.notes;
create trigger notes_set_updated_at
  before update on public.notes
  for each row execute function public.set_updated_at();
