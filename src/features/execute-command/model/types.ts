import type { VirtualFileSystem } from "../../../entities/file-system/model/VirtualFileSystem";
import type { CustomCommand } from "../../../entities/command/model/types";

export interface ParsedCommand {
  name: string;
  args: string[];
  flags: Record<string, boolean | string>;
}

export interface CommandResult {
  success: boolean;
  output: string;
  error?: string;
}

export interface ExecutionContext {
  fileSystem: VirtualFileSystem;
  currentPath: string;
  customCommands: CustomCommand[];
}
