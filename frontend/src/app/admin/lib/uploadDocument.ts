import { apiUrl } from "../../lib/apiBase";

// Same rationale/limit as uploadImage.ts — keep the raw file well under Vercel's
// ~4.5MB serverless request body limit once base64-inflated.
const MAX_BYTES = 3 * 1024 * 1024;
const UPLOAD_TIMEOUT_MS = 30_000;
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export async function uploadDocument(file: File): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Unsupported file type — upload a PDF or Word document.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB) — max 3 MB. Compress it and try again.`);
  }

  const dataUrl = await readFileAsDataUrl(file);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(apiUrl("/api/admin-upload-document"), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dataUrl }),
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error("Upload timed out — the file may be too large or the connection too slow. Try a smaller file.");
    }
    throw new Error(err instanceof Error ? err.message : "File upload failed — network error.");
  } finally {
    clearTimeout(timeout);
  }

  if (res.status === 413) {
    throw new Error("File is too large for the server to accept — compress it and try again.");
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json?.error || `File upload failed (${res.status}).`);
  }
  return json.url as string;
}
