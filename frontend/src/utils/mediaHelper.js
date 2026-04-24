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
    // This is the CRITICAL fix for 401 errors on Cloudinary HTTPS links.
    url = url.replace(/\/v\d+\//, "/");
    
    // 2. Ensure we use 'image/upload' for PDFs on this account as 'raw' 404s.
    // We already have 'image/upload' in the original path usually.
  }

  return url;
};