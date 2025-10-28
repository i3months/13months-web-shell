import type { CommandResult, ExecutionContext, ParsedCommand } from "./types";
import { parseCommand } from "./parseCommand";
import {
  handleLs,
  handlePwd,
  handleClear,
  handleEcho,
  handleHelp,
  handleHistory,
  handleExit,
} from "./builtInHandlers";
import { handleCd } from "./cdHandler";
import { executeCustom } from "./customHandlers";
import { createCommandRegistry } from "../../../entities/command/model/CommandRegistry";

/**
 * Main command executor that processes user input and routes to appropriate handlers.
 * Parses the input, determines if it's a built-in or custom command, and executes it.
 *
 * @param input - The raw command string entered by the user
 * @param context - Execution context containing file system, custom commands, and environment
 * @returns CommandResult with success status, output text, and optional error message
 *
 * @example
 * ```typescript
 * const result = executeCommand("ls -la", context);
 * if (result.success) {
 *   console.log(result.output);
 * } else {
 *   console.error(result.error);
 * }
 * ```
 */
export const executeCommand = (
  input: string,
  context: ExecutionContext
): CommandResult => {
  // Parse the command
  const parsed = parseCommand(input);

  // Handle empty command
  if (!parsed.name) {
    return {
      success: true,
      output: "",
    };
  }

  // Create command registry
  const registry = createCommandRegistry(context.customCommands);

  // Check if it's a built-in command
  if (registry.isBuiltIn(parsed.name)) {
    return executeBuiltIn(parsed.name, parsed, context);
  }

  // Check if it's a custom command
  if (registry.isCustom(parsed.name)) {
    const customCommand = registry.getCommand(parsed.name);
    if (customCommand) {
      return executeCustom(customCommand);
    }
  }

  // Command not found
  return {
    success: false,
    output: "",
    error: `command not found: ${parsed.name}`,
  };
};

/**
 * Routes built-in commands to their specific handler functions.
 * Internal helper function for command execution.
 *
 * @param name - The built-in command name (ls, cd, pwd, etc.)
 * @param parsed - Parsed command with args and flags
 * @param context - Execution context
 * @returns CommandResult from the specific command handler
 */
const executeBuiltIn = (
  name: string,
  parsed: ParsedCommand,
  context: ExecutionContext
): CommandResult => {
  switch (name) {
    case "ls":
      return handleLs(parsed.args, context, parsed.flags);
    case "cd":
      return handleCd(parsed.args, context);
    case "pwd":
      return handlePwd(parsed.args, context);
    case "echo":
      return handleEcho(parsed.args, context);
    case "clear":
      return handleClear(parsed.args, context);
    case "history":
      return handleHistory(parsed.args, context);
    case "exit":
      return handleExit(parsed.args, context);
    case "help":
      return handleHelp(parsed.args, context);
    default:
      return {
        success: false,
        output: "",
        error: `command not found: ${name}`,
      };
  }
};
