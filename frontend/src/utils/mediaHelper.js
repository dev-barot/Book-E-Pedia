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
    // 1. Remove versioning which causes 401 on HTTPS
    url = url.replace(/\/v\d+\//, "/");
    
    // 2. For PDFs, Cloudinary often works better with 'raw/upload' over HTTPS
    // to avoid image-specific security headers or signature mismatches.
    if (url.endsWith(".pdf") && url.includes("/image/upload/")) {
       url = url.replace("/image/upload/", "/raw/upload/");
    }
  }

  return url;
};