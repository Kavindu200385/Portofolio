import { apiUrl } from "../../lib/apiBase";

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export async function uploadImage(file: File): Promise<string> {
  const dataUrl = await readFileAsDataUrl(file);
  const res = await fetch(apiUrl("/api/admin-upload-image"), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dataUrl }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json?.error || "Image upload failed");
  }
  return json.url as string;
}
