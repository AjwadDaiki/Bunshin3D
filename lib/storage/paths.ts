export const STORAGE_PUBLIC_PREFIX = "/storage/v1/object/public/";

export function extractStoragePath(url: string | null | undefined, bucket = "uploads") {
  if (!url) return null;
  const target = `${STORAGE_PUBLIC_PREFIX}${bucket}/`;
  const index = url.indexOf(target);
  if (index === -1) return null;
  return url.slice(index + target.length);
}
