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
    // 2. Force 'image/upload' for PDFs
    // If the backend is set to resource_type='raw', it generates 'raw/upload' links.
    // However, PDFs are often better served (and were previously stored) as 'image/upload'.
    if (url.endsWith(".pdf") && url.includes("/raw/upload/")) {
      url = url.replace("/raw/upload/", "/image/upload/");
    }
  }

  // Cleanup: Ensure no double slashes after the domain (except after http://)
  url = url.replace(/([^:]\/)\/+/g, "$1");

  return url;
};