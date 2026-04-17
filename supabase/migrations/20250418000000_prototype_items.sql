-- 最小原型：驗證 PostgREST + RLS。請在 Supabase SQL Editor 執行，或搭配 Supabase CLI migrate。

create table if not exists public.prototype_items (
  id uuid primary key default gen_random_uuid(),
  label text not null default '',
  created_at timestamptz not null default now()
);

alter table public.prototype_items enable row level security;

drop policy if exists "prototype_items_select_own" on public.prototype_items;
drop policy if exists "prototype_items_insert_own" on public.prototype_items;

-- 僅示範：登入後即可讀寫。正式版請依 owner_user_id 等欄位收斂。
create policy "prototype_items_select_own"
  on public.prototype_items
  for select
  to authenticated
  using (true);

create policy "prototype_items_insert_own"
  on public.prototype_items
  for insert
  to authenticated
  with check (true);

insert into public.prototype_items (label)
select 'bootstrap'
where not exists (select 1 from public.prototype_items limit 1);
