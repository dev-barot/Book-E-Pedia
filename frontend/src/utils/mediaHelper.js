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
    console.log("DEBUG: Processing Cloudinary URL (v1.0.7)");
    
    // 1. Remove versioning (e.g., /v123456789/)
    url = url.replace(/\/v\d+\//, "/");
    
    // 2. TRIPLE-CHECK PDF PATH
    // We try to ensure it uses a folder that exists. 
    // If it's a PDF and has 'raw', we try 'image' first as it's most common.
    if (url.toLowerCase().endsWith(".pdf")) {
      if (url.includes("/raw/upload/")) {
        url = url.replace("/raw/upload/", "/image/upload/");
      } else if (url.includes("/files/upload/")) {
        url = url.replace("/files/upload/", "/image/upload/");
      }
    }
  }

  // Cleanup: Ensure no double slashes after the domain (except after http://)
  url = url.replace(/([^:]\/)\/+/g, "$1");

  return url;
};