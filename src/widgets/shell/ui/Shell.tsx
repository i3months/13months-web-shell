import React, { useState, useEffect, useCallback } from "react";
import { CommandLine } from "./CommandLine";
import { OutputArea, OutputItem } from "./OutputArea";
import { useFileSystem } from "@/app/providers/FileSystemContext";
import { executeCommand } from "@/features/execute-command";
import { customCommands } from "@/entities/command/model/custom-commands";
import { createCommandRegistry } from "@/entities/command/model/CommandRegistry";

interface ShellProps {
  className?: string;
}

const WELCOME_MESSAGE = `Welcome to 13months Web Shell Portfolio!

Type 'help' to see available commands.
Use Tab for auto-completion, Up/Down arrows for command history.
`;

export const Shell: React.FC<ShellProps> = ({ className = "" }) => {
  const { currentPath, fileSystem } = useFileSystem();
  const [outputs, setOutputs] = useState<OutputItem[]>([]);
  const [availableCommands, setAvailableCommands] = useState<string[]>([]);

  // Display welcome message on mount
  useEffect(() => {
    const welcomeItem: OutputItem = {
      id: `welcome-${Date.now()}`,
      type: "system",
      content: WELCOME_MESSAGE,
      timestamp: Date.now(),
    };
    setOutputs([welcomeItem]);

    // Initialize available commands
    const registry = createCommandRegistry(customCommands);
    setAvailableCommands(registry.getAllCommands());
  }, []);

  const handleExecute = useCallback(
    (input: string) => {
      const trimmedInput = input.trim();

      // Add command to output (format as prompt + command)
      const promptText = `visitor@13months:${currentPath}$ ${trimmedInput}`;
      const commandItem: OutputItem = {
        id: `cmd-${Date.now()}-${Math.random()}`,
        type: "command",
        content: promptText,
        timestamp: Date.now(),
      };

      setOutputs((prev) => [...prev, commandItem]);

      // Handle empty command
      if (!trimmedInput) {
        return;
      }

      // Handle clear command specially
      if (trimmedInput === "clear") {
        setOutputs([]);
        return;
      }

      // Execute command
      const result = executeCommand(trimmedInput, {
        fileSystem,
        currentPath,
        customCommands,
      });

      // Add result to output
      if (result.error) {
        const errorItem: OutputItem = {
          id: `err-${Date.now()}-${Math.random()}`,
          type: "error",
          content: result.error,
          timestamp: Date.now(),
        };
        setOutputs((prev) => [...prev, errorItem]);
      } else if (result.output) {
        const outputItem: OutputItem = {
          id: `out-${Date.now()}-${Math.random()}`,
          type: "output",
          content: result.output,
          timestamp: Date.now(),
        };
        setOutputs((prev) => [...prev, outputItem]);
      }
    },
    [currentPath, fileSystem]
  );

  const handleShellClick = useCallback(() => {
    // Focus input when clicking anywhere in the shell
    const input = document.querySelector(
      ".command-line input"
    ) as HTMLInputElement;
    input?.focus();
  }, []);

  const handleShellTouch = useCallback(() => {
    // Focus input when touching anywhere in the shell
    const input = document.querySelector(
      ".command-line input"
    ) as HTMLInputElement;
    input?.focus();
  }, []);

  return (
    <div
      className={`shell flex flex-col h-screen bg-terminal-bg text-terminal-text p-2 sm:p-4 md:p-6 ${className}`}
      onClick={handleShellClick}
      onTouchStart={handleShellTouch}
    >
      <OutputArea outputs={outputs} />
      <CommandLine
        onExecute={handleExecute}
        username="visitor"
        hostname="13months"
        currentPath={currentPath}
        availableCommands={availableCommands}
      />
    </div>
  );
};
