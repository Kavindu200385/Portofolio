# MongoDB Atlas & environment setup

All HTTP routes under `/api/*` are handled by **one** Vercel Serverless Function (`api/[...path].ts`) so deployments stay within the **Hobby plan limit** (12 functions per deployment). Shared logic lives in `lib/api/` and is bundled into that function—not deployed as separate functions.

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free account.
2. Create a free **M0** cluster.
3. Create a **database user** with a password.
4. Under **Network Access**, add **0.0.0.0/0** to the IP whitelist (allow all IPs) so Vercel serverless functions can connect.
5. Click **Connect** → **Drivers** and copy the connection string.
6. Replace `<password>` with your database user password.
7. Add the connection string as **`MONGODB_URI`** in the Vercel project **Environment Variables** and in local **`.env.local`** (see `.env.local.example`).
8. Set **`ADMIN_SECRET`** and **`NEXT_PUBLIC_ADMIN_SECRET`** to the same secret value in both places (used for `x-admin-secret` on mutating API routes).
9. Redeploy on Vercel after changing environment variables.

## Local development

- **Frontend (Vite):** `npx vite` (or your package script). Requests to `/api/*` are proxied to `http://127.0.0.1:3000` — run **`npx vercel dev`** in this `frontend` folder on port 3000 so API routes and MongoDB work locally.
- Alternatively, run only the static app without APIs (portfolio sections fall back to built-in default data when API calls fail).
