import { useState, useCallback } from "react";

export interface CommandHistoryManager {
  add: (command: string) => void;
  getPrevious: () => string | null;
  getNext: () => string | null;
  getAll: () => string[];
  clear: () => void;
  getCurrentIndex: () => number;
}

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
