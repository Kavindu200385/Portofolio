// @ts-nocheck
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

export const ADMIN_SESSION_COOKIE = "admin_session";

function getSecretKey() {
  // Env vars pasted via a dashboard UI or copied from a code block frequently pick up a
  // trailing newline/space — trim defensively so that doesn't silently break signing/verification.
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret) throw new Error("JWT_SECRET is not configured");
  return new TextEncoder().encode(secret);
}

export function adminCredentialsConfigured(): boolean {
  return Boolean(process.env.ADMIN_EMAIL?.trim() && process.env.ADMIN_PASSWORD_HASH?.trim());
}

export async function verifyAdminCredentials(email: string, password: string): Promise<boolean> {
  const expectedEmail = process.env.ADMIN_EMAIL?.trim();
  const expectedHash = process.env.ADMIN_PASSWORD_HASH?.trim();
  if (!expectedEmail || !expectedHash) return false;
  if (typeof email !== "string" || email.trim().toLowerCase() !== expectedEmail.toLowerCase()) {
    return false;
  }
  if (typeof password !== "string" || !password) return false;
  return bcrypt.compare(password, expectedHash);
}

export async function signAdminJwt(email: string): Promise<string> {
  return new SignJWT({ sub: email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());
}

export async function verifyAdminJwt(token: string): Promise<{ sub: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (typeof payload.sub !== "string") return null;
    return { sub: payload.sub };
  } catch {
    return null;
  }
}

export function readSessionCookie(req: any): string | null {
  const header = req.headers?.cookie;
  if (typeof header !== "string" || !header) return null;
  const parts = header.split(";");
  for (const part of parts) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const name = part.slice(0, idx).trim();
    if (name === ADMIN_SESSION_COOKIE) {
      return decodeURIComponent(part.slice(idx + 1).trim());
    }
  }
  return null;
}

function isLocalDev(): boolean {
  return !process.env.VERCEL_ENV;
}

export function setSessionCookie(res: any, token: string) {
  const secureAttr = isLocalDev() ? "" : "; Secure";
  res.setHeader(
    "Set-Cookie",
    `${ADMIN_SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800${secureAttr}`,
  );
}

export function clearSessionCookie(res: any) {
  const secureAttr = isLocalDev() ? "" : "; Secure";
  res.setHeader(
    "Set-Cookie",
    `${ADMIN_SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secureAttr}`,
  );
}

/** Drop-in replacement for the old `requireAdmin` — same false/401 contract. */
export async function requireAdminJwt(req: any, res: any): Promise<boolean> {
  const token = readSessionCookie(req);
  const payload = token ? await verifyAdminJwt(token) : null;
  if (!payload) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}
