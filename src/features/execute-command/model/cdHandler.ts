import type { CommandResult, ExecutionContext } from "./types";

/**
 * Handles the 'cd' command - changes the current working directory.
 * Supports absolute paths, relative paths, and special paths (~, /, ., ..).
 * If no path is provided, navigates to the home directory.
 *
 * @param args - Command arguments. First argument is the target directory path.
 * @param context - Execution context with file system access
 * @returns CommandResult indicating success or failure with error message
 *
 * @example
 * ```typescript
 * handleCd(["projects"], context);  // Change to projects directory
 * handleCd([".."], context);        // Go to parent directory
 * handleCd([], context);            // Go to home directory
 * handleCd(["/home/user"], context); // Absolute path
 * ```
 */
export const handleCd = (
  args: string[],
  context: ExecutionContext
): CommandResult => {
  const { fileSystem } = context;

  // If no argument, go to home directory
  const path = args[0] || "~";

  // Attempt to change directory
  const success = fileSystem.changeDirectory(path);

  if (!success) {
    return {
      success: false,
      output: "",
      error: `cd: no such file or directory: ${path}`,
    };
  }

  return {
    success: true,
    output: "",
  };
};
