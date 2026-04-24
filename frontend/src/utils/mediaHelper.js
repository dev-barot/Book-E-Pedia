import { BASE_URL } from "./config";

export const getMediaUrl = (path) => {
  if (!path) return null;

  // Already full URL
  if (path.startsWith("http")) return path;

  return `${BASE_URL}${path}`;
};