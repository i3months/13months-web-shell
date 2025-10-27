import type { CommandResult, ExecutionContext } from "./types";

/**
 * Handles the 'cd' command - changes directory
 * Integrates with VirtualFileSystem for navigation
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
