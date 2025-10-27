import type { CommandResult, ExecutionContext } from "./types";
import { parseCommand } from "./parseCommand";
import {
  handleLs,
  handlePwd,
  handleClear,
  handleEcho,
  handleHelp,
} from "./builtInHandlers";
import { handleCd } from "./cdHandler";
import { executeCustom } from "./customHandlers";
import { createCommandRegistry } from "../../../entities/command/model/CommandRegistry";

/**
 * Main command executor
 * Routes commands to built-in or custom handlers
 * Returns CommandResult with success, output, and error
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
    return executeBuiltIn(parsed.name, parsed.args, context);
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
 * Routes built-in commands to their handlers
 */
const executeBuiltIn = (
  name: string,
  args: string[],
  context: ExecutionContext
): CommandResult => {
  switch (name) {
    case "ls":
      return handleLs(args, context);
    case "cd":
      return handleCd(args, context);
    case "pwd":
      return handlePwd(args, context);
    case "echo":
      return handleEcho(args, context);
    case "clear":
      return handleClear(args, context);
    case "help":
      return handleHelp(args, context);
    default:
      return {
        success: false,
        output: "",
        error: `command not found: ${name}`,
      };
  }
};
