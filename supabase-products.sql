-- Ruwa Biosciences catalogue schema.
-- Run this in Supabase Dashboard > SQL Editor before using Admin > Products.
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  sku text not null default '',
  category text not null default 'POC meters and diagnostic equipment',
  manufacturer text not null default '',
  short_description text not null default '',
  description text not null default '',
  price numeric(12, 2) not null default 0,
  currency text not null default 'KES',
  unit_of_sale text not null default 'Unit',
  pack_size text not null default '',
  stock_quantity integer not null default 0,
  minimum_order_quantity integer not null default 1,
  delivery_notes text not null default '',
  request_quote boolean not null default false,
  attributes jsonb not null default '{}'::jsonb,
  product_tags text[] not null default '{}',
  image_urls text[] not null default '{}',
  document_urls text[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products add column if not exists sku text not null default '';
alter table public.products add column if not exists category text not null default 'POC meters and diagnostic equipment';
alter table public.products add column if not exists manufacturer text not null default '';
alter table public.products add column if not exists short_description text not null default '';
alter table public.products add column if not exists currency text not null default 'KES';
alter table public.products add column if not exists unit_of_sale text not null default 'Unit';
alter table public.products add column if not exists pack_size text not null default '';
alter table public.products add column if not exists minimum_order_quantity integer not null default 1;
alter table public.products add column if not exists delivery_notes text not null default '';
alter table public.products add column if not exists request_quote boolean not null default false;
alter table public.products add column if not exists attributes jsonb not null default '{}'::jsonb;
alter table public.products add column if not exists document_urls text[] not null default '{}';

alter table public.products enable row level security;
drop policy if exists "Public can read active products" on public.products;
drop policy if exists "Demo can read catalogue" on public.products;
create policy "Demo can read catalogue" on public.products for select to anon, authenticated using (true);

-- Demo-only policies: the frontend admin uses the public anon key and has no login yet.
-- Replace these with authenticated admin policies before production.
drop policy if exists "Demo can insert products" on public.products;
drop policy if exists "Demo can update products" on public.products;
drop policy if exists "Demo can delete products" on public.products;
create policy "Demo can insert products" on public.products for insert to anon, authenticated with check (true);
create policy "Demo can update products" on public.products for update to anon, authenticated using (true) with check (true);
create policy "Demo can delete products" on public.products for delete to anon, authenticated using (true);
