export const getMediaUrl = (path) => {
  if (!path) return null;

  // Already full URL
  if (path.startsWith("http")) return path;

  return `http://127.0.0.1:8000${path}`;
};