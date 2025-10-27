import React, { useState, useEffect, useCallback, useRef } from "react";
import { CommandLine } from "./CommandLine";
import { OutputArea, OutputItem } from "./OutputArea";
import { useFileSystem } from "@/app/providers/FileSystemContext";
import { executeCommand } from "@/features/execute-command";
import { customCommands } from "@/entities/command/model/custom-commands";
import { createCommandRegistry } from "@/entities/command/model/CommandRegistry";

interface ShellProps {
  className?: string;
}

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

const WELCOME_MESSAGE = `Welcome to 13months Web Shell Portfolio!

Type 'help' to see available commands.
Use Tab for auto-completion, Up/Down arrows for command history.
`;

export const Shell: React.FC<ShellProps> = ({ className = "" }) => {
  const { currentPath, fileSystem } = useFileSystem();
  const [outputs, setOutputs] = useState<OutputItem[]>([]);
  const [availableCommands, setAvailableCommands] = useState<string[]>([]);

  // Window dragging state
  const [position, setPosition] = useState<Position>({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [isMaximized, setIsMaximized] = useState(false);
  const [prevPosition, setPrevPosition] = useState<Position>({ x: 50, y: 50 });
  const [size, setSize] = useState<Size>({ width: 800, height: 600 });
  const shellRef = useRef<HTMLDivElement>(null);

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

    // Center window on mount
    const centerWindow = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      setPosition({
        x: (windowWidth - 800) / 2,
        y: (windowHeight - 600) / 2,
      });
    };
    centerWindow();
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

  // Window dragging handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isMaximized) return;
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    },
    [position, isMaximized]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      // Calculate new position
      let newX = e.clientX - dragOffset.x;
      let newY = e.clientY - dragOffset.y;

      // Get window dimensions
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const shellWidth = size.width;
      const shellHeight = size.height;

      // Constrain position to viewport bounds
      // Keep at least 50px of the window visible
      const minVisible = 50;
      newX = Math.max(
        -shellWidth + minVisible,
        Math.min(newX, windowWidth - minVisible)
      );
      newY = Math.max(0, Math.min(newY, windowHeight - minVisible));

      setPosition({
        x: newX,
        y: newY,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset, size]);

  // Window control handlers
  const handleMinimize = useCallback(() => {
    // In a real app, this would minimize to taskbar
    alert(
      "Minimize functionality - in a real app, this would minimize the window"
    );
  }, []);

  const handleMaximize = useCallback(() => {
    if (isMaximized) {
      setPosition(prevPosition);
      setIsMaximized(false);
    } else {
      setPrevPosition(position);
      setPosition({ x: 0, y: 0 });
      setIsMaximized(true);
    }
  }, [isMaximized, position, prevPosition]);

  const handleClose = useCallback(() => {
    if (confirm("Close terminal?")) {
      // In a real app, this would close the window
      window.close();
    }
  }, []);

  const windowStyle: React.CSSProperties = isMaximized
    ? {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
      }
    : {
        position: "fixed",
        top: `${position.y}px`,
        left: `${position.x}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
      };

  return (
    <div
      ref={shellRef}
      className={`ubuntu-window ${className}`}
      style={windowStyle}
    >
      {/* Title bar */}
      <div
        className="title-bar"
        onMouseDown={handleMouseDown}
        style={{
          cursor: isDragging ? "grabbing" : "grab",
        }}
      >
        <div className="title-bar-controls">
          <button
            className="title-bar-button close"
            onClick={handleClose}
            title="Close"
          >
            <span>×</span>
          </button>
          <button
            className="title-bar-button minimize"
            onClick={handleMinimize}
            title="Minimize"
          >
            <span>−</span>
          </button>
          <button
            className="title-bar-button maximize"
            onClick={handleMaximize}
            title={isMaximized ? "Restore" : "Maximize"}
          >
            <span>{isMaximized ? "❐" : "□"}</span>
          </button>
        </div>
        <div className="title-bar-text">visitor@13months: {currentPath}</div>
      </div>

      {/* Terminal content */}
      <div
        className="shell-content"
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
    </div>
  );
};
