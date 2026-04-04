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

/** Path segments after /api (no leading/trailing slashes). */
export function apiPathSegments(req: any): string[] {
  const raw = String(req.url || "/").split("?")[0];
  return raw
    .replace(/^\/api\/?/i, "")
    .split("/")
    .filter(Boolean);
}
