-- 物记购物车：在 Supabase SQL Editor 中执行一次。
create table if not exists public.shopping_cart (
  id text primary key,
  owner uuid not null references auth.users(id) on delete cascade,
  name text not null,
  note text not null default '',
  priority text not null default 'normal' check (priority in ('high', 'normal', 'low')),
  sourcerecordid text,
  category text not null default '',
  image text,
  status text not null default 'pending' check (status in ('pending', 'purchased', 'archived')),
  createdat timestamptz not null default now(),
  purchasedat timestamptz,
  updatedat timestamptz not null default now()
);

alter table public.shopping_cart enable row level security;

drop policy if exists "shopping_cart_owner_select" on public.shopping_cart;
create policy "shopping_cart_owner_select" on public.shopping_cart
  for select using (auth.uid() = owner);

drop policy if exists "shopping_cart_owner_insert" on public.shopping_cart;
create policy "shopping_cart_owner_insert" on public.shopping_cart
  for insert with check (auth.uid() = owner);

drop policy if exists "shopping_cart_owner_update" on public.shopping_cart;
create policy "shopping_cart_owner_update" on public.shopping_cart
  for update using (auth.uid() = owner) with check (auth.uid() = owner);

drop policy if exists "shopping_cart_owner_delete" on public.shopping_cart;
create policy "shopping_cart_owner_delete" on public.shopping_cart
  for delete using (auth.uid() = owner);

create index if not exists shopping_cart_owner_updated_idx
  on public.shopping_cart (owner, updatedat desc);
