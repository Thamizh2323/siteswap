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
