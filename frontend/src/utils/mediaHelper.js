import { BASE_URL } from "./config";

export const getMediaUrl = (path) => {
  if (!path) return null;

  let url = path;
  if (!path.startsWith("http")) {
    url = `${BASE_URL}${path}`;
  }

  // Robust HTTPS conversion to prevent "Mixed Content" blocks on Vercel
  url = url.replace(/^http:\/\//i, "https://");

  // Remove Cloudinary versioning (e.g., /v123456789/) which can cause 401/signature issues over HTTPS
  if (url.includes("res.cloudinary.com")) {
    url = url.replace(/\/v\d+\//, "/");
  }

  return url;
};