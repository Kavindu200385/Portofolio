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
  const res = await fetch(path, { method: "GET" });
  if (!res.ok) {
    const body = await parseJson(res);
    throw new Error((body as { error?: string })?.error || `Request failed (${res.status})`);
  }
  return (await res.json()) as T;
}

export async function adminPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-secret": adminSecret(),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    let msg = `Request failed (${res.status})`;
    try {
      const b = JSON.parse(text) as { error?: string };
      if (b?.error) msg = b.error;
    } catch {
      if (res.status === 404) msg = "Not found — API route may not match. Redeploy and check /api/health.";
    }
    throw new Error(msg);
  }
  return parseJsonResponse<T>(res);
}

export async function adminPut<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-admin-secret": adminSecret(),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    let msg = `Request failed (${res.status})`;
    try {
      const b = JSON.parse(text) as { error?: string };
      if (b?.error) msg = b.error;
    } catch {
      if (res.status === 404) msg = "Not found — API route may not match. Redeploy and check /api/health.";
    }
    throw new Error(msg);
  }
  return parseJsonResponse<T>(res);
}

export async function adminDelete<T>(path: string): Promise<T> {
  const res = await fetch(path, {
    method: "DELETE",
    headers: {
      "x-admin-secret": adminSecret(),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    let msg = `Request failed (${res.status})`;
    try {
      const b = JSON.parse(text) as { error?: string };
      if (b?.error) msg = b.error;
    } catch {
      if (res.status === 404) msg = "Not found — API route may not match. Redeploy and check /api/health.";
    }
    throw new Error(msg);
  }
  return parseJsonResponse<T>(res);
}
