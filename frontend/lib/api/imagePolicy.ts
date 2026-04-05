// @ts-nocheck

/** Stored images should be URLs (https/http) or site-relative paths — not base64 data URIs. */

export function isDataImageUrl(value: unknown): value is string {
  return typeof value === "string" && value.trim().startsWith("data:image");
}

export function rejectDataImageField(field: string, value: unknown): string | null {
  if (isDataImageUrl(value)) {
    return `${field} must be a hosted image URL (https://... or /path), not an embedded base64 image.`;
  }
  return null;
}

export function rejectDataImagesInStringArray(field: string, arr: unknown): string | null {
  if (!Array.isArray(arr)) return null;
  for (let i = 0; i < arr.length; i++) {
    const err = rejectDataImageField(`${field}[${i}]`, arr[i]);
    if (err) return err;
  }
  return null;
}
