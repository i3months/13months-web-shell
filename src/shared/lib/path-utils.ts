/**
 * Normalizes a path string into an array of segments
 * Handles . (current directory) and .. (parent directory) navigation
 * @param path - The path string to normalize
 * @param currentPath - The current path segments (for relative paths)
 * @returns Array of normalized path segments
 */
export const normalizePath = (
  path: string,
  currentPath: string[] = []
): string[] => {
  // Handle absolute paths
  const isAbsolute = path.startsWith("/");
  const startPath = isAbsolute ? [] : [...currentPath];

  // Split path and filter out empty segments
  const segments = path.split("/").filter((segment) => segment.length > 0);

  // Process each segment
  const result = segments.reduce((acc, segment) => {
    if (segment === ".") {
      // Current directory - do nothing
      return acc;
    } else if (segment === "..") {
      // Parent directory - remove last segment if exists
      if (acc.length > 0) {
        acc.pop();
      }
      return acc;
    } else {
      // Regular segment - add to path
      acc.push(segment);
      return acc;
    }
  }, startPath);

  return result;
};

/**
 * Joins path segments into a path string
 * @param segments - Array of path segments
 * @returns Joined path string with leading slash
 */
export const joinPath = (segments: string[]): string => {
  if (segments.length === 0) {
    return "/";
  }
  return "/" + segments.join("/");
};

/**
 * Checks if a path is absolute (starts with /)
 * @param path - The path string to check
 * @returns true if path is absolute, false otherwise
 */
export const isAbsolutePath = (path: string): boolean => {
  return path.startsWith("/");
};
