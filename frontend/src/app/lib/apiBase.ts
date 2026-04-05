/**
 * Optional absolute API origin when the UI and API are not same-origin (e.g. static preview + Vercel API),
 * or when `/api` is not reachable from the current host.
 *
 * Set in `.env`: `VITE_API_URL=https://your-site.vercel.app` (no trailing slash).
 */
export function apiUrl(path: string): string {
  const env = import.meta.env as Record<string, string | undefined>;
  const raw = (env.VITE_API_URL ?? env.NEXT_PUBLIC_API_URL ?? "").trim();
  const base = raw.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  if (!base) return p;
  return `${base}${p}`;
}
