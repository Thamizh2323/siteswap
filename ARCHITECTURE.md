# SiteSwap Architecture (THAMIZH_23)

Put this file at `docs/ARCHITECTURE.md`. It is the single source of truth. If code and this document disagree, the code is wrong (or open an ADR, Section 14).

Goals, in priority order: **1. Secure, 2. Correct, 3. Simple, 4. Fast on slow phones, 5. Easy to scale later.** Free tier only.

---

## 1. Style in one paragraph

A **modular monolith**: one Next.js app, organised by **feature slices** (listings, reservations, ...) on top of thin **layers**. **Postgres (RLS + RPC functions) is the source of truth for security and business invariants**; the Next.js server is a thin, validated gateway; the UI is dumb. No microservices, no global client store, no extra backend.

---

## 2. Trust boundaries and where logic lives

```
Browser (untrusted)
   |  forms, fetch, Supabase browser client (anon key only)
   v
Next.js server (semi-trusted): Server Components, Server Actions, Route Handlers
   |  validates input (zod), checks auth, calls Supabase with the USER's session
   |  admin (service_role) client only inside src/server/** for rate-limit and notifications
   v
Supabase Postgres (source of truth)
   RLS policies + SECURITY DEFINER RPCs enforce who can do what
   Storage bucket policies enforce upload paths
External: Gemini API (server only), Telegram Bot API (server only), OSM tiles (browser)
```

