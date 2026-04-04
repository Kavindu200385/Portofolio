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

export function getId(req: any): string | undefined {
  const q = req.query?.id ?? req.query?.slug;
  if (Array.isArray(q)) return q[0];
  return q as string | undefined;
}
