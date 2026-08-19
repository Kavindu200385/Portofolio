// @ts-nocheck
import { put } from "@vercel/blob";

// Kept in sync with the client-side cap (frontend/src/app/admin/lib/uploadImage.ts) — 3MB
// raw, so its base64 form stays under Vercel's ~4.5MB serverless request body limit.
const MAX_BYTES = 3 * 1024 * 1024;

/**
 * Parses a browser data URL, uploads bytes to Vercel Blob, returns public https URL.
 */
export async function uploadPortfolioImageFromDataUrl(dataUrl: string): Promise<{ url?: string; error?: string; status?: number }> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token?.trim()) {
    return {
      status: 503,
      error:
        "Image upload is not configured. Set BLOB_READ_WRITE_TOKEN in Vercel (Storage → Blob) or in .env.local for local dev.",
    };
  }
  const raw = String(dataUrl ?? "").trim();
  const m = /^data:(image\/[a-zA-Z0-9.+-]+);base64,([\s\S]+)$/.exec(raw);
  if (!m) {
    return { status: 400, error: "Expected a base64 image data URL (data:image/...;base64,...)." };
  }
  const mime = m[1];
  let buf: Buffer;
  try {
    buf = Buffer.from(m[2].replace(/\s/g, ""), "base64");
  } catch {
    return { status: 400, error: "Invalid base64 in data URL." };
  }
  if (buf.length > MAX_BYTES) {
    return { status: 400, error: `Image is too large (max ${Math.floor(MAX_BYTES / (1024 * 1024))} MB after compression).` };
  }
  const ext =
    mime === "image/png" ? "png" : mime === "image/webp" ? "webp" : mime === "image/gif" ? "gif" : "jpg";
  const pathname = `portfolio/${Date.now()}-${Math.random().toString(36).slice(2, 11)}.${ext}`;
  try {
    const blob = await put(pathname, buf, {
      access: "public",
      token,
      contentType: mime,
    });
    if (!blob?.url) {
      return { status: 500, error: "Upload did not return a URL." };
    }
    return { url: blob.url };
  } catch (e) {
    return { status: 500, error: e?.message || String(e) };
  }
}

const DOCUMENT_MIME_EXT: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

/**
 * Parses a browser data URL for a résumé/CV document, uploads bytes to Vercel Blob,
 * returns public https URL.
 */
export async function uploadPortfolioDocumentFromDataUrl(dataUrl: string): Promise<{ url?: string; error?: string; status?: number }> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token?.trim()) {
    return {
      status: 503,
      error:
        "File upload is not configured. Set BLOB_READ_WRITE_TOKEN in Vercel (Storage → Blob) or in .env.local for local dev.",
    };
  }
  const raw = String(dataUrl ?? "").trim();
  const m = /^data:([a-zA-Z0-9.+-]+\/[a-zA-Z0-9.+-]+);base64,([\s\S]+)$/.exec(raw);
  if (!m) {
    return { status: 400, error: "Expected a base64 document data URL." };
  }
  const mime = m[1];
  const ext = DOCUMENT_MIME_EXT[mime];
  if (!ext) {
    return { status: 400, error: "Unsupported file type — upload a PDF or Word document." };
  }
  let buf: Buffer;
  try {
    buf = Buffer.from(m[2].replace(/\s/g, ""), "base64");
  } catch {
    return { status: 400, error: "Invalid base64 in data URL." };
  }
  if (buf.length > MAX_BYTES) {
    return { status: 400, error: `File is too large (max ${Math.floor(MAX_BYTES / (1024 * 1024))} MB).` };
  }
  const pathname = `portfolio/${Date.now()}-${Math.random().toString(36).slice(2, 11)}.${ext}`;
  try {
    const blob = await put(pathname, buf, {
      access: "public",
      token,
      contentType: mime,
    });
    if (!blob?.url) {
      return { status: 500, error: "Upload did not return a URL." };
    }
    return { url: blob.url };
  } catch (e) {
    return { status: 500, error: e?.message || String(e) };
  }
}
