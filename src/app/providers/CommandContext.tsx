import React, { createContext, useContext, useState, useCallback } from "react";

/**
 * Represents a single command execution in the history.
 * Stores the command, its output, and metadata.
 */
export interface CommandHistoryItem {
  /** Unique identifier for the history item */
  id: string;
  /** The command that was executed */
  command: string;
  /** The output produced by the command */
  output: string;
  /** Unix timestamp when the command was executed */
  timestamp: number;
}

/**
 * Context value interface for command history management.
 * Provides access to command history and methods to modify it.
 */
interface CommandContextValue {
  /** Array of all command history items */
  history: CommandHistoryItem[];
  /** Adds a new command and its output to history */
  addToHistory: (command: string, output: string) => void;
  /** Clears all command history */
  clearHistory: () => void;
}

const CommandContext = createContext<CommandContextValue | undefined>(
  undefined
);

/**
 * Hook to access the command context.
 * Must be used within a CommandProvider.
 *
 * @returns CommandContextValue with history and management methods
 * @throws Error if used outside of CommandProvider
 *
 * @example
 * ```tsx
 * const { history, addToHistory, clearHistory } = useCommand();
 * addToHistory("ls", "file1.txt  file2.txt");
 * ```
 */
export const useCommand = (): CommandContextValue => {
  const context = useContext(CommandContext);
  if (!context) {
    throw new Error("useCommand must be used within CommandProvider");
  }
  return context;
};

/**
 * Props for CommandProvider component.
 */
interface CommandProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that manages command history state.
 * Wraps the application to provide command history access to all child components.
 *
 * @example
 * ```tsx
 * <CommandProvider>
 *   <App />
 * </CommandProvider>
 * ```
 */
export const CommandProvider: React.FC<CommandProviderProps> = ({
  children,
}) => {
  const [history, setHistory] = useState<CommandHistoryItem[]>([]);

  const addToHistory = useCallback((command: string, output: string) => {
    const item: CommandHistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      command,
      output,
      timestamp: Date.now(),
    };

    setHistory((prev) => [...prev, item]);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const value: CommandContextValue = {
    history,
    addToHistory,
    clearHistory,
  };

  return (
    <CommandContext.Provider value={value}>{children}</CommandContext.Provider>
  );
};
