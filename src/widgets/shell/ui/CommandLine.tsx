import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Prompt, Cursor } from "@/shared/ui";
import { useCommandHistory } from "@/features/command-history";
import { getAutoComplete } from "@/features/auto-complete";

interface CommandLineProps {
  onExecute: (command: string) => void;
  username: string;
  hostname: string;
  currentPath: string;
  availableCommands: string[];
}

export const CommandLine: React.FC<CommandLineProps> = ({
  onExecute,
  username,
  hostname,
  currentPath,
  availableCommands,
}) => {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const commandHistory = useCommandHistory();

  // Focus input on mount and when clicking anywhere
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Handle Enter key - execute command
    if (e.key === "Enter") {
      e.preventDefault();
      if (input.trim()) {
        commandHistory.add(input);
        onExecute(input);
      } else {
        onExecute("");
      }
      setInput("");
      return;
    }

    // Handle Up arrow - previous command
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const previous = commandHistory.getPrevious();
      if (previous !== null) {
        setInput(previous);
      }
      return;
    }

    // Handle Down arrow - next command
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = commandHistory.getNext();
      if (next !== null) {
        setInput(next);
      } else {
        setInput("");
      }
      return;
    }

    // Handle Tab key - auto-complete
    if (e.key === "Tab") {
      e.preventDefault();
      const trimmedInput = input.trim();

      if (!trimmedInput) return;

      const result = getAutoComplete(trimmedInput, availableCommands);

      if (result.matches.length === 1) {
        // Single match - complete the command
        setInput(result.commonPrefix + " ");
      } else if (result.matches.length > 1) {
        // Multiple matches - complete to common prefix
        setInput(result.commonPrefix);
      }
      return;
    }
  };

  return (
    <div className="command-line flex items-center font-mono">
      <Prompt
        username={username}
        hostname={hostname}
        currentPath={currentPath}
      />
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 bg-transparent border-none outline-none text-terminal-text font-mono caret-transparent"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />
      <Cursor visible={true} />
    </div>
  );
};
