import { useState, useCallback } from "react";

/**
 * Interface for managing command history navigation.
 * Provides methods to add commands and navigate through history.
 */
export interface CommandHistoryManager {
  /** Adds a command to the history */
  add: (command: string) => void;
  /** Gets the previous command in history (up arrow) */
  getPrevious: () => string | null;
  /** Gets the next command in history (down arrow) */
  getNext: () => string | null;
  /** Returns all commands in history */
  getAll: () => string[];
  /** Clears all command history */
  clear: () => void;
  /** Gets the current position in history (-1 means newest) */
  getCurrentIndex: () => number;
}

/**
 * React hook for managing command history with navigation support.
 * Maintains a list of executed commands and allows navigation with up/down arrows.
 *
 * @returns CommandHistoryManager with methods to manage and navigate history
 *
 * @example
 * ```typescript
 * const history = useCommandHistory();
 *
 * // Add commands
 * history.add("ls");
 * history.add("cd projects");
 *
 * // Navigate history
 * const prev = history.getPrevious(); // "cd projects"
 * const prev2 = history.getPrevious(); // "ls"
 * const next = history.getNext(); // "cd projects"
 * ```
 */
export const useCommandHistory = (): CommandHistoryManager => {
  const [history, setHistory] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  const add = useCallback((command: string) => {
    if (!command.trim()) return;

    setHistory((prev) => [...prev, command]);
    setCurrentIndex(-1); // Reset to newest position
  }, []);

  const getPrevious = useCallback((): string | null => {
    if (history.length === 0) return null;

    // If at newest position (-1), start from the end
    if (currentIndex === -1) {
      const newIndex = history.length - 1;
      setCurrentIndex(newIndex);
      return history[newIndex] ?? null;
    }

    // If already at oldest, stay there
    if (currentIndex === 0) {
      return history[0] ?? null;
    }

    // Move to previous command
    const newIndex = currentIndex - 1;
    setCurrentIndex(newIndex);
    return history[newIndex] ?? null;
  }, [history, currentIndex]);

  const getNext = useCallback((): string | null => {
    if (history.length === 0) return null;

    // If at newest position, return null (clear input)
    if (currentIndex === -1) {
      return null;
    }

    // If at last item, move to newest position
    if (currentIndex === history.length - 1) {
      setCurrentIndex(-1);
      return null;
    }

    // Move to next command
    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);
    return history[newIndex] ?? null;
  }, [history, currentIndex]);

  const getAll = useCallback((): string[] => {
    return [...history];
  }, [history]);

  const clear = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
  }, []);

  const getCurrentIndex = useCallback((): number => {
    return currentIndex;
  }, [currentIndex]);

  return {
    add,
    getPrevious,
    getNext,
    getAll,
    clear,
    getCurrentIndex,
  };
};
