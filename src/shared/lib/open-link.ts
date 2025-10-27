/**
 * Opens a URL in a new browser tab
 * @param url - The URL to open
 * @returns true if successful, false otherwise
 */
export const openLink = (url: string): boolean => {
  try {
    window.open(url, "_blank", "noopener,noreferrer");
    return true;
  } catch (error) {
    console.error("Failed to open link:", error);
    return false;
  }
};
