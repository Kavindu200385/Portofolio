import { apiUrl } from "../../lib/apiBase";

// Base64 inflates the raw file by ~4/3, plus a little JSON-wrapper overhead — Vercel's
// serverless functions hard-reject any request body over ~4.5MB (a 413 at the platform level,
// before our code even runs). Cap the RAW file well under the point where its base64 form
// would cross that line, so the client-side check actually protects against the real limit.
const MAX_BYTES = 3 * 1024 * 1024;
// A hung request (e.g. a serverless function timeout that doesn't cleanly close the
// connection) should never leave the UI stuck on "Uploading…" forever with no feedback.
const UPLOAD_TIMEOUT_MS = 30_000;

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export async function uploadImage(file: File): Promise<string> {
  if (file.size > MAX_BYTES) {
    throw new Error(`Image is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB) — max 3 MB. Compress or resize it and try again.`);
  }

  const dataUrl = await readFileAsDataUrl(file);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(apiUrl("/api/admin-upload-image"), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dataUrl }),
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error("Upload timed out — the image may be too large or the connection too slow. Try a smaller image.");
    }
    throw new Error(err instanceof Error ? err.message : "Image upload failed — network error.");
  } finally {
    clearTimeout(timeout);
  }

  if (res.status === 413) {
    throw new Error("Image is too large for the server to accept — compress or resize it and try again.");
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json?.error || `Image upload failed (${res.status}).`);
  }
  return json.url as string;
}
