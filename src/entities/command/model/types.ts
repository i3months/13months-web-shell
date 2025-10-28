/**
 * Represents a custom command that can be added to the shell.
 * Custom commands can either open links or display text.
 */
export interface CustomCommand {
  /** The command name (e.g., "linkedin", "blog") */
  name: string;
  /** The type of command - "link" opens URLs, "text" displays content */
  type: "link" | "text";
  /** The URL (for link type) or text content (for text type) */
  value: string;
  /** Optional description shown in help command */
  description?: string;
}

/**
 * Registry interface for managing and querying available commands.
 * Provides methods to check command types and retrieve command information.
 */
export interface CommandRegistry {
  /** Returns all available command names (built-in and custom) */
  getAllCommands: () => string[];
  /** Retrieves a custom command by name, or null if not found */
  getCommand: (name: string) => CustomCommand | null;
  /** Checks if a command name is a built-in command */
  isBuiltIn: (name: string) => boolean;
  /** Checks if a command name is a custom command */
  isCustom: (name: string) => boolean;
}

/**
 * Union type of all built-in command names.
 * These commands are implemented in the shell core.
 */
export type BuiltInCommand =
  | "ls"
  | "cd"
  | "pwd"
  | "echo"
  | "clear"
  | "history"
  | "help";

/**
 * Array of all built-in command names.
 * Used for command validation and help display.
 */
export const BUILT_IN_COMMANDS: BuiltInCommand[] = [
  "ls",
  "cd",
  "pwd",
  "echo",
  "clear",
  "history",
  "help",
];
