import type { CommandResult, ExecutionContext } from "./types";
import { isDirectory } from "../../../entities/file-system/model/types";

/**
 * Handles the 'ls' command - lists directory contents.
 * Displays files and directories in the specified path.
 * Directories are shown with a trailing slash (/).
 * Supports -l flag for detailed listing.
 *
 * @param args - Command arguments (path)
 * @param context - Execution context with file system access
 * @param flags - Command flags object
 * @returns CommandResult with directory listing or error message
 *
 * @example
 * ```typescript
 * handleLs([], context, {});           // List current directory
 * handleLs([], context, { l: true });  // List with details
 * handleLs(["projects"], context, {}); // List projects directory
 * ```
 */
export const handleLs = (
  args: string[],
  context: ExecutionContext,
  flags: Record<string, boolean | string> = {}
): CommandResult => {
  const { fileSystem } = context;

  // Check for long format flag
  const hasLongFormat = flags.l === true || flags.a === true;
  const pathArg = args[0] || ".";

  const nodes = fileSystem.listDirectory(pathArg);

  if (nodes.length === 0) {
    // Check if path exists
    const node = fileSystem.getNode(pathArg);
    if (!node) {
      return {
        success: false,
        output: "",
        error: `ls: cannot access '${pathArg}': No such file or directory`,
      };
    }
    if (!isDirectory(node)) {
      return {
        success: false,
        output: "",
        error: `ls: cannot access '${pathArg}': Not a directory`,
      };
    }
    // Empty directory
    return {
      success: true,
      output: "",
    };
  }

  // Format output based on flags
  if (hasLongFormat) {
    // Long format: show permissions, size, date, name (one per line)
    const lines = nodes.map((node) => {
      const type = isDirectory(node) ? "d" : "-";
      const perms = isDirectory(node) ? "rwxr-xr-x" : "rw-r--r--";
      const size = isDirectory(node) ? "4096" : "1024";
      const date = "Oct 28 12:00";
      const name = isDirectory(node) ? `${node.name}/` : node.name;
      return `${type}${perms}  1 visitor visitor ${size.padStart(
        6
      )} ${date} ${name}`;
    });

    const output = lines.join("\n");
    console.log("ls -l output:", JSON.stringify(output));
    console.log("Contains newline:", output.includes("\n"));

    return {
      success: true,
      output,
    };
  }

  // Simple format: directories with /, files without (horizontal)
  const items = nodes.map((node) => {
    if (isDirectory(node)) {
      return `${node.name}/`;
    }
    return node.name;
  });

  return {
    success: true,
    output: items.join("  "),
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
