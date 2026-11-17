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

# SiteSwap Workspace Rules (Antigravity)
Project: SiteSwap — P2P marketplace to resell leftover construction materials (Arbiter Hacks V1, Theme: "Rethinking Waste").
Progress tracker: PLAN.md. Database schema: supabase/schema.sql.

## Tech Stack (Strict)
- Framework: Next.js (App Router), TypeScript (strict), Tailwind CSS, PWA.
- Backend/DB/Auth/Storage: Supabase (`@supabase/ssr`, `@supabase/supabase-js`) with Postgres + PostGIS.
- AI Vision: Gemini API via `@google/genai` (server-side route handlers only).
- Maps: Leaflet + OpenStreetMap (client-side dynamic import, `ssr: false`, dark-styled tiles).
- Validation: `zod` on every form, API route, and environment variable.

## Visual Design System (Exact UI Tokens)
- Theme: Dark-first, high-contrast industrial minimalism.
- Colors:
  - Canvas background: `#09090B`
  - Elevated card/surface: `#141417` with `1px solid #27272A` border
  - Primary text: `#FAFAFA` | Muted text: `#A1A1AA`
  - Primary accent: Construction Amber `#F59E0B` (hover `#D97706`, text on amber `#09090B`)
  - Semantic positive/savings/accepted/WhatsApp: Emerald `#10B981` / `#22C55E`
  - Semantic warning/pending/fair: Amber `#F59E0B`
  - Semantic danger/damaged: Red `#EF4444`
- Typography: Clean geometric sans (Inter / Plus Jakarta Sans), tabular numbers (`tabular-nums`) for prices, quantities, distances, and impact metrics.
- Bilingual i18n: `EN | தமிழ்` segmented pill toggle in the top header; zero hardcoded UI strings once `src/i18n` dictionaries (`en.json`, `ta.json`) are wired.

## Responsive All-Device Architecture (Mobile + Tablet + Desktop)
- Mobile (`< 768px`, tested at `390px`):
  - Sticky top bar (`SiteSwap` geometric cube logo + `EN | தமிழ்` toggle).
  - Fixed bottom 5-tab navigation bar (`Browse`, `Sell`, `Reservations`, `Impact`, `Profile`) with amber active indicator.
  - Single-column card stacks and 2x2 KPI grids.
- Tablet & Desktop (`>= 768px` and `>= 1280px`):
  - Hide bottom nav (`md:hidden`); render top horizontal navigation links (`Browse`, `Sell`, `Reservations`, `Impact`, `Profile`) inside the sticky `max-w-7xl mx-auto` header alongside the logo and `EN | தமிழ்` toggle.
  - Expand single-column feeds into responsive multi-column grids (`md:grid-cols-2 lg:grid-cols-3`) and 2-column split layouts for detail, form, and map views.

## Security & Engineering Rules
1. Execute ONE step from `PLAN.md` per task. Before writing code, output a 5-bullet plan and the exact files to create/edit.
2. Folder structure: `src/app` (thin routes), `src/components/ui` (reusable primitives), `src/components/layout` (`AppShell`), `src/features/<domain>` (actions, queries, schemas, types), `src/lib`, `src/server`, `src/i18n`.
3. Never expose `SUPABASE_SERVICE_ROLE_KEY` or `GEMINI_API_KEY` to the client.
4. Phone numbers must NEVER be queried directly from `profiles` on the client; reveal phone numbers exclusively via the `get_contact(p_res)` RPC after reservation status is `accepted` or `completed`.
5. All quantity and status mutations must execute through Supabase SQL RPCs (`reserve_listing`, `respond_reservation`, `complete_reservation`, `expire_reservations`), never direct table updates.
6. Always run `npm run lint && npm run build` and resolve all errors before marking a step complete.