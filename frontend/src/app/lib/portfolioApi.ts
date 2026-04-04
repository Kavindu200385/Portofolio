const adminSecret = () =>
  String(
    (import.meta.env as Record<string, string | undefined>).NEXT_PUBLIC_ADMIN_SECRET ??
      (import.meta.env as Record<string, string | undefined>).VITE_ADMIN_SECRET ??
      "",
  );

async function parseJson(res: Response) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
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
    const b = await parseJson(res);
    throw new Error((b as { error?: string })?.error || `Request failed (${res.status})`);
  }
  return (await res.json()) as T;
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
    const b = await parseJson(res);
    throw new Error((b as { error?: string })?.error || `Request failed (${res.status})`);
  }
  return (await res.json()) as T;
}

export async function adminDelete<T>(path: string): Promise<T> {
  const res = await fetch(path, {
    method: "DELETE",
    headers: {
      "x-admin-secret": adminSecret(),
    },
  });
  if (!res.ok) {
    const b = await parseJson(res);
    throw new Error((b as { error?: string })?.error || `Request failed (${res.status})`);
  }
  return (await res.json()) as T;
}
