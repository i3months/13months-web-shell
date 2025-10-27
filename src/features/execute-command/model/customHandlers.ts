import type { CommandResult } from "./types";
import type { CustomCommand } from "../../../entities/command/model/types";
import { openLink } from "../../../shared/lib/open-link";

/**
 * Executes a custom command based on its type (link or text).
 * Routes to the appropriate handler based on command type.
 *
 * @param command - The custom command to execute
 * @returns CommandResult with execution status and output
 *
 * @example
 * ```typescript
 * const linkedinCmd = { name: "linkedin", type: "link", value: "https://linkedin.com/in/user" };
 * const result = executeCustom(linkedinCmd);
 * // result.output: "Opening https://linkedin.com/in/user..."
 * ```
 */
export const executeCustom = (command: CustomCommand): CommandResult => {
  if (command.type === "link") {
    return executeCustomLink(command);
  } else if (command.type === "text") {
    return executeCustomText(command);
  }

  return {
    success: false,
    output: "",
    error: `Unknown custom command type: ${command.type}`,
  };
};

/**
 * Executes a link-type custom command by opening the URL in a new browser tab.
 *
 * @param command - The link-type custom command
 * @returns CommandResult indicating success or failure of opening the link
 */
const executeCustomLink = (command: CustomCommand): CommandResult => {
  const success = openLink(command.value);

  if (!success) {
    return {
      success: false,
      output: "",
      error: `Failed to open link: ${command.value}`,
    };
  }

  return {
    success: true,
    output: `Opening ${command.value}...`,
  };
};

/**
 * Executes a text-type custom command by displaying its text content.
 * Supports multi-line text with \n line breaks.
 *
 * @param command - The text-type custom command
 * @returns CommandResult with the command's text value as output
 */
const executeCustomText = (command: CustomCommand): CommandResult => {
  return {
    success: true,
    output: command.value,
  };
};
