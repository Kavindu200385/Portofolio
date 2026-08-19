# KaviCode — Portfolio

Personal portfolio site for Kavindu Sandaruwan — Full-Stack & DevOps Engineer.
Live at [kavicode.vercel.app](https://kavicode.vercel.app).

Every section (Hero, About, Timeline, Skills, Projects, Contact) is driven by content stored in MongoDB and edited through a custom admin panel — no code changes needed to update the site's content.

## Tech stack

- **Frontend**: Vite + React 18 + TypeScript (SPA), React Router
- **Styling/animation**: Tailwind CSS v4, Framer Motion, shadcn/ui (Radix primitives)
- **Backend**: Vercel serverless functions (single catch-all handler), Mongoose + MongoDB Atlas
- **Auth**: JWT (bcrypt-hashed credentials), HTTP-only cookie session for the admin panel
- **Storage**: Vercel Blob for image/document uploads
- **Deployment**: Vercel

## Features

- Fully responsive, animated public site with dark/light theming
- Custom cursor, scroll-triggered entrance animations, sequenced reveals
- Admin panel (`/admin`) to manage:
  - Hero section (heading, CTAs, background video)
  - About (name, bio, pull quote, credentials, résumé/CV upload, profile photo)
  - Experience & Education timelines
  - Skills grid
  - Projects (CRUD, reordering, image uploads)
  - Contact details
- Image and document (résumé) uploads via Vercel Blob, with client + server size/type validation
- Built-in default content that seeds the database on first run, so the site never renders empty

## Getting started

```bash
cd frontend
npm install
npm run dev
```

Requires a `.env.local` with `MONGODB_URI`, `BLOB_READ_WRITE_TOKEN`, and admin auth secrets — see `frontend/lib/mongodb.ts` and `frontend/lib/api/auth.ts` for the expected variable names.

## Project structure

```
api/[...path].ts          # Vercel serverless catch-all API handler
frontend/
  src/app/components/     # Public site sections (Kavi*.tsx)
  src/app/admin/          # Admin panel pages
  models/                 # Mongoose schemas
  lib/                    # API helpers, default content, uploads
```

## License

Personal project — not licensed for reuse.
