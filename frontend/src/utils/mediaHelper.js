import { BASE_URL } from "./config";

export const getMediaUrl = (path) => {
  if (!path) return null;

  let url = path;
  if (!path.startsWith("http")) {
    url = `${BASE_URL}${path}`;
  }

  // Robust HTTPS conversion to prevent "Mixed Content" blocks on Vercel
  // This will catch 'http://' at the start of the string regardless of case
  return url.replace(/^http:\/\//i, "https://");
};