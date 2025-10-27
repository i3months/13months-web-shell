import type { CommandResult, ExecutionContext } from "./types";
import { isDirectory } from "../../../entities/file-system/model/types";

/**
 * Handles the 'ls' command - lists directory contents
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
 * Handles the 'pwd' command - prints working directory
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
 * Handles the 'clear' command - clears the output
 * Note: This returns a special marker that the shell component will recognize
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
 * Handles the 'echo' command - displays text
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
 * Handles the 'help' command - shows available commands
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
