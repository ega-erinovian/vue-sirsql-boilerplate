/**
 * Hook to convert day, month, and year to PHP date yyyy-mm-dd.
 * @returns {Object} - Contains the `extractPath` function.
 */
export function usePhpDate() {
  const phpDate = (date) => {
    try {
      return `${date.year}-${date.month}-${date.day}`;
    } catch (e) {
      return e.message;
    }
  };

  return { phpDate };
}
