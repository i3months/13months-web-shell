export interface CustomCommand {
  name: string;
  type: "link" | "text";
  value: string;
  description?: string;
}

export interface CommandRegistry {
  getAllCommands: () => string[];
  getCommand: (name: string) => CustomCommand | null;
  isBuiltIn: (name: string) => boolean;
  isCustom: (name: string) => boolean;
}

export type BuiltInCommand = "ls" | "cd" | "pwd" | "echo" | "clear" | "help";

export const BUILT_IN_COMMANDS: BuiltInCommand[] = [
  "ls",
  "cd",
  "pwd",
  "echo",
  "clear",
  "help",
];