Rules that follow from this:
1. **Never trust the client.** Every server action/route re-validates input and re-checks auth.
2. **RLS is the real lock.** UI checks are only for UX.
3. **Quantity/status changes only via RPCs** (`reserve_listing`, `respond_reservation`, `complete_reservation`, `expire_reservations`). No direct `update` on those columns from app code.
4. **Phone numbers only via `get_contact` RPC.** Never `select phone` anywhere else.
5. **`service_role` never touches a user request path** except `src/server/*` helpers (rate limit, notify).
6. Server-only secrets: `GEMINI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `TELEGRAM_BOT_TOKEN`.

---

## 3. Folder structure (final)

```
src/
  app/                      ROUTING ONLY. Thin pages/layouts/route handlers. No business logic.
    (public)/               landing, browse, listing/[id], impact, estimator, about, login
    (protected)/            sell, my, wanted/new, profile, admin
    api/                    route handlers (analyze, telegram webhook, health)
  features/                 ONE FOLDER PER DOMAIN
    listings/
      components/           feature UI (client or server components)
      actions.ts            "use server" mutations
      queries.ts            server-only reads  (import "server-only")
      schemas.ts            zod schemas (shared by client form and server action)
      types.ts              TS types (derived from DB types + zod)
      constants.ts          pure constants
    reservations/  wanted/  impact/  estimator/  notifications/  admin/  profile/  auth/  ai-analysis/
  components/
    ui/                     dumb primitives: Button, Card, Input, Badge, Skeleton, EmptyState
    layout/                 AppShell, BottomNav, TopBar
  lib/                      PURE + browser-safe helpers (no secrets, no server-only)
    supabase/browser.ts     browser client
    supabase/server.ts      server client (cookies) - imports "server-only"
    supabase/middleware.ts  session refresh helper
    geo.ts  price.ts  format.ts  result.ts  errors.ts  image.ts  env.client.ts
  server/                   SERVER-ONLY infrastructure (every file starts with import "server-only")
    env.ts                  zod-validated server env
    supabase-admin.ts       service_role client (only used inside src/server/**)
    gemini.ts               Gemini client wrapper
    rate-limit.ts           calls check_rate_limit RPC via admin client
    notify.ts               in-app + Telegram dispatch
    logger.ts               structured logging, no secrets/PII
  i18n/                     en.json, ta.json, t.ts (helper), locale.ts (cookie)
  types/database.ts         GENERATED Supabase types. Never edit by hand.
middleware.ts               optimistic redirect + session refresh (NOT the only auth check)
supabase/migrations/        0001_init.sql, 0002_..., every schema change = new numbered file
docs/                       ARCHITECTURE.md, SECURITY.md, AI_ACCURACY.md, impact-method.md
```

---

## 4. Dependency rules (enforced by ESLint, Section 9)

Allowed direction: `app -> features -> lib / server`. `components` and `lib` depend on nothing app-specific.

| From | May import | Must NOT import |
|---|---|---|
| `components/**`, `lib/**` | each other (`components -> lib` only), npm packages | `features`, `app`, `server` |
| `features/<a>/**` | `lib`, `components`, `server` (not admin client), own files by **relative path**, other features' `types.ts` / `constants.ts` only | `app`, `server/supabase-admin`, other features' actions/queries/components |
| `app/**` | `features`, `components`, `lib`, `server` (not admin client) | `server/supabase-admin` |
| `server/**` | `lib` (non-browser parts), npm | `features`, `app`, `components` |

`"use client"` files must not import anything that has `import "server-only"`. The `server-only` package turns violations into build errors.

---

## 5. Data access pattern

- **Reads:** Server Components call `features/<x>/queries.ts` (server-only), which use the **server Supabase client (user session, RLS applies)**. Pass plain serialisable data to client components.
- **Writes:** `features/<x>/actions.ts` (Server Actions) for forms and mutations. Route Handlers only for: `/api/analyze` (JSON API, rate limit), `/api/telegram` (webhook), `/api/health`.
- **Browser Supabase client** only for: auth session on client, Storage uploads, optional realtime. Never for sensitive writes.
- **Geo reads** via `nearby_listings` RPC. App convention: always `(lat, lng)`. Convert to PostGIS only in `lib/geo.ts` (`toPointWKT(lat,lng)` returns `SRID=4326;POINT(lng lat)`).
- **Pagination** everywhere (limit 20, offset or cursor). Select only needed columns.
- **State:** server state in the DB, UI state local (`useState`), shareable filters in **URL search params** (radius, material, view). No Redux/Zustand.

---

## 6. Standard patterns (copy these)

### 6.1 Result type (no thrown errors for expected failures)
`src/lib/result.ts`
```ts
export type AppError = { code: ErrorCode; message: string; fields?: Record<string, string> };
export type ErrorCode =
  | "UNAUTHENTICATED" | "FORBIDDEN" | "VALIDATION" | "NOT_FOUND"
  | "CONFLICT" | "RATE_LIMITED" | "UPSTREAM" | "INTERNAL";
export type Result<T> = { ok: true; data: T } | { ok: false; error: AppError };
export const ok = <T>(data: T): Result<T> => ({ ok: true, data });
export const fail = (code: ErrorCode, message: string, fields?: Record<string, string>): Result<never> =>
  ({ ok: false, error: { code, message, fields } });
```
Every Server Action returns `Result<T>`. UI shows `error.message` via i18n keys, never raw DB errors.

### 6.2 Server Action skeleton
```ts
"use server";
export async function reserveListingAction(input: unknown): Promise<Result<{ id: string }>> {
  const parsed = reserveSchema.safeParse(input);
  if (!parsed.success) return fail("VALIDATION", "invalid_input", flatten(parsed.error));
  const user = await requireUser();                       // throws/redirects if no session
  const supabase = await createServerClient();
  const { data, error } = await supabase.rpc("reserve_listing", { p_listing: parsed.data.listingId, p_qty: parsed.data.qty });
  if (error) return mapDbError(error);                    // maps known RPC messages to ErrorCode
  revalidatePath("/my/reservations");
  return ok({ id: data });
}
```

### 6.3 Auth guard
- `requireUser()` in `features/auth/` calls `supabase.auth.getUser()` (**not** `getSession()`; getUser verifies with the server).
- `middleware.ts` only refreshes the session and does optimistic redirects. **Every protected page/action also calls `requireUser()`.**
- `requireAdmin()` checks `profiles.is_admin` server-side.

### 6.4 Validation
zod schema per feature in `schemas.ts`, used by the form (client) and the action (server). Numbers coerced, strings trimmed, max lengths set, enums from the DB enums.

### 6.5 Env
- `src/server/env.ts`: parses server vars with zod, throws at boot if missing. Imports `server-only`.
- `src/lib/env.client.ts`: parses only `NEXT_PUBLIC_*`.
- No other file reads `process.env`.

### 6.6 Rate limiting
Table + RPC (Section 12 SQL). Called from `src/server/rate-limit.ts` with the admin client. Keys like `analyze:<userId>`, `reserve:<userId>`, `report:<userId>`.

### 6.7 AI analysis (`features/ai-analysis` + `server/gemini.ts`)
`/api/analyze`: auth > rate limit > validate image URLs belong to the user's own folder in `listing-photos` > call Gemini with JSON-only prompt > zod-validate output > retry once > fallback `{fallback:true}`. Allowed `material_key` values come from the `materials` table. Output is an **estimate**; the seller must confirm in the UI.

### 6.8 Client components
Smallest possible `"use client"` leaves. Leaflet is loaded with `dynamic(() => import(...), { ssr: false })`. Forms use native form + Server Action + `useActionState` (or `useFormState` if the installed React is older). No heavy form libraries.

### 6.9 i18n
All UI strings via `t("key")` from day one. Dictionaries `en.json`, `ta.json`. Locale from cookie. Material names from `name_en` / `name_ta`.

### 6.10 Money, dates, units
Money = `numeric` INR in DB, formatted with `Intl.NumberFormat("en-IN")` in `lib/format.ts`. Dates stored UTC `timestamptz`, shown in the viewer's locale. Quantities always paired with a unit from `materials.unit`.

### 6.11 Logging
`server/logger.ts` -> JSON lines `{level, event, userId?, ...}`. Never log keys, phone numbers, full tokens, or image data.

---

## 7. Feature map

| Feature | Owns (DB / API) | Public surface |
|---|---|---|
| auth | Supabase Auth, `requireUser`, `requireAdmin` | `/login`, helpers |
| profile | `profiles`, `public_profiles` view | `/profile`, `getPublicProfile` |
| materials | `materials` | `getMaterials` (cached) |
| listings | `listings`, Storage `listing-photos`, `nearby_listings` | sell, browse, detail |
| ai-analysis | Gemini, `/api/analyze` | `analyzePhoto` |
| reservations | `reservations`, 5 RPCs, `get_contact` | `/my/reservations` |
| impact | `impact_log`, `impact_totals` | `/impact`, landing counters |
| wanted | `wanted_requests` | `/wanted` |
| estimator | pure config `factors.ts` | `/estimator` |
| notifications | `notifications`, Telegram | bell, webhooks |
| admin | `reports`, moderation | `/admin` |

---

## 8. Key flows (must match)

**Post surplus:** PhotoPicker (compress in browser) > Storage upload to `<uid>/<random>.jpg` > `/api/analyze` (auth, rate limit) > editable form (seller confirms) > `createListingAction` (zod, `requireUser`, insert with RLS) > revalidate browse.

**Reserve:** `reserveListingAction` > RPC `reserve_listing` (row lock, qty check, 5 pending cap) > seller notified > seller `respondReservationAction` > on accept `get_contact` unlocks Call/WhatsApp for both > buyer `completeReservationAction` > RPC writes `impact_log` once.

**Expiry:** `expire_reservations()` is called lazily when loading `/my/reservations` and from a daily Vercel cron.

---

## 9. Enforcement (this is how Antigravity is forced to comply)

### 9.1 Scripts (`package.json`)
```json
"scripts": {
  "lint": "next lint",
  "typecheck": "tsc --noEmit",
  "test": "vitest run",
  "check": "npm run lint && npm run typecheck && npm run test && npm run build"
}
```
(If `next lint` is not available in the installed Next version, use `eslint .`.) **A step is not done until `npm run check` passes.**

### 9.2 ESLint boundary rules (add to `eslint.config.mjs`, keep existing Next config)
```js
// Non-overlapping file groups so rules don't override each other
{
  files: ["src/components/**/*.{ts,tsx}", "src/lib/**/*.{ts,tsx}"],
  rules: { "no-restricted-imports": ["error", { patterns: [
    { group: ["@/features/*", "@/app/*", "@/server/*"],
      message: "components and lib must not import features, app or server." } ] }] },
},
{
  files: ["src/features/**/*.{ts,tsx}"],
  rules: { "no-restricted-imports": ["error", { patterns: [
    { group: ["@/app/*"], message: "features must not import app." },
    { group: ["@/server/supabase-admin"], message: "admin client is only for src/server/**." },
    { group: ["@/features/*/*", "!@/features/*/types", "!@/features/*/constants"],
      message: "Cross-feature imports allowed only for types.ts and constants.ts. Use relative paths inside your own feature." } ] }] },
},
{
  files: ["src/app/**/*.{ts,tsx}"],
  rules: { "no-restricted-imports": ["error", { patterns: [
    { group: ["@/server/supabase-admin"], message: "admin client is only for src/server/**." } ] }] },
},
{
  files: ["src/server/**/*.ts"],
  rules: { "no-restricted-imports": ["error", { patterns: [
    { group: ["@/features/*", "@/app/*", "@/components/*"], message: "server infra must not import features, app or components." } ] }] },
},
{
  files: ["src/**/*.{ts,tsx}"],
  rules: {
    "no-console": ["error", { allow: ["warn", "error"] }],
    "@typescript-eslint/no-explicit-any": "error",
    "max-lines": ["warn", { max: 250, skipBlankLines: true, skipComments: true }],
  },
},
```
If the syntax errors out, the model must fix the syntax but keep the intent.

### 9.3 Compile-time guards
- `import "server-only";` at the top of every file in `src/server/**`, `src/lib/supabase/server.ts`, and every `queries.ts`.
- TypeScript `strict: true`, `noUncheckedIndexedAccess: true`.
- Generated DB types used for all Supabase calls (`createClient<Database>`).

### 9.4 CI (`.github/workflows/ci.yml`)
```yaml
name: ci
on: [push, pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    env:
      NEXT_PUBLIC_SUPABASE_URL: https://example.supabase.co
      NEXT_PUBLIC_SUPABASE_ANON_KEY: dummy
      SUPABASE_SERVICE_ROLE_KEY: dummy
      GEMINI_API_KEY: dummy
      GEMINI_MODEL: dummy
      NEXT_PUBLIC_SITE_URL: http://localhost:3000
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm run check
```
Red CI = do not merge to `main`.

### 9.5 Tests (Vitest, pure logic only)
Test: `lib/price.ts` (condition factors), `lib/geo.ts`, `features/estimator`, zod schemas, `mapDbError`. DB behaviour is verified with the manual two-account test list in S22.

### 9.6 Per-step self-check (the model prints this at the end of every step)
```
ARCH CHECK
[ ] No logic in app/ pages beyond calling queries/actions
[ ] Inputs validated with zod; auth checked in action/route
[ ] No direct qty/status update; RPCs used
[ ] No phone select outside get_contact
[ ] No secrets or process.env outside server/env.ts and lib/env.client.ts
[ ] Imports follow Section 4 (lint passes)
[ ] UI strings use t()
[ ] npm run check passes
```

---

## 10. Coding standards

- File names `kebab-case.ts`; components `PascalCase.tsx`; named exports (default export only where Next requires).
- Function max ~40 lines, file max ~250 lines. Split instead.
- Comments explain **why**, not what. No dead code, no commented-out blocks, no TODO without a PLAN.md item.
- No `any`. No non-null `!` unless commented why.
- Naming: `getXxx` (query), `createXxxAction` / `updateXxxAction` (mutation), `useXxx` (hook), `XxxSchema` (zod).
- One concern per commit. Message: `feat(listings): ...`, `fix(reservations): ...`, `chore: ...`.
- Dependencies: ask before adding. Prefer platform features.

---

## 11. Performance and scale (free tier)

- Server Components by default; client JS only where interaction needs it.
- Images compressed in browser (<300 KB), `next/image` with `remotePatterns` for the Supabase Storage host.
- DB indexes already in migration 0001 (GIST on location, status+material+created_at).
- Cache materials and impact totals (5 min) using the caching API of the installed Next version; check its docs.
- Static pages for `/about`, landing shell. PWA service worker for the app shell only.
- Supabase free project pauses after inactivity: open it daily near judging; Vercel Hobby has fair-use limits, fine for a hackathon.
- Later scale path (not now): read replicas / pgbouncer, queue for notifications, move AI to a worker.

---

## 12. Migrations and the rate-limit SQL

Rule: every schema change is a new file `supabase/migrations/NNNN_name.sql`, committed, then run in the SQL editor. Never edit an applied migration. Move the kit's `schema.sql` to `0001_init.sql`.

`0002_rate_limit.sql`
```sql
create table rate_limits (
  key text primary key,
  window_start timestamptz not null default now(),
  count int not null default 0
);
alter table rate_limits enable row level security;   -- no policies: no client access

create or replace function check_rate_limit(p_key text, p_limit int, p_window_seconds int)
returns boolean language plpgsql security definer set search_path = public as $$
declare v rate_limits;
begin
  insert into rate_limits (key, window_start, count) values (p_key, now(), 1)
  on conflict (key) do update set
    window_start = case when rate_limits.window_start < now() - make_interval(secs => p_window_seconds)
                        then now() else rate_limits.window_start end,
    count = case when rate_limits.window_start < now() - make_interval(secs => p_window_seconds)
                 then 1 else rate_limits.count + 1 end
  returning * into v;
  return v.count <= p_limit;
end $$;

-- Only the server (service_role) may call it, so users cannot burn each other's limits
revoke execute on function check_rate_limit(text, int, int) from public, anon, authenticated;
grant execute on function check_rate_limit(text, int, int) to service_role;
```

---

## 13. Security checklist (also feeds docs/SECURITY.md)

- RLS enabled on every table; test with two accounts.
- Storage: uploads only into `<uid>/...`; validate type and size client and server; ignore EXIF GPS.
- Security headers in `next.config` (CSP basics, `X-Content-Type-Options`, `Referrer-Policy`, frame protection).
- Cookies httpOnly via `@supabase/ssr`. No tokens in localStorage by custom code.
- Telegram webhook verified with a secret token header.
- Reports + admin removal; prohibited items list shown on the sell page.
- Rotate any key that ever touches git history.

---

## 13. Definition of Done (every step)

1. Works at 390 px on a real phone. Loading, empty, error states exist.
2. `npm run check` passes (lint, types, tests, build).
3. ARCH CHECK block printed with all boxes ticked.
4. PLAN.md updated, commit pushed.

---

## 14. Decision log (ADRs)

| # | Decision | Why |
|---|---|---|
| 1 | Next.js monolith + Supabase | One deploy, free tier, fastest for solo |
| 2 | Feature slices + thin layers | Easy for AI and humans to navigate; scales by adding slices |
| 3 | RLS + RPCs as the security core | App bugs cannot leak phone numbers or break quantities |
| 4 | Server Actions for mutations, Route Handlers only for API/webhooks | Less boilerplate, typed end to end |
| 5 | Result type, no thrown expected errors | Predictable UI error handling |
| 6 | ESLint boundaries + CI | Rules enforced by the machine, not by prompts alone |
| 7 | URL params for UI state | Shareable filters, no global store |
| 8 | Email+password auth first | Supabase free email limits break magic links; Google optional |
| 9 | Leaflet + OSM | No billing, no card |
| 10 | Admin client confined to `src/server/**` | Smallest blast radius for service_role |

New decision = add a row here before coding it.

---

## 15. Step S2.5: Architecture hardening (do this NOW, before S3)

Use Claude for this step (it sets rules for everything after).

```
STEP: S2.5 Architecture hardening
TASK: Read docs/ARCHITECTURE.md fully. Reconcile the existing scaffold (S1, S2) with it:
1. Create the folder skeleton from Section 3 (empty folders get a .gitkeep). Move existing components to components/ui and components/layout. Keep pages thin.
2. Add src/lib/result.ts and src/lib/errors.ts (mapDbError stub), src/lib/format.ts, src/lib/geo.ts (toPointWKT), src/lib/price.ts (condition factors: good 0.75, fair 0.65, damaged 0.45).
3. Add src/server/env.ts (zod, server-only) and src/lib/env.client.ts; no other file reads process.env.
4. Add src/server/logger.ts.
5. Add i18n skeleton: src/i18n/en.json, ta.json (same keys), t.ts, locale.ts. Convert existing hardcoded UI strings in the layout/nav to t().
6. Add the ESLint rules from Section 9.2, the scripts from 9.1, vitest with tests for price.ts and geo.ts, and .github/workflows/ci.yml from 9.4.
7. Add supabase/migrations/ with 0001_init.sql (copy of schema.sql) and 0002_rate_limit.sql (Section 12). Do NOT run SQL; I will run it.
8. Set tsconfig strict + noUncheckedIndexedAccess. Add next.config security headers and image remotePatterns placeholder.
FILES ALLOWED: the ones above only. No new dependencies except vitest, server-only, zod (if missing).
DONE WHEN: npm run check passes; lint fails if I deliberately import @/features from a file in src/components (test it, then remove the test); PLAN.md has S2.5 ticked. Print the ARCH CHECK block.
```

---

## 16. Updated GEMINI.md (replace the old one; it must stay short)

```markdown
# SiteSwap rules
Project: P2P marketplace for leftover construction materials. Arbiter Hacks V1, Theme "Rethinking Waste". Solo dev, free tier only.
Architecture: docs/ARCHITECTURE.md is law. Read the sections relevant to the task. Progress: PLAN.md.

## Hard rules
1. ONE step per chat. Before coding list the files you will touch (max 5 bullets). Then code. No edits outside the step.
2. Follow docs/ARCHITECTURE.md Sections 3 (folders), 4 (imports), 6 (patterns). Lint enforces imports; never disable lint rules.
3. Server Actions return Result<T>. Validate with zod. Call requireUser() in every protected action/page.
4. qty/status only via RPCs. phone only via get_contact. service_role only inside src/server/**.
5. No process.env outside src/server/env.ts and src/lib/env.client.ts. Never print secrets.
6. All UI text via t(). Mobile-first 390px. Dark theme. Loading/empty/error states.
7. Do not invent APIs or packages. Check installed types/docs. Ask before adding a dependency.
8. Finish with: npm run check (fix until green), the ARCH CHECK block (ARCHITECTURE.md 9.6), what changed, how to test, PLAN.md tick.
```

---

## 17. Architecture audit prompt (run after every module, with Claude or any model)

```
Audit the repo against docs/ARCHITECTURE.md. Do not change code yet. Report only violations as a table: file | rule (section) | problem | fix. Check: layer imports, "use server"/server-only placement, process.env usage, direct qty/status updates, phone selects, missing zod/requireUser, hardcoded UI strings, files over 250 lines, any/non-null assertions, missing loading/empty/error states. Then wait for my approval before fixing.
```
