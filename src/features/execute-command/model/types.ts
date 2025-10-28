import type { VirtualFileSystem } from "../../../entities/file-system/model/VirtualFileSystem";
import type { CustomCommand } from "../../../entities/command/model/types";

/**
 * Represents a parsed command with its components.
 * Result of parsing a raw command string.
 */
export interface ParsedCommand {
  /** The command name (e.g., "ls", "cd", "echo") */
  name: string;
  /** Array of positional arguments */
  args: string[];
  /** Object containing flags and their values (boolean for flags without values) */
  flags: Record<string, boolean | string>;
}

/**
 * Result of command execution.
 * Contains success status, output text, and optional error message.
 */
export interface CommandResult {
  /** Whether the command executed successfully */
  success: boolean;
  /** The output text to display to the user */
  output: string;
  /** Optional error message if command failed */
  error?: string;
}

/**
 * Context provided to command handlers during execution.
 * Contains all necessary state and dependencies for command execution.
 */
export interface ExecutionContext {
  /** The virtual file system instance for file operations */
  fileSystem: VirtualFileSystem;
  /** The current working directory path */
  currentPath: string;
  /** Array of available custom commands */
  customCommands: CustomCommand[];
  /** Command history array (optional) */
  commandHistory?: string[];
}
