-- 物记 Auth 与用户资料配置
-- 运行前请确认项目中已有 profiles / records / stores 表。

-- 当前前端兼容的 profiles 结构：
-- uid uuid primary key, phone text, nickname text, avatar text
alter table if exists public.profiles enable row level security;

drop policy if exists "profiles_owner_select" on public.profiles;
create policy "profiles_owner_select" on public.profiles
  for select using (auth.uid() = uid);

drop policy if exists "profiles_owner_insert" on public.profiles;
create policy "profiles_owner_insert" on public.profiles
  for insert with check (auth.uid() = uid);

drop policy if exists "profiles_owner_update" on public.profiles;
create policy "profiles_owner_update" on public.profiles
  for update using (auth.uid() = uid) with check (auth.uid() = uid);

drop policy if exists "profiles_owner_delete" on public.profiles;
create policy "profiles_owner_delete" on public.profiles
  for delete using (auth.uid() = uid);

-- 旧业务表使用 owner 字段，统一补上 RLS。
alter table if exists public.records enable row level security;
alter table if exists public.stores enable row level security;

drop policy if exists "records_owner_select" on public.records;
create policy "records_owner_select" on public.records
  for select using (auth.uid() = owner);
drop policy if exists "records_owner_insert" on public.records;
create policy "records_owner_insert" on public.records
  for insert with check (auth.uid() = owner);
drop policy if exists "records_owner_update" on public.records;
create policy "records_owner_update" on public.records
  for update using (auth.uid() = owner) with check (auth.uid() = owner);
drop policy if exists "records_owner_delete" on public.records;
create policy "records_owner_delete" on public.records
  for delete using (auth.uid() = owner);

drop policy if exists "stores_owner_select" on public.stores;
create policy "stores_owner_select" on public.stores
  for select using (auth.uid() = owner);
drop policy if exists "stores_owner_insert" on public.stores;
create policy "stores_owner_insert" on public.stores
  for insert with check (auth.uid() = owner);
drop policy if exists "stores_owner_update" on public.stores;
create policy "stores_owner_update" on public.stores
  for update using (auth.uid() = owner) with check (auth.uid() = owner);
drop policy if exists "stores_owner_delete" on public.stores;
create policy "stores_owner_delete" on public.stores
  for delete using (auth.uid() = owner);

-- 安全检查：期望每张业务表 rowsecurity 都是 true。
select schemaname, tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in (
    'profiles', 'records', 'stores', 'shopping_cart',
    'products', 'purchases', 'experiences', 'wishlists'
  )
order by tablename;

-- 安全检查：查看当前项目所有业务表的策略。
select schemaname, tablename, policyname, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
  and tablename in (
    'profiles', 'records', 'stores', 'shopping_cart',
    'products', 'purchases', 'experiences', 'wishlists'
  )
order by tablename, policyname;
