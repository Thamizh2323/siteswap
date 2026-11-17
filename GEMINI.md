# SiteSwap rules
Project: P2P marketplace to resell leftover construction materials. Hackathon: Arbiter Hacks V1, Theme "Rethinking Waste". Solo dev. Free tier only.
Full spec: docs/BLUEPRINT.md (read only the part named in the task). Progress: PLAN.md.

## Stack (do not change)
Next.js App Router + TypeScript strict + Tailwind. Supabase (Postgres+PostGIS, Auth, Storage) via `@supabase/ssr`. Gemini via the official `@google/genai` SDK, server-side only. Leaflet + OpenStreetMap. Vercel Hobby. PWA.

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
