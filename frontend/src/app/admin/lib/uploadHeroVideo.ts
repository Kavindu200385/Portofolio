import { upload } from "@vercel/blob/client";
import { apiUrl } from "../../lib/apiBase";

export async function uploadHeroVideo(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<string> {
  const blob = await upload(file.name, file, {
    access: "public",
    handleUploadUrl: apiUrl("/api/admin-hero-video-upload"),
    onUploadProgress: (event) => onProgress?.(event.percentage),
  });
  return blob.url;
}
