/**
 * Re-exports the repo-root handler so `vercel dev` run from `frontend/` still resolves /api/*.
 * Production: set Vercel "Root Directory" to the repository root (not `frontend`) so `api/` at repo root deploys.
 */
export { default } from "../../api/[...path].js";
