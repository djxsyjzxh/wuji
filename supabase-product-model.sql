-- 物记标准化领域模型迁移
-- 目标：将“物品”“购买”“体验”“想买”拆成可独立演进的实体。
-- 执行前请确认 records / stores / profiles 等现有表已存在且使用 auth.users。

create table if not exists public.products (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  normalized_name text not null,
  brand text not null default '',
  category text not null default '',
  subcategory text not null default '',
  barcode text not null default '',
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_user_normalized_name_idx
  on public.products (user_id, normalized_name);

create index if not exists products_user_barcode_idx
  on public.products (user_id, barcode)
  where barcode <> '';

create table if not exists public.purchases (
  id text primary key,
  product_id text not null references public.products(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  price numeric(12, 2),
  channel text not null default '',
  purchase_date date,
  source_record_id text,
  status text not null default 'using',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists purchases_user_product_idx
  on public.purchases (user_id, product_id, purchase_date desc);

create table if not exists public.experiences (
  id text primary key,
  product_id text not null references public.products(id) on delete cascade,
  purchase_id text references public.purchases(id) on delete set null,
  user_id uuid not null references auth.users(id) on delete cascade,
  rating numeric(2, 1) check (rating is null or (rating >= 0 and rating <= 5)),
  comment text not null default '',
  repurchase_intention text not null default 'UNSURE'
    check (repurchase_intention in ('YES', 'UNSURE', 'NO')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists experiences_user_product_idx
  on public.experiences (user_id, product_id, created_at desc);

create table if not exists public.wishlists (
  id text primary key,
  product_id text references public.products(id) on delete set null,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  status text not null default 'WANT'
    check (status in ('WANT', 'PURCHASED', 'ABANDONED')),
  reason text not null default '',
  expected_price numeric(12, 2),
  created_at timestamptz not null default now(),
  purchased_at timestamptz,
  updated_at timestamptz not null default now()
);

create index if not exists wishlists_user_status_idx
  on public.wishlists (user_id, status, updated_at desc);

alter table public.products enable row level security;
alter table public.purchases enable row level security;
alter table public.experiences enable row level security;
alter table public.wishlists enable row level security;

drop policy if exists "products_owner_select" on public.products;
create policy "products_owner_select" on public.products
  for select using (auth.uid() = user_id);
drop policy if exists "products_owner_insert" on public.products;
create policy "products_owner_insert" on public.products
  for insert with check (auth.uid() = user_id);
drop policy if exists "products_owner_update" on public.products;
create policy "products_owner_update" on public.products
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "products_owner_delete" on public.products;
create policy "products_owner_delete" on public.products
  for delete using (auth.uid() = user_id);

drop policy if exists "purchases_owner_select" on public.purchases;
create policy "purchases_owner_select" on public.purchases
  for select using (auth.uid() = user_id);
drop policy if exists "purchases_owner_insert" on public.purchases;
create policy "purchases_owner_insert" on public.purchases
  for insert with check (auth.uid() = user_id);
drop policy if exists "purchases_owner_update" on public.purchases;
create policy "purchases_owner_update" on public.purchases
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "purchases_owner_delete" on public.purchases;
create policy "purchases_owner_delete" on public.purchases
  for delete using (auth.uid() = user_id);

drop policy if exists "experiences_owner_select" on public.experiences;
create policy "experiences_owner_select" on public.experiences
  for select using (auth.uid() = user_id);
drop policy if exists "experiences_owner_insert" on public.experiences;
create policy "experiences_owner_insert" on public.experiences
  for insert with check (auth.uid() = user_id);
drop policy if exists "experiences_owner_update" on public.experiences;
create policy "experiences_owner_update" on public.experiences
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "experiences_owner_delete" on public.experiences;
create policy "experiences_owner_delete" on public.experiences
  for delete using (auth.uid() = user_id);

drop policy if exists "wishlists_owner_select" on public.wishlists;
create policy "wishlists_owner_select" on public.wishlists
  for select using (auth.uid() = user_id);
drop policy if exists "wishlists_owner_insert" on public.wishlists;
create policy "wishlists_owner_insert" on public.wishlists
  for insert with check (auth.uid() = user_id);
drop policy if exists "wishlists_owner_update" on public.wishlists;
create policy "wishlists_owner_update" on public.wishlists
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "wishlists_owner_delete" on public.wishlists;
create policy "wishlists_owner_delete" on public.wishlists
  for delete using (auth.uid() = user_id);

-- 当前前端已使用 abandoned；修正旧 shopping_cart 表的状态约束，
-- 以便兼容层和云同步可以保留“已放弃”记录。
alter table if exists public.shopping_cart
  drop constraint if exists shopping_cart_status_check;

alter table if exists public.shopping_cart
  add constraint shopping_cart_status_check
  check (status in ('pending', 'purchased', 'abandoned', 'archived'));
