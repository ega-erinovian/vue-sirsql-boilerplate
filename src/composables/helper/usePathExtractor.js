/**
 * Hook to extract the path from a URL.
 * @returns {Object} - Contains the `extractPath` function.
 */
export function usePathExtractor() {
  /**
   * Extracts the pathname from a given URL.
   * @param {string} url - The URL to extract the pathname from.
   * @returns {string} The pathname without leading slash, or an empty string if the URL is invalid.
   */
  const extractPath = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.replace(/^\//, "");
    } catch (e) {
      return e.message;
    }
  };

  return { extractPath };
}
