// @ts-nocheck

export function requireAdmin(req: any, res: any): boolean {
  const secret = process.env.ADMIN_SECRET;
  const header = req.headers["x-admin-secret"];
  const v = Array.isArray(header) ? header[0] : header;
  if (!secret || v !== secret) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}

/**
 * Path segments after /api (e.g. `projects`, `507f…` for PUT /api/projects/:id).
 * Vercel may set `req.url` to `/api/...`, `/...` (no /api), or a full URL — normalize all cases.
 */
export function apiPathSegments(req: any): string[] {
  let raw =
    req.url ??
    req.originalUrl ??
    req.headers?.["x-invoke-path"] ??
    req.headers?.["x-vercel-original-path"] ??
    "/";
  if (typeof raw !== "string") raw = String(raw || "/");
  let path = raw.split("?")[0];
  try {
    if (path.startsWith("http://") || path.startsWith("https://")) {
      path = new URL(path).pathname;
    }
  } catch {
    /* keep path */
  }
  if (!path || path === "/") return [];
  // Strip /api when present; serverless may already omit it
  if (path === "/api" || path.startsWith("/api/")) {
    path = path.slice(4);
    if (path.startsWith("/")) path = path.slice(1);
  } else if (path.startsWith("/")) {
    path = path.slice(1);
  }
  if (!path) return [];
  return path.split("/").filter(Boolean);
}
