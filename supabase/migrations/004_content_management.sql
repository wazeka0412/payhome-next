-- 004_content_management.sql
-- Tables backing the admin content management screens.
--
-- Each table mirrors a static seed file in src/lib/*-data.ts and is keyed by
-- the same string id used by the seed. The metadata column stores any extra,
-- type-specific fields so the API/admin code can keep evolving without forcing
-- migrations for every new field.
--
-- All tables include a `_deleted` boolean tombstone column so the merge
-- semantics in src/lib/content-store.ts (override + tombstone) translate 1:1
-- when this migration is applied. Until Supabase is connected, the local
-- JSON store under .local-data/ is the source of truth.

-- ── helper trigger to maintain updated_at ──────────────────────────────────
create or replace function set_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ── articles ───────────────────────────────────────────────────────────────
create table if not exists public.articles (
  id text primary key,
  tag text,
  date text,
  title text not null,
  description text,
  body text,
  thumbnail text,
  status text default 'draft',
  publish_date text,
  seo_title text,
  seo_description text,
  ogp_image text,
  metadata jsonb default '{}'::jsonb,
  _deleted boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists articles_status_idx on public.articles (status);
create index if not exists articles_tag_idx on public.articles (tag);
drop trigger if exists articles_set_updated_at on public.articles;
create trigger articles_set_updated_at before update on public.articles
  for each row execute function set_updated_at();

-- ── news ──────────────────────────────────────────────────────────────────
create table if not exists public.news (
  id text primary key,
  category text,
  date text,
  title text not null,
  description text,
  body text,
  status text default 'draft',
  publish_date text,
  seo_title text,
  seo_description text,
  ogp_image text,
  metadata jsonb default '{}'::jsonb,
  _deleted boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists news_status_idx on public.news (status);
create index if not exists news_category_idx on public.news (category);
drop trigger if exists news_set_updated_at on public.news;
create trigger news_set_updated_at before update on public.news
  for each row execute function set_updated_at();

-- ── videos ────────────────────────────────────────────────────────────────
create table if not exists public.videos (
  id text primary key,
  youtube_id text,
  title text not null,
  views text,
  view_count int default 0,
  category text,
  prefecture text,
  builder text,
  tsubo numeric default 0,
  metadata jsonb default '{}'::jsonb,
  _deleted boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists videos_category_idx on public.videos (category);
create index if not exists videos_builder_idx on public.videos (builder);
drop trigger if exists videos_set_updated_at on public.videos;
create trigger videos_set_updated_at before update on public.videos
  for each row execute function set_updated_at();

-- ── interviews ────────────────────────────────────────────────────────────
create table if not exists public.interviews (
  id text primary key,
  category text,
  title text not null,
  company text,
  location text,
  date text,
  excerpt text,
  body jsonb default '[]'::jsonb,
  thumbnail text,
  status text default 'draft',
  publish_date text,
  seo_title text,
  seo_description text,
  ogp_image text,
  metadata jsonb default '{}'::jsonb,
  _deleted boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists interviews_status_idx on public.interviews (status);
create index if not exists interviews_category_idx on public.interviews (category);
drop trigger if exists interviews_set_updated_at on public.interviews;
create trigger interviews_set_updated_at before update on public.interviews
  for each row execute function set_updated_at();

-- ── webinars ──────────────────────────────────────────────────────────────
create table if not exists public.webinars (
  id text primary key,
  title text not null,
  short_title text,
  date text,
  date_formatted text,
  month text,
  day text,
  category text,
  is_upcoming boolean default true,
  status text default 'draft',
  info text,
  description text,
  body text,
  publish_date text,
  seo_title text,
  seo_description text,
  metadata jsonb default '{}'::jsonb,
  _deleted boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
drop trigger if exists webinars_set_updated_at on public.webinars;
create trigger webinars_set_updated_at before update on public.webinars
  for each row execute function set_updated_at();

-- ── events_admin (admin overrides for events-data.ts) ─────────────────────
create table if not exists public.events_admin (
  id text primary key,
  title text not null,
  type text,
  type_label text,
  description text,
  start_date text,
  end_date text,
  location text,
  address text,
  prefecture text,
  builder text,
  capacity int default 10,
  images jsonb default '[]'::jsonb,
  highlights jsonb default '[]'::jsonb,
  features jsonb default '[]'::jsonb,
  metadata jsonb default '{}'::jsonb,
  _deleted boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
drop trigger if exists events_admin_set_updated_at on public.events_admin;
create trigger events_admin_set_updated_at before update on public.events_admin
  for each row execute function set_updated_at();

-- ── case_studies ──────────────────────────────────────────────────────────
create table if not exists public.case_studies (
  id text primary key,
  builder_id text,
  title text not null,
  completed_at text,
  city text,
  prefecture text,
  layout text,
  tsubo numeric default 0,
  total_price numeric default 0,
  description text,
  images jsonb default '[]'::jsonb,
  tags jsonb default '[]'::jsonb,
  metadata jsonb default '{}'::jsonb,
  _deleted boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists case_studies_builder_idx on public.case_studies (builder_id);
drop trigger if exists case_studies_set_updated_at on public.case_studies;
create trigger case_studies_set_updated_at before update on public.case_studies
  for each row execute function set_updated_at();

-- ── sale_homes ────────────────────────────────────────────────────────────
create table if not exists public.sale_homes (
  id text primary key,
  builder_id text,
  title text not null,
  city text,
  prefecture text,
  price numeric default 0,
  land_area numeric default 0,
  building_area numeric default 0,
  layout text,
  status text default 'available',
  features jsonb default '[]'::jsonb,
  metadata jsonb default '{}'::jsonb,
  _deleted boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists sale_homes_builder_idx on public.sale_homes (builder_id);
create index if not exists sale_homes_status_idx on public.sale_homes (status);
drop trigger if exists sale_homes_set_updated_at on public.sale_homes;
create trigger sale_homes_set_updated_at before update on public.sale_homes
  for each row execute function set_updated_at();

-- ── lands ─────────────────────────────────────────────────────────────────
create table if not exists public.lands (
  id text primary key,
  builder_id text,
  title text not null,
  city text,
  prefecture text,
  price numeric default 0,
  area numeric default 0,
  tsubo numeric default 0,
  price_per_tsubo numeric default 0,
  status text default 'available',
  features jsonb default '[]'::jsonb,
  metadata jsonb default '{}'::jsonb,
  _deleted boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists lands_builder_idx on public.lands (builder_id);
create index if not exists lands_status_idx on public.lands (status);
drop trigger if exists lands_set_updated_at on public.lands;
create trigger lands_set_updated_at before update on public.lands
  for each row execute function set_updated_at();

-- ── magazine ──────────────────────────────────────────────────────────────
create table if not exists public.magazine (
  id text primary key,
  issue text,
  title text not null,
  description text,
  cover_image text,
  publish_date text,
  contents jsonb default '[]'::jsonb,
  is_latest boolean default false,
  status text default 'draft',
  seo_title text,
  seo_description text,
  ogp_image text,
  metadata jsonb default '{}'::jsonb,
  _deleted boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
drop trigger if exists magazine_set_updated_at on public.magazine;
create trigger magazine_set_updated_at before update on public.magazine
  for each row execute function set_updated_at();

-- ── features ──────────────────────────────────────────────────────────────
create table if not exists public.features (
  id text primary key,
  type text,
  title text not null,
  subtitle text,
  description text,
  hero_color text,
  filter jsonb default '{}'::jsonb,
  metadata jsonb default '{}'::jsonb,
  _deleted boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
drop trigger if exists features_set_updated_at on public.features;
create trigger features_set_updated_at before update on public.features
  for each row execute function set_updated_at();

-- ── reviews ───────────────────────────────────────────────────────────────
create table if not exists public.reviews (
  id text primary key,
  name text not null,
  area text,
  age text,
  family text,
  text text,
  property_type text,
  builder text,
  budget text,
  duration text,
  body text,
  status text default 'draft',
  publish_date text,
  seo_title text,
  seo_description text,
  ogp_image text,
  metadata jsonb default '{}'::jsonb,
  _deleted boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
drop trigger if exists reviews_set_updated_at on public.reviews;
create trigger reviews_set_updated_at before update on public.reviews
  for each row execute function set_updated_at();

-- ── biz_articles ──────────────────────────────────────────────────────────
create table if not exists public.biz_articles (
  id text primary key,
  category text,
  title text not null,
  excerpt text,
  body text,
  status text default 'draft',
  publish_date text,
  seo_title text,
  seo_description text,
  ogp_image text,
  metadata jsonb default '{}'::jsonb,
  _deleted boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
drop trigger if exists biz_articles_set_updated_at on public.biz_articles;
create trigger biz_articles_set_updated_at before update on public.biz_articles
  for each row execute function set_updated_at();

-- ── biz_news ──────────────────────────────────────────────────────────────
create table if not exists public.biz_news (
  id text primary key,
  category text,
  date text,
  title text not null,
  excerpt text,
  body text,
  status text default 'draft',
  publish_date text,
  seo_title text,
  seo_description text,
  ogp_image text,
  metadata jsonb default '{}'::jsonb,
  _deleted boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
drop trigger if exists biz_news_set_updated_at on public.biz_news;
create trigger biz_news_set_updated_at before update on public.biz_news
  for each row execute function set_updated_at();

-- ── biz_webinars ──────────────────────────────────────────────────────────
create table if not exists public.biz_webinars (
  id text primary key,
  title text not null,
  date text,
  date_label text,
  year text,
  category text,
  excerpt text,
  info text,
  body text,
  schedule jsonb default '[]'::jsonb,
  speakers jsonb default '[]'::jsonb,
  participants text,
  key_points jsonb default '[]'::jsonb,
  seo_title text,
  seo_description text,
  metadata jsonb default '{}'::jsonb,
  _deleted boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
drop trigger if exists biz_webinars_set_updated_at on public.biz_webinars;
create trigger biz_webinars_set_updated_at before update on public.biz_webinars
  for each row execute function set_updated_at();

-- ── Row Level Security ────────────────────────────────────────────────────
-- Public read access (the user-facing site reads these tables); writes are
-- restricted to authenticated users with the admin role. Adjust the policies
-- to your auth model when wiring Supabase up.

do $$
declare
  t text;
begin
  for t in select unnest(array[
    'articles','news','videos','interviews','webinars','events_admin',
    'case_studies','sale_homes','lands','magazine','features','reviews',
    'biz_articles','biz_news','biz_webinars'
  ]) loop
    execute format('alter table public.%I enable row level security', t);
    execute format($p$create policy if not exists %I_read_all on public.%I for select using (true)$p$, t, t);
    execute format($p$create policy if not exists %I_admin_write on public.%I for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role')$p$, t, t);
  end loop;
end $$;
