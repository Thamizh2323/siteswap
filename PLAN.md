# SiteSwap — PLAN.md
> Hackathon: Arbiter Hacks V1 | Deadline: Dec 19, 2026 | Solo: THAMIZH_23

Tags: **[C]** use Claude, **[N]** NIM/Gemini fine, **[YOU]** manual step

---

## Phase A: Foundation
- [x] S0 [YOU] Accounts, keys, `.env.local`, GEMINI.md, schema.sql in repo
- [x] S1 [N] Scaffold Next.js + Tailwind + folders + PWA manifest
- [x] S2 [N] Design system + layout + bottom nav (dark theme)
- [x] S2.5 [C] Architecture hardening (docs/ARCHITECTURE.md alignment, layers, ESLint boundaries, vitest)
- [x] S3 [C] Supabase clients (`@supabase/ssr`), env validation, auth middleware
- [x] S4 [YOU] Run schema.sql in Supabase, generate types
- [x] S5 [C] Auth (email+password, Google optional) + profile page + protected routes

## Phase B: Core Product (Must)
- [x] S6 [N] Client-side image compress + upload to Storage
- [x] S7 [C] Gemini analyze route (zod, rate limit, fallback)
- [ ] S8 [N] Post Surplus page (form, price suggestion, location pin)
- [ ] S9 [N] Browse list + filters + pagination
- [ ] S10 [N] Map view + radius search (nearby_listings RPC)
- [ ] S11 [N] Listing detail page
- [ ] S12 [C] Reserve flow + seller/buyer inbox (RPCs)
- [ ] S13 [C] Complete + impact log + contact reveal
- [ ] S14 [N] Impact dashboard + methodology page
- [ ] S15 [N] Landing page with live counters

**🏁 MILESTONE Nov 28: end-to-end demo works (post → browse → reserve → accept → complete)**

## Phase C: Differentiators (Should — build if time allows)
- [ ] S16 [N] Wanted requests + matching
- [ ] S17 [N] Order Estimator
- [ ] S18 [N] Notifications + Telegram bot
- [ ] S19 [N] Tamil / English toggle
- [ ] S20 [N] Report listing + admin page

**🔒 FEATURE FREEZE Dec 5**

## Phase D: Ship
- [ ] S21 [N] PWA polish, Lighthouse fixes, skeleton loaders
- [ ] S22 [C] Security review + RLS tests + AI accuracy test
- [ ] S23 [N] Seed demo data (is_demo = true, clearly labelled)
- [ ] S24 [YOU+N] Deploy to Vercel, set env vars, test logged-out
- [ ] S25 [N] README, docs, screenshots, LICENSE, Devpost text

---

## Cut rules
- Nov 28: If M4 (Reserve flow) not done → cancel Phase C entirely
- Dec 5: No new features after this date, period
