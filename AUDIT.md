# Audit — kavicode portfolio

Written before any redesign work, per engineering-prompt Step 0.

## Stack

- **Vite + React 18 + TypeScript SPA** (not Next.js), React Router v7 (`BrowserRouter`, single route `/` today).
- Tailwind CSS v4, CSS-first config (no `tailwind.config.*`), theme vars in `frontend/src/styles/theme.css` (imported globally, defines full shadcn-style light/dark palette but not currently toggled — `App.tsx` hardcodes its own dark palette inline instead).
- shadcn/Radix UI primitives installed under `frontend/src/app/components/ui/` (~45 components) — currently unused by the live site, reserved for admin forms/tables.
- Framer Motion (package `motion`, imported as `motion/react`), `lucide-react` icons, `next-themes` (installed, unused).
- Backend: one Vercel serverless catch-all function. **`api/[...path].ts` at the repo root is the live deployed handler** (Vercel Root Directory = repo root); `frontend/api/[...path].ts` is a manually-synced mirror for an alternate deploy config. Node/TS, `@ts-nocheck`, Mongoose + MongoDB Atlas.

## Routes

Only `/` exists (`frontend/src/app/App.tsx`); `*` redirects to `/`. No `/admin` route yet.

## Homepage sections → content source

| Section | Component | Source |
|---|---|---|
| Cursor | `KaviCursor.tsx` | n/a |
| Navbar | `KaviNavbar.tsx` | hardcoded |
| Hero | `KaviHero.tsx` | `data.hero` (`/api/hero`, fallback `defaultPortfolioContent.hero`) |
| About | `KaviAbout.tsx` | `data.about` |
| Timeline (experience+education) | `KaviTimeline.tsx` | `data.experiences` + `data.education` |
| Skills | `KaviSkills.tsx` | `data.skills` |
| Projects | `KaviWorks.tsx` | `data.projects` (name-merged with `lib/defaultProjects.ts`) |
| Contact | `KaviContact.tsx` | `data.contact` |
| Footer | `KaviFooter.tsx` | hardcoded |

Data flow: `frontend/src/app/data/portfolioData.ts` (`PortfolioDataProvider`) fetches all 7 endpoints in parallel, falls back per-section to `frontend/lib/defaultPortfolioContent.ts` / `defaultProjects.ts` on failure/empty. `frontend/src/app/lib/portfolioMappers.ts` maps raw Mongo docs to frontend types.

## Backend

7 Mongoose models in `frontend/models/`: About, Contact, Education, Experience, Hero, Project, Skill. REST surface: CRUD + `/reorder` for projects/skills/experience/education, `GET/PUT` singletons for about/hero/contact, `POST /api/admin/upload-image` (Vercel Blob), `POST /api/admin/seed-defaults`, `GET /api/health`.

**Auth today**: `requireAdmin()` in `frontend/lib/api/helpers.ts` checks `x-admin-secret` header against `process.env.ADMIN_SECRET` — a shared secret, not real per-user login. Being replaced with bcrypt + JWT single-admin auth (see plan).

## ⚠️ Flagged risk — not remediated in this pass

`frontend/.env` is committed to git and contains **live plaintext credentials**: MongoDB Atlas connection string (with password), `ADMIN_SECRET`, and `NEXT_PUBLIC_ADMIN_SECRET` (client-exposed). Per explicit user decision, rotating these credentials and rewriting git history is out of scope for this work — flagging here as a critical follow-up the user should handle directly in the MongoDB Atlas and Vercel dashboards.

## Dead code (deleted as part of this work)

Zero imports found anywhere in `src/`: `frontend/src/app/components/{About,Contact,CustomCursor,Experience,Footer,Hero,Nav,Projects,TechStack}.tsx` and all of `frontend/src/app/portfolio/`. Superseded by the `Kavi*` component set.

## Theming

`theme.css` defines complete light/dark CSS variables via `@custom-variant dark (&:is(.dark *))` but nothing toggles the `.dark` class — `App.tsx` overrides with a hardcoded inline `<style>` block. `next-themes` is installed but unused. Fixed in this work (theme provider + toggle wired to existing tokens).

## Hero video

No video support previously — `Hero` model/`HeroData` only has a static `heroPhoto`. Adding `heroVideo`/`heroVideoPoster`/`heroGradient` fields; actual video file to be supplied by the user later.

## Assets

`frontend/public/`: `cv.pdf`, `profile.png`, `favicon-k.svg`, `photos/` (7 images referenced by `defaultProjects.ts`). Stray duplicate assets at the repo root (outside `frontend/`) are left untouched, out of scope.

---

Full implementation plan: `~/.claude/plans/portfolio-ui-clone-inherited-crane.md`.
