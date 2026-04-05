import { apiUrl } from "./apiBase";

const adminSecret = () =>
  String(
    (import.meta.env as Record<string, string | undefined>).NEXT_PUBLIC_ADMIN_SECRET ??
      (import.meta.env as Record<string, string | undefined>).VITE_ADMIN_SECRET ??
      "",
  );

/** True when env has a non-empty admin secret (required for POST/PUT/DELETE). */
export function isAdminSecretConfigured(): boolean {
  return Boolean(adminSecret().trim());
}

/** Vercel serverless JSON bodies are capped (~4.5 MB). Stay under this to avoid 500 from the edge. */
const MAX_ADMIN_BODY_BYTES = 4 * 1024 * 1024;

function assertAdminBodyFitsLimit(body: unknown): void {
  if (body === undefined) return;
  const json = JSON.stringify(body);
  const bytes = new TextEncoder().encode(json).length;
  if (bytes > MAX_ADMIN_BODY_BYTES) {
    const mb = (bytes / (1024 * 1024)).toFixed(1);
    throw new Error(
      `Save payload is too large (${mb} MB). Hosting limits requests to about 4.5 MB. ` +
        `Replace large pasted images with a URL (Imgur, GitHub raw, Cloudinary, etc.) or use smaller files, then save again.`,
    );
  }
}

function looksLikeHtml(s: string): boolean {
  const t = s.trim().slice(0, 80).toLowerCase();
  return t.startsWith("<!doctype") || t.startsWith("<html");
}

function adminErrorMessage(res: Response, text: string, fallback: string): string {
  if (res.status === 413) {
    return "Request body too large for the server (about 4.5 MB max). Use image URLs instead of huge base64 photos.";
  }
  try {
    const b = JSON.parse(text) as { error?: string };
    if (b?.error) return b.error;
  } catch {
    /* ignore */
  }
  if (res.status === 404 && looksLikeHtml(text)) {
    return (
      "API returned a web page instead of JSON (routing issue). Fix: In Vercel → Settings → General, set Root Directory to empty (repo root) OR to `frontend`, then redeploy—only one should match your repo. " +
      "If you use `npm run dev` locally, run `npx vercel dev --listen 3000` in `frontend` and keep the Vite proxy, or set VITE_API_URL in .env to your live API URL (e.g. https://kavicode.vercel.app)."
    );
  }
  if (res.status === 404) {
    return (
      fallback ||
      "API path not found. Open /api/health in the browser. Set VITE_API_URL in frontend/.env if the API is on another host."
    );
  }
  if (res.status === 500 && /FUNCTION_INVOCATION_FAILED|server error/i.test(text)) {
    return fallback;
  }
  return fallback || `Request failed (${res.status})`;
}

async function parseJson(res: Response) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function parseJsonResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) return {} as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return {} as T;
  }
}

export async function publicGet<T>(path: string): Promise<T> {
  const res = await fetch(apiUrl(path), { method: "GET" });
  if (!res.ok) {
    const body = await parseJson(res);
    throw new Error((body as { error?: string })?.error || `Request failed (${res.status})`);
  }
  return (await res.json()) as T;
}

export async function adminPost<T>(path: string, body: unknown): Promise<T> {
  assertAdminBodyFitsLimit(body);
  const res = await fetch(apiUrl(path), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-secret": adminSecret(),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      adminErrorMessage(
        res,
        text,
        `Request failed (${res.status}). If the payload is huge (base64 images), shrink it or use image URLs.`,
      ),
    );
  }
  return parseJsonResponse<T>(res);
}

export async function adminPut<T>(path: string, body?: unknown): Promise<T> {
  assertAdminBodyFitsLimit(body);
  const res = await fetch(apiUrl(path), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-admin-secret": adminSecret(),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      adminErrorMessage(
        res,
        text,
        `Request failed (${res.status}). If the payload is huge (base64 images), shrink it or use image URLs.`,
      ),
    );
  }
  return parseJsonResponse<T>(res);
}

export async function adminDelete<T>(path: string): Promise<T> {
  const res = await fetch(apiUrl(path), {
    method: "DELETE",
    headers: {
      "x-admin-secret": adminSecret(),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      adminErrorMessage(res, text, `Request failed (${res.status})`),
    );
  }
  return parseJsonResponse<T>(res);
}
