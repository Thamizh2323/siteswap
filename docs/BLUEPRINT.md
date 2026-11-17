# CHIEF_SITESWAP_KIT (THAMIZH_23)

SiteSwap build kit for Arbiter Hacks V1. Built to work with Claude AND with free NVIDIA NIM models, so credits don't run out.

## 0. How to use (3 lines)

1. Do Section 2 (accounts and keys) once.
2. Put Section 3 in repo root as `GEMINI.md` (also copy to `AGENTS.md`, or your VS Code extension's rules file). Put Section 8 in `supabase/schema.sql`.
3. Open a NEW chat per step. Paste Section 5 once, then paste one Step Card (Section 7) with the Step Template (Section 6).

---

## 1. Model routing (save Claude credits)

| Use | Model | Steps |
|---|---|---|
| **[C] Hard / security** (auth, RLS, SQL, reservation logic, AI route, final security review) | Claude in Antigravity | S3, S5, S7, S12 logic, S13, S22 |
| **[N] Easy / repetitive** (UI, forms, CSS, lists, i18n, README, seed data) | NVIDIA NIM model in VS Code/Antigravity, or Gemini model if Antigravity offers it | everything else |

NIM notes:
- Key from build.nvidia.com. Endpoint is OpenAI-compatible: `https://integrate.api.nvidia.com/v1`. The key goes in the **extension settings only**, never in the project `.env`. The app itself does not use NIM.
- Pick the strongest **coder** model in their model list (Qwen coder / DeepSeek / Kimi / Llama 70B class). Free tier is rate limited, so keep prompts small.
- Weaker models: ONE step per chat, exact file paths, exact commands to run, small context. If a [N] step fails twice, switch that single step to Claude.

---

## 2. Accounts and keys: what to connect where

| # | Do this | Copy this | Put it here |
|---|---|---|---|
| 1 | Supabase: New project | Project URL, `anon` key | `.env.local` as `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| 2 | Supabase: Database > Extensions > enable **postgis** | | |
| 3 | Supabase: SQL Editor > paste `schema.sql` > Run | | |
| 4 | Supabase: Auth > Providers: Email ON. For dev, turn **Confirm email OFF** (default email sending is heavily rate limited, magic links will fail on demo day). Google OAuth optional. | | |
| 5 | Supabase: Auth > URL Configuration: add `http://localhost:3000` and later your Vercel URL | | |
| 6 | Supabase: Settings > API: `service_role` key | Only if a server job needs it | `.env.local` as `SUPABASE_SERVICE_ROLE_KEY`. **Server only. Never `NEXT_PUBLIC_`. Never in chat.** |
| 7 | Google AI Studio: Gemini API key | key | `.env.local` as `GEMINI_API_KEY` |
| 8 | List models: `curl.exe "https://generativelanguage.googleapis.com/v1beta/models?key=KEY"` | a current Flash vision model name | `.env.local` as `GEMINI_MODEL` |
| 9 | Vercel (Hobby): import GitHub repo | | Add the same env vars in Vercel dashboard (after S1 works) |
| 10 | Telegram: @BotFather > /newbot (later, S18) | token | `TELEGRAM_BOT_TOKEN` |
| 11 | GitHub: repo public, add MIT LICENSE before submit | | |

`.env.local` template:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=
GEMINI_MODEL=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
TELEGRAM_BOT_TOKEN=
```

---

## 3. GEMINI.md (paste into repo root; keep it short, it loads every chat)

```markdown
# SiteSwap rules
Project: P2P marketplace to resell leftover construction materials. Hackathon: Arbiter Hacks V1, Theme "Rethinking Waste". Solo dev. Free tier only.
Full spec: docs/BLUEPRINT.md (read only the part named in the task). Progress: PLAN.md.

## Stack (do not change)
Next.js App Router + TypeScript strict + Tailwind. Supabase (Postgres+PostGIS, Auth, Storage) via `@supabase/ssr`. Gemini via the official `@google/genai` SDK or REST, server-side only. Leaflet + OpenStreetMap. Vercel Hobby. PWA.

## Rules
1. Work on ONE step only. Before coding, list the files you will touch (max 5 bullets). Then code.
2. Do not edit files outside the step. No refactors. No new dependencies without saying why.
3. Do not invent APIs or package names. If unsure, check the installed package's types/docs.
4. Secrets only in .env.local. Never hardcode keys. Only safe values use NEXT_PUBLIC_.
5. Gemini calls and service_role only in server code (route handlers / server actions).
6. Validate every input with zod. Handle loading, empty and error states.
7. Mobile-first (390px). Dark theme, minimal, one accent colour. Tamil-ready: no hardcoded UI strings once i18n exists.
8. Phone numbers are never returned to the client except via the get_contact RPC.
9. All DB writes that change qty/status go through the SQL RPCs, not direct table updates.
10. Folders: src/app (thin routes), src/components (UI only), src/features/<name> (actions, queries, schemas, types), src/lib, src/server, src/i18n.
11. After the change run: npm run lint && npm run build. Fix errors before saying done.
12. Finish with: what changed, how to test (exact steps), and update PLAN.md.

## Out of scope
Payments, in-app chat, delivery tracking, native app.
```

---

## 4. PLAN.md (the 1st, 2nd, 3rd list)

Tags: **[C]** use Claude, **[N]** NIM is fine, **[YOU]** manual.

**Phase A: Foundation**
- [ ] S0 [YOU] Accounts, keys, `.env.local`, GEMINI.md, schema.sql in repo
- [ ] S1 [N] Scaffold Next.js + Tailwind + folders + PWA manifest
- [ ] S2 [N] Design system + layout + bottom nav (dark theme)
- [ ] S3 [C] Supabase clients (`@supabase/ssr`), env validation, auth middleware
- [ ] S4 [YOU] Run schema.sql in Supabase, generate types
- [ ] S5 [C] Auth (email+password, Google optional) + profile page + protected routes

**Phase B: Core product (Must)**
- [ ] S6 [N] Client-side image compress + upload to Storage
- [ ] S7 [C] Gemini analyze route (zod, rate limit, fallback)
- [ ] S8 [N] Post Surplus page (form, price suggestion, location pin)
- [ ] S9 [N] Browse list + filters + pagination
- [ ] S10 [N] Map view + radius search (nearby_listings RPC)
- [ ] S11 [N] Listing detail page
- [ ] S12 [C] Reserve flow + seller/buyer inbox (RPCs)
- [ ] S13 [C] Complete + impact log + contact reveal
- [ ] S14 [N] Impact dashboard + methodology page
- [ ] S15 [N] Landing page with live counters

**MILESTONE Nov 28: end-to-end demo works (post > browse > reserve > accept > complete)**

**Phase C: Differentiators (Should)**
- [ ] S16 [N] Wanted requests + matching
- [ ] S17 [N] Order Estimator
- [ ] S18 [N] Notifications + Telegram bot
- [ ] S19 [N] Tamil / English toggle
- [ ] S20 [N] Report listing + admin page

**FEATURE FREEZE Dec 5**

**Phase D: Ship**
- [ ] S21 [N] PWA polish, Lighthouse fixes, skeleton loaders
- [ ] S22 [C] Security review + RLS tests + AI accuracy test
- [ ] S23 [N] Seed demo data (is_demo = true, clearly labelled)
- [ ] S24 [YOU+N] Deploy to Vercel, set env vars, test logged-out
- [ ] S25 [N] README, docs, screenshots, LICENSE, Devpost text

---

## 5. MASTER PROMPT (paste once at the start of a new chat, then add a Step Card)

```
You are my senior full-stack pair programmer for the SiteSwap project.

First read GEMINI.md and PLAN.md. These are the rules. Follow them strictly.

Working style:
- I will give you ONE step at a time (a Step Card). Do only that step.
- Before writing code, reply with: (a) a 5-bullet plan, (b) the exact list of files you will create or edit. Then implement.
- Prefer small, readable functions. No clever tricks. No unrequested features.
- If something is ambiguous, make the simplest reasonable assumption and state it in one line. Ask a question only if you are truly blocked.
- Never print or log secrets. Never ask me to paste keys into chat.
- When done: run `npm run lint && npm run build`, fix errors, then give me (1) what changed, (2) exact steps to test, (3) the PLAN.md checkbox to tick.

Reply "READY" and wait for the Step Card.
```

---

## 6. Step Template (paste after the Master Prompt, fill from the card)

```
STEP: <Sxx name>
TASK: <from card>
FILES ALLOWED: <from card>
DONE WHEN: <from card>
DO NOT: touch other files, add payments/chat, change the stack.
```

---

## 7. Step Cards

**S1 [N] Scaffold**
TASK: Create Next.js (App Router, TypeScript, Tailwind, ESLint, src dir) in the current folder. Create folders from GEMINI.md rule 10. Add `public/manifest.webmanifest` + icons placeholder, set theme colour, add `<link rel="manifest">`. Create `.env.example` (keys only) and ensure `.gitignore` excludes `.env*.local`. Install `zod`.
DONE WHEN: `npm run dev` shows a page at localhost:3000, `npm run build` passes, `git status` does not list `.env.local`.

**S2 [N] Design system + layout**
TASK: Dark-first theme using CSS variables (background, surface, border, text, muted, accent). Build `AppShell` with a mobile bottom nav (Browse, Sell, Reservations, Impact, Profile) and a top bar with logo "SiteSwap". Build small components: Button, Card, Input, Badge, Skeleton, EmptyState. Minimal, product-company feel.
FILES: src/app/layout.tsx, src/app/globals.css, src/components/ui/*, src/components/AppShell.tsx.
DONE WHEN: all 5 nav routes exist as placeholder pages and look good at 390px width.

**S3 [C] Supabase clients + middleware**
TASK: Install `@supabase/ssr` and `@supabase/supabase-js`. Create browser client, server client (cookies), and middleware that refreshes the session and redirects unauthenticated users away from `/sell`, `/my`, `/profile`, `/admin`. Add `src/lib/env.ts` validating env vars with zod (server vars only on server). Follow the current official Supabase SSR docs for Next.js App Router; do not use the deprecated auth-helpers.
DONE WHEN: build passes; visiting /sell logged-out redirects to /login.

**S5 [C] Auth + profile**
TASK: `/login` with email+password sign up/sign in (+ Google button only if provider is configured). A profile is auto-created by the DB trigger. `/profile` page to edit name, phone, role, language, area_text (writes `profiles` for own row). Sign out button. Friendly error messages.
DONE WHEN: new user can register, edit profile, log out, log in again. Another user cannot read my phone through the Supabase client (test in browser console with the anon key and a second account).

**S6 [N] Image compress + upload**
TASK: Util `compressImage(file)` (canvas, max 1280px side, JPEG quality ~0.7, target under 300 KB). Component `PhotoPicker` (max 4 photos, camera or gallery, previews, remove). Upload to bucket `listing-photos` under path `<user_id>/<random>.jpg`, returns public URLs. Reject non-image or over-size input.
DONE WHEN: a 4 MB phone photo uploads as under 300 KB and the URL opens.

**S7 [C] Gemini analyze route**
TASK: `POST /api/analyze` (route handler). Auth required. Accepts image URLs (or base64) from the user's own upload. Calls Gemini (model from `GEMINI_MODEL`) with a prompt that returns ONLY JSON: `{material_key, estimated_qty, unit, condition, confidence, visible_issues[], notes}`. `material_key` must be one of the keys in the `materials` table. Validate with zod; on invalid JSON retry once, then return `{fallback:true}`. Per-user rate limit (10 per hour, store counts in a small table or in-memory fallback). Detect non-construction or hazardous photos and return an error. Never expose the key.
DONE WHEN: a brick photo returns valid JSON in under 10 s; a selfie returns a clear error; 11th call in an hour returns 429.

**S8 [N] Post Surplus page**
TASK: `/sell/new` flow: PhotoPicker > call `/api/analyze` > editable form prefilled (material, qty, unit, condition) with the notice "AI estimate, please confirm" > original price per unit > suggested ask price (original x factor: good 0.75, fair 0.65, damaged 0.45, editable) > location pin using Leaflet (default to current GPS, draggable marker) > publish inserts into `listings` (location as `SRID=4326;POINT(lng lat)`). Manual form fallback if AI fails.
DONE WHEN: listing appears in the DB with correct location and photos; works on a phone.

**S9 [N] Browse list**
TASK: `/browse` list view calling `nearby_listings` RPC with user location (GPS permission, fallback to manual area search). Filters: material, radius (5/10/25 km). Cards show photo, material, qty, condition, ask price, savings %, distance. Pagination (Load more). Skeletons and empty state.
DONE WHEN: radius change updates results; 0-result state looks fine.

**S10 [N] Map view**
TASK: Toggle List/Map on `/browse`. Leaflet + OpenStreetMap tiles (with attribution), markers for listings, tap marker shows mini card linking to detail. Load Leaflet client-side only (dynamic import, no SSR).
DONE WHEN: map renders on mobile without layout shift; markers match the list.

**S11 [N] Listing detail**
TASK: `/listing/[id]`: photo gallery, details, savings badge, seller name (from `public_profiles` view), "inspect before paying" notice, distance, Reserve button (disabled UI until S12).
DONE WHEN: page loads fast and handles a missing/removed listing.

**S12 [C] Reserve flow + inbox**
TASK: Reserve form (qty <= available) calls RPC `reserve_listing`. `/my/reservations` shows buyer and seller views: seller can Accept/Decline via `respond_reservation`; buyer sees status. Call `expire_reservations()` lazily when loading the inbox. No direct table updates for qty/status.
DONE WHEN: with two accounts: reserve, accept, decline, expiry all behave; double reserve of the last qty fails cleanly.

**S13 [C] Complete + impact + contact**
TASK: After accept, show Call and WhatsApp (`https://wa.me/<number>`) buttons using RPC `get_contact` (never select phone directly). Buyer taps "Received" > RPC `complete_reservation`. Show confirmation and impact summary for that deal.
DONE WHEN: `impact_log` row is created once only; phone is not obtainable before accept (verify with another account).

**S14 [N] Impact dashboard**
TASK: `/impact`: call `impact_totals(false)` and `impact_totals(true)`; cards (tonnes, CO2 kg, rupees, deals) + toggle "include demo data" + per-material breakdown and a simple time chart from `impact_log`. Methodology section with formulas and assumptions. Label real vs demo clearly.
DONE WHEN: numbers match the DB.

**S15 [N] Landing**
TASK: `/` hero (problem in one line), live counters from `impact_totals`, two CTAs (Sell surplus / Find materials), "How it works" in 3 steps, footer with disclaimer.

**S16 [N] Wanted requests**
TASK: New table `wanted_requests` (id, buyer_id, material_id, qty, max_price, radius_km, location, status, expires_at) with RLS (read active, write own). Pages `/wanted` and `/wanted/new`. Show nearby wanted requests to sellers.

**S17 [N] Order Estimator**
TASK: `/estimator`: inputs project type, built-up area, floors. Output estimated quantities per material from a config file `src/features/estimator/factors.ts` with every factor marked `// VERIFY with civil engineer`. Show recommended buffer and an "estimate only" label.

**S18 [N] Notifications + Telegram**
TASK: `notifications` table + bell icon with unread count. Server function sends Telegram message (Bot API) on reservation request/accept/decline and wanted match. Link Telegram via a one-time code from `/profile`.

**S19 [N] Tamil / English**
TASK: Simple i18n (JSON dictionaries `en.json`, `ta.json`), language toggle in profile and top bar, translate all UI strings and material names (`name_ta`).

**S20 [N] Report + admin**
TASK: Report button on listing (reason) > `reports` table. `/admin` (only `profiles.is_admin`): reports queue, remove listing, toggle demo data, basic metrics.

**S21 [N] PWA + polish**
TASK: Installable PWA (manifest, icons, service worker for app shell). Fix Lighthouse mobile: performance 80+, accessibility 90+. Add skeletons, empty and error states everywhere.

**S22 [C] Security review + tests**
TASK: Review the repo against this checklist and fix: RLS on all tables; phone never exposed; no secrets in client bundle or git history; upload validation; EXIF stripped or ignored; rate limits; zod on all inputs; admin routes protected. Write a short `docs/SECURITY.md`. Also run the AI accuracy test (40 photos, material accuracy and qty error) and save results to `docs/AI_ACCURACY.md`.

**S23 [N] Seed demo**
TASK: `supabase/seed.sql` or a script creating 20+ listings around Tiruchengode/Salem with `is_demo = true` and realistic photos placeholders, a few completed deals. Never mixed with real pilot data.

**S24 [YOU+N] Deploy**
TASK: Import repo in Vercel, add env vars, add the Vercel URL to Supabase redirect URLs, test logged-out and on a phone.

**S25 [N] README + docs**
TASK: README (problem, features, screenshots, live link, demo login, architecture, setup for Windows and Linux, env vars, impact method, AI accuracy, pilot results, roadmap, MIT license, author THAMIZH_23). Draft Devpost sections and the Theme paragraph.

---

## 8. supabase/schema.sql (run in Supabase SQL Editor)

Fix any error by pasting the exact error message to the model. Extra tables (wanted_requests, ratings, reports, notifications) are added in their own steps.

```sql
create extension if not exists postgis;
create extension if not exists pgcrypto;

create type user_role as enum ('seller','buyer','both');
create type item_condition as enum ('good','fair','damaged');
create type listing_status as enum ('active','reserved','sold','expired','removed');
create type reservation_status as enum ('pending','accepted','declined','expired','cancelled','completed');

-- PROFILES -----------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  phone text,
  role user_role not null default 'both',
  lang text not null default 'en',
  area_text text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', ''));
  return new;
end $$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function handle_new_user();

-- Public-safe view (no phone)
create view public_profiles as
  select id, name, area_text from profiles;
grant select on public_profiles to anon, authenticated;

-- MATERIALS ----------------------------------------------------------
create table materials (
  id serial primary key,
  key text unique not null,
  name_en text not null,
  name_ta text,
  unit text not null,
  kg_per_unit numeric not null,
  co2_per_kg numeric not null default 0,   -- FILL from a cited source before launch
  new_price_ref numeric,                    -- FILL with local retail price
  active boolean not null default true
);

-- Values below are placeholders. VERIFY weights, prices and CO2 factors.
insert into materials (key, name_en, name_ta, unit, kg_per_unit, co2_per_kg, new_price_ref) values
 ('brick_red',  'Red clay brick', 'செங்கல்',   'piece', 3,    0, 7),
 ('cement_bag', 'Cement bag (50 kg)', 'சிமெண்ட் மூட்டை', 'bag', 50, 0, null),
 ('steel_tmt',  'TMT steel bar', 'இரும்பு கம்பி', 'kg',  1,    0, null),
 ('m_sand',     'M-Sand', 'எம்-சாண்ட்',         'unit', 4500, 0, null);

-- LISTINGS -----------------------------------------------------------
create table listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references profiles(id) on delete cascade,
  material_id int not null references materials(id),
  qty_total numeric not null check (qty_total > 0),
  qty_available numeric not null check (qty_available >= 0),
  qty_ai_estimate numeric,
  ai_confidence numeric,
  condition item_condition not null default 'good',
  original_price numeric,
  ask_price numeric not null check (ask_price >= 0),
  negotiable boolean not null default true,
  photos text[] not null default '{}',
  location geography(point,4326) not null,
  area_text text,
  pickup_type text not null default 'self_pickup',
  available_until date,
  status listing_status not null default 'active',
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);
create index listings_geo_idx on listings using gist (location);
create index listings_status_idx on listings (status, material_id, created_at desc);

-- RESERVATIONS -------------------------------------------------------
create table reservations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings(id) on delete cascade,
  buyer_id uuid not null references profiles(id) on delete cascade,
  qty numeric not null check (qty > 0),
  status reservation_status not null default 'pending',
  expires_at timestamptz not null default now() + interval '24 hours',
  contact_revealed_at timestamptz,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);
create index reservations_listing_idx on reservations (listing_id, status);
create index reservations_buyer_idx on reservations (buyer_id, status);

-- IMPACT LOG ---------------------------------------------------------
create table impact_log (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid unique not null references reservations(id) on delete cascade,
  material_id int not null references materials(id),
  qty numeric not null,
  kg_diverted numeric not null,
  co2_avoided_kg numeric not null,
  money_saved numeric not null,
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);

-- ROW LEVEL SECURITY -------------------------------------------------
alter table profiles     enable row level security;
alter table materials    enable row level security;
alter table listings     enable row level security;
alter table reservations enable row level security;
alter table impact_log   enable row level security;

create policy "profiles read own"   on profiles for select using (id = auth.uid());
create policy "profiles update own" on profiles for update using (id = auth.uid()) with check (id = auth.uid());

create policy "materials read all" on materials for select using (true);

create policy "listings read public" on listings for select
  using (status in ('active','reserved') or seller_id = auth.uid());
create policy "listings insert own" on listings for insert with check (seller_id = auth.uid());
create policy "listings update own" on listings for update using (seller_id = auth.uid());
create policy "listings delete own" on listings for delete using (seller_id = auth.uid());

-- Reservations: read only; all writes go through RPCs below
create policy "reservations read parties" on reservations for select using (
  buyer_id = auth.uid()
  or exists (select 1 from listings l where l.id = listing_id and l.seller_id = auth.uid())
);

create policy "impact read all" on impact_log for select using (true);

-- STORAGE ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('listing-photos', 'listing-photos', true)
on conflict (id) do nothing;

create policy "photos public read" on storage.objects for select
  using (bucket_id = 'listing-photos');
create policy "photos auth upload" on storage.objects for insert to authenticated
  with check (bucket_id = 'listing-photos' and (storage.foldername(name))[1] = auth.uid()::text);

-- RPC: NEARBY LISTINGS ----------------------------------------------
create or replace function nearby_listings(
  p_lat double precision, p_lng double precision, p_radius_km double precision,
  p_material int default null, p_limit int default 20, p_offset int default 0
) returns table (
  id uuid, material_id int, qty_available numeric, condition item_condition,
  ask_price numeric, original_price numeric, photos text[], area_text text,
  lat double precision, lng double precision, distance_km double precision,
  created_at timestamptz
) language sql stable as $$
  select l.id, l.material_id, l.qty_available, l.condition,
         l.ask_price, l.original_price, l.photos, l.area_text,
         st_y(l.location::geometry), st_x(l.location::geometry),
         st_distance(l.location, st_point(p_lng, p_lat)::geography) / 1000.0,
         l.created_at
  from listings l
  where l.status = 'active' and l.qty_available > 0
    and st_dwithin(l.location, st_point(p_lng, p_lat)::geography, p_radius_km * 1000)
    and (p_material is null or l.material_id = p_material)
  order by 11 asc
  limit p_limit offset p_offset;
$$;

-- RPC: RESERVE -------------------------------------------------------
create or replace function reserve_listing(p_listing uuid, p_qty numeric)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_l listings; v_id uuid; v_open int;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  select count(*) into v_open from reservations
    where buyer_id = auth.uid() and status = 'pending';
  if v_open >= 5 then raise exception 'too many pending reservations'; end if;

  select * into v_l from listings where id = p_listing for update;
  if not found or v_l.status <> 'active' then raise exception 'listing unavailable'; end if;
  if v_l.seller_id = auth.uid() then raise exception 'cannot reserve own listing'; end if;
  if p_qty <= 0 or p_qty > v_l.qty_available then raise exception 'invalid quantity'; end if;

  update listings
     set qty_available = qty_available - p_qty,
         status = case when qty_available - p_qty = 0 then 'reserved' else status end
   where id = p_listing;

  insert into reservations (listing_id, buyer_id, qty)
  values (p_listing, auth.uid(), p_qty) returning id into v_id;
  return v_id;
end $$;

-- RPC: SELLER ACCEPT / DECLINE --------------------------------------
create or replace function respond_reservation(p_res uuid, p_accept boolean)
returns void language plpgsql security definer set search_path = public as $$
declare v_r reservations; v_l listings;
begin
  select * into v_r from reservations where id = p_res for update;
  if not found then raise exception 'not found'; end if;
  select * into v_l from listings where id = v_r.listing_id for update;
  if v_l.seller_id <> auth.uid() then raise exception 'forbidden'; end if;
  if v_r.status <> 'pending' then raise exception 'not pending'; end if;

  if p_accept then
    update reservations set status = 'accepted', contact_revealed_at = now() where id = p_res;
  else
    update reservations set status = 'declined' where id = p_res;
    update listings set qty_available = qty_available + v_r.qty, status = 'active'
     where id = v_l.id and status in ('active','reserved');
  end if;
end $$;

-- RPC: CONTACT (phone only after accept) ----------------------------
create or replace function get_contact(p_res uuid)
returns table (name text, phone text)
language plpgsql security definer set search_path = public as $$
declare v_r reservations; v_seller uuid;
begin
  select * into v_r from reservations where id = p_res;
  if not found or v_r.status not in ('accepted','completed') then
    raise exception 'not available';
  end if;
  select seller_id into v_seller from listings where id = v_r.listing_id;
  if auth.uid() = v_r.buyer_id then
    return query select p.name, p.phone from profiles p where p.id = v_seller;
  elsif auth.uid() = v_seller then
    return query select p.name, p.phone from profiles p where p.id = v_r.buyer_id;
  else
    raise exception 'forbidden';
  end if;
end $$;

-- RPC: COMPLETE (buyer confirms received) + IMPACT -------------------
create or replace function complete_reservation(p_res uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_r reservations; v_l listings; v_m materials;
begin
  select * into v_r from reservations where id = p_res for update;
  if not found or v_r.buyer_id <> auth.uid() or v_r.status <> 'accepted' then
    raise exception 'invalid';
  end if;
  select * into v_l from listings where id = v_r.listing_id for update;
  select * into v_m from materials where id = v_l.material_id;

  update reservations set status = 'completed', completed_at = now() where id = p_res;

  insert into impact_log (reservation_id, material_id, qty, kg_diverted, co2_avoided_kg, money_saved, is_demo)
  values (
    p_res, v_m.id, v_r.qty,
    v_r.qty * v_m.kg_per_unit,
    v_r.qty * v_m.kg_per_unit * v_m.co2_per_kg,
    greatest(coalesce(v_m.new_price_ref, v_l.original_price, v_l.ask_price) - v_l.ask_price, 0) * v_r.qty,
    v_l.is_demo
  );

  if v_l.qty_available = 0 and not exists (
    select 1 from reservations
     where listing_id = v_l.id and status in ('pending','accepted')
  ) then
    update listings set status = 'sold' where id = v_l.id;
  end if;
end $$;

-- RPC: EXPIRE PENDING (call lazily when loading inbox) ---------------
create or replace function expire_reservations() returns void
language plpgsql security definer set search_path = public as $$
declare r record;
begin
  for r in select * from reservations where status = 'pending' and expires_at < now() for update loop
    update reservations set status = 'expired' where id = r.id;
    update listings set qty_available = qty_available + r.qty, status = 'active'
     where id = r.listing_id and status in ('active','reserved');
  end loop;
end $$;

-- RPC: PUBLIC IMPACT TOTALS ------------------------------------------
create or replace function impact_totals(p_include_demo boolean default false)
returns table (tonnes numeric, co2_kg numeric, rupees numeric, deals bigint)
language sql stable security definer set search_path = public as $$
  select coalesce(sum(kg_diverted), 0) / 1000.0,
         coalesce(sum(co2_avoided_kg), 0),
         coalesce(sum(money_saved), 0),
         count(*)
  from impact_log
  where p_include_demo or not is_demo;
$$;
```

---

## 9. Daily routine (solo)

1. Open PLAN.md, pick the next unchecked step.
2. New chat > Master Prompt > Step Template with the card.
3. Review plan, let it code, run the app, test on your phone.
4. `git add . && git commit -m "feat: Sxx ..." && git push`
5. Tick PLAN.md. Stuck 30 min: send the exact error and the file name, or switch that step to Claude.
