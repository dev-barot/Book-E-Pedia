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
    console.log("DEBUG: Processing Cloudinary URL (v1.0.8)");
    
    // 1. Remove versioning (e.g., /v123456789/)
    url = url.replace(/\/v\d+\//, "/");
    
    // 2. SMART PDF HANDLING
    // We force 'image/upload' and prevent double '.pdf' extensions
    if (url.toLowerCase().includes(".pdf")) {
      url = url.replace("/raw/upload/", "/image/upload/");
      url = url.replace("/files/upload/", "/image/upload/");
      
      // If it has .pdf.pdf, fix it to just .pdf
      url = url.replace(/\.pdf\.pdf$/i, ".pdf");
    }
  }

  // Cleanup: Ensure no double slashes after the domain (except after http://)
  url = url.replace(/([^:]\/)\/+/g, "$1");

  return url;
};