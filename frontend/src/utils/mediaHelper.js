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
    console.log("DEBUG: Processing Cloudinary URL (v1.0.6)");
    
    // 1. Remove versioning (e.g., /v123456789/)
    // This is the CRITICAL fix for 401 errors on this account.
    url = url.replace(/\/v\d+\//, "/");
    
    // 2. AGGRESSIVE PDF PATH FIX
    // PDFs in your account are stored as images. If the backend sends 'raw/upload', 
    // it will ALWAYS 401 or 404. We force it to 'image/upload'.
    if (url.toLowerCase().endsWith(".pdf") || path.toLowerCase().includes(".pdf")) {
      url = url.replace("/raw/upload/", "/image/upload/");
    }
  }

  // Cleanup: Ensure no double slashes after the domain (except after http://)
  url = url.replace(/([^:]\/)\/+/g, "$1");

  return url;
};