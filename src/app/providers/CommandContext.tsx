import React, { createContext, useContext, useState, useCallback } from "react";

export interface CommandHistoryItem {
  id: string;
  command: string;
  output: string;
  timestamp: number;
}

interface CommandContextValue {
  history: CommandHistoryItem[];
  addToHistory: (command: string, output: string) => void;
  clearHistory: () => void;
}

const CommandContext = createContext<CommandContextValue | undefined>(
  undefined
);

export const useCommand = (): CommandContextValue => {
  const context = useContext(CommandContext);
  if (!context) {
    throw new Error("useCommand must be used within CommandProvider");
  }
  return context;
};

interface CommandProviderProps {
  children: React.ReactNode;
}

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
