import { BASE_URL } from "./config";

export const getMediaUrl = (path) => {
  if (!path) return null;

  let url = path;
  if (!path.startsWith("http")) {
    url = `${BASE_URL}${path}`;
  }

  // Force HTTPS
  url = url.replace(/^http:\/\//i, "https://");

  // Cloudinary Specific Fixes
  if (url.includes("res.cloudinary.com")) {
    // 1. Remove versioning (e.g., /v123456789/)
    // User confirmed this is the CRITICAL fix for 401 errors on this account.
    url = url.replace(/\/v\d+\//, "/");
    
    // 2. We use 'image/upload' for PDFs as 'raw' causes 404s/401s here.
  }

  // Cleanup: Ensure no double slashes after the domain (except after http://)
  url = url.replace(/([^:]\/)\/+/g, "$1");

  return url;
};