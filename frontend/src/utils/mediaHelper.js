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
    // 1. If it's a PDF, ensure we try 'raw/upload' if 'image/upload' is failing
    // Since models.py was changed to resource_type="raw", this is the correct path
    if (url.endsWith(".pdf") && url.includes("/image/upload/")) {
      url = url.replace("/image/upload/", "/raw/upload/");
    }
    
    // 2. Keep the version (e.g., /v1234/) as it's often required for security
    // Only remove it if it's explicitly causing issues, but 401 usually means we need MORE info, not less.
  }

  return url;
};