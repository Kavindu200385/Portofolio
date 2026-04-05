import { adminPost } from "./portfolioApi";

/** Resize in-browser and encode as JPEG to keep upload payloads small. */
export async function fileToCompressedDataUrl(file: File, maxEdge = 1920, quality = 0.82): Promise<string> {
  const bitmap = await createImageBitmap(file);
  try {
    const w = bitmap.width;
    const h = bitmap.height;
    const scale = Math.min(1, maxEdge / Math.max(w, h, 1));
    const cw = Math.max(1, Math.round(w * scale));
    const ch = Math.max(1, Math.round(h * scale));
    const canvas = document.createElement("canvas");
    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not prepare image canvas.");
    ctx.drawImage(bitmap, 0, 0, cw, ch);
    return canvas.toDataURL("image/jpeg", quality);
  } finally {
    bitmap.close();
  }
}

export async function uploadImageDataUrl(dataUrl: string): Promise<string> {
  const out = await adminPost<{ url: string }>("/api/admin/upload-image", { dataUrl });
  if (!out?.url || typeof out.url !== "string") {
    throw new Error("Upload did not return a URL.");
  }
  return out.url;
}
