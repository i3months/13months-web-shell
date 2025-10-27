import { CustomCommand, CommandRegistry, BUILT_IN_COMMANDS } from "./types";

export const createCommandRegistry = (
  customCommands: CustomCommand[]
): CommandRegistry => {
  // Validate custom commands on initialization
  const validatedCommands = customCommands.filter((cmd) => {
    if (!cmd.name || typeof cmd.name !== "string") {
      console.error("Invalid command: missing or invalid name", cmd);
      return false;
    }
    if (!cmd.type || (cmd.type !== "link" && cmd.type !== "text")) {
      console.error(`Invalid command "${cmd.name}": invalid type`, cmd);
      return false;
    }
    if (!cmd.value || typeof cmd.value !== "string") {
      console.error(
        `Invalid command "${cmd.name}": missing or invalid value`,
        cmd
      );
      return false;
    }
    return true;
  });

  const customCommandMap = new Map<string, CustomCommand>(
    validatedCommands.map((cmd) => [cmd.name, cmd])
  );

  return {
    getAllCommands: (): string[] => {
      return [
        ...BUILT_IN_COMMANDS,
        ...validatedCommands.map((cmd) => cmd.name),
      ];
    },

    getCommand: (name: string): CustomCommand | null => {
      return customCommandMap.get(name) || null;
    },

    isBuiltIn: (name: string): boolean => {
      return BUILT_IN_COMMANDS.includes(name as any);
    },

    isCustom: (name: string): boolean => {
      return customCommandMap.has(name);
    },
  };
};
