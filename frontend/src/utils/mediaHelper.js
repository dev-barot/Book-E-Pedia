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
    if (url.toLowerCase().includes(".pdf")) {
      // If it's already an image upload, keep it. 
      // If it's raw, it will likely 401, so we'll handle that in the viewer.
      url = url.replace(/\.pdf\.pdf$/i, ".pdf");
    }
  }

  // Cleanup: Ensure no double slashes after the domain (except after http://)
  url = url.replace(/([^:]\/)\/+/g, "$1");

  return url;
};

// NEW: Helper to wrap URLs in Google PDF Viewer for maximum compatibility
export const getPdfViewerUrl = (url) => {
  if (!url) return null;
  // If it's already a viewer URL, don't double wrap
  if (url.includes("docs.google.com/viewer")) return url;
  return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
};