import type { CommandResult, ExecutionContext } from "./types";
import { isDirectory } from "../../../entities/file-system/model/types";

/**
 * Handles the 'ls' command - lists directory contents.
 * Displays files and directories in the specified path.
 * Directories are shown with a trailing slash (/).
 *
 * @param args - Command arguments. First argument is the path (defaults to current directory)
 * @param context - Execution context with file system access
 * @returns CommandResult with directory listing or error message
 *
 * @example
 * ```typescript
 * handleLs([], context);           // List current directory
 * handleLs(["projects"], context); // List projects directory
 * ```
 */
export const handleLs = (
  args: string[],
  context: ExecutionContext
): CommandResult => {
  const { fileSystem } = context;
  const path = args[0] || ".";

  const nodes = fileSystem.listDirectory(path);

  if (nodes.length === 0) {
    // Check if path exists
    const node = fileSystem.getNode(path);
    if (!node) {
      return {
        success: false,
        output: "",
        error: `ls: cannot access '${path}': No such file or directory`,
      };
    }
    if (!isDirectory(node)) {
      return {
        success: false,
        output: "",
        error: `ls: cannot access '${path}': Not a directory`,
      };
    }
    // Empty directory
    return {
      success: true,
      output: "",
    };
  }

  // Format output: directories with /, files without
  const output = nodes
    .map((node) => {
      if (isDirectory(node)) {
        return `${node.name}/`;
      }
      return node.name;
    })
    .join("  ");

  return {
    success: true,
    output,
  };
};

/**
 * Handles the 'pwd' command - prints the current working directory path.
 *
 * @param _args - Command arguments (unused)
 * @param context - Execution context with current path
 * @returns CommandResult with the current directory path
 */
export const handlePwd = (
  _args: string[],
  context: ExecutionContext
): CommandResult => {
  return {
    success: true,
    output: context.currentPath,
  };
};

/**
 * Handles the 'clear' command - clears the terminal output.
 * Returns a special marker "__CLEAR__" that the shell component recognizes
 * to clear all previous output from the display.
 *
 * @param _args - Command arguments (unused)
 * @param _context - Execution context (unused)
 * @returns CommandResult with special clear marker
 */
export const handleClear = (
  _args: string[],
  _context: ExecutionContext
): CommandResult => {
  return {
    success: true,
    output: "__CLEAR__",
  };
};

/**
 * Handles the 'echo' command - displays text to the terminal.
 * Joins all arguments with spaces and outputs them.
 *
 * @param args - Command arguments to display
 * @param _context - Execution context (unused)
 * @returns CommandResult with the text to display
 *
 * @example
 * ```typescript
 * handleEcho(["Hello", "World"], context);
 * // Output: "Hello World"
 * ```
 */
export const handleEcho = (
  args: string[],
  _context: ExecutionContext
): CommandResult => {
  const output = args.join(" ");
  return {
    success: true,
    output,
  };
};

/**
 * Handles the 'help' command - displays all available commands with descriptions.
 * Shows both built-in commands and custom commands with their usage information.
 *
 * @param _args - Command arguments (unused)
 * @param context - Execution context with custom commands list
 * @returns CommandResult with formatted help text
 */
export const handleHelp = (
  _args: string[],
  context: ExecutionContext
): CommandResult => {
  const { customCommands } = context;

  const builtInHelp = `Available Commands:

Built-in Commands:
  ls [path]       List directory contents
  cd <path>       Change directory
  pwd             Print working directory
  echo <text>     Display text
  clear           Clear the terminal
  help            Show this help message
`;

  const customHelp =
    customCommands.length > 0
      ? `\nCustom Commands:\n${customCommands
          .map((cmd) => {
            const desc = cmd.description || "";
            return `  ${cmd.name.padEnd(15)} ${desc}`;
          })
          .join("\n")}`
      : "";

  return {
    success: true,
    output: builtInHelp + customHelp,
  };
};
