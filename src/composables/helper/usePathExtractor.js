export function usePathExtractor() {
  const extractPath = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.replace(/^\//, "");
    } catch (e) {
      return "";
    }
  };

  return { extractPath };
}
