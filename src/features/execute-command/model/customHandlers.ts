import type { CommandResult } from "./types";
import type { CustomCommand } from "../../../entities/command/model/types";
import { openLink } from "../../../shared/lib/open-link";

/**
 * Executes a custom command (link or text type)
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
 * Executes a link-type custom command
 * Opens the URL in a new tab
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
 * Executes a text-type custom command
 * Displays the text content
 */
const executeCustomText = (command: CustomCommand): CommandResult => {
  return {
    success: true,
    output: command.value,
  };
};
