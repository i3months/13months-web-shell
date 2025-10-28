import React, { useState, useEffect, useCallback, useRef } from "react";
import { CommandLine } from "./CommandLine";
import { OutputArea, OutputItem } from "./OutputArea";
import { useFileSystem } from "@/app/providers/FileSystemContext";
import { executeCommand } from "@/features/execute-command";
import { customCommands } from "@/entities/command/model/custom-commands";
import { createCommandRegistry } from "@/entities/command/model/CommandRegistry";
import { useWindowDrag } from "@/features/window-drag";
import { useWindowResize } from "@/features/window-resize";
import { useWindowControls } from "@/features/window-controls";

interface ShellProps {
  className?: string;
}

const WELCOME_MESSAGE_LARGE = `
     _____                                        _____                                  
    /\\___ \\                                      /\\___ \\                                 
    \\/__/\\ \\     __     ___     ___       __     \\/__/\\ \\    ___     ___     ___      ___ ___      ___    
      _\\ \\ \\  /'__\`\\  / __\`\\ /' _ \`\\   /'_ \`\\      _\\ \\ \\  / __\`\\  / __\`\\ /' _ \`\\  /' __\` __\`\\   / __\`\\  
     /\\ \\_\\ \\/\\  __/ /\\ \\L\\ \\/\\ \\/\\ \\ /\\ \\L\\ \\    /\\ \\_\\ \\/\\ \\L\\ \\/\\ \\L\\ \\/\\ \\/\\ \\ /\\ \\/\\ \\/\\ \\ /\\ \\L\\ \\ 
     \\ \\____/\\ \\____\\\\ \\____/\\ \\_\\ \\_\\\\ \\____ \\   \\ \\____/\\ \\____/\\ \\____/\\ \\_\\ \\_\\\\ \\_\\ \\_\\ \\_\\\\ \\____/ 
      \\/___/  \\/____/ \\/___/  \\/_/\\/_/ \\/___L\\ \\   \\/___/  \\/___/  \\/___/  \\/_/\\/_/ \\/_/\\/_/\\/_/ \\/___/  
                                        /\\____/                                                          
                                        \\_/__/                                                           

Type 'help' to see all available commands.
`;

const WELCOME_MESSAGE_MEDIUM = `
                                                                                                   
 ____  ____  ____  ____  ____  ____  ____  ____  ____  ____  ____ 
||J ||||e ||||o ||||n ||||g ||||J ||||o ||||o ||||n ||||m ||||o ||
||__||||__||||__||||__||||__||||__||||__||||__||||__||||__||||__||
|/__\\||/__\\||/__\\||/__\\||/__\\||/__\\||/__\\||/__\\||/__\\||/__\\||/__\\|
                                                
                                      
Type 'help' to see all available commands.
`;

const WELCOME_MESSAGE_SMALL = `
 ____  ____  ____  ____  ____ 
||J ||||e ||||o ||||n ||||g ||
||__||||__||||__||||__||||__||
|/__\\||/__\\||/__\\||/__\\||/__\\|
 ____  ____  ____  ____  ____  ____ 
||J ||||o ||||o ||||n ||||m ||||o ||
||__||||__||||__||||__||||__||||__||
|/__\\||/__\\||/__\\||/__\\||/__\\||/__\\|


Type 'help' to see all available commands.
`;

export const Shell: React.FC<ShellProps> = ({ className = "" }) => {
  const { currentPath, fileSystem } = useFileSystem();
  const [outputs, setOutputs] = useState<OutputItem[]>([]);
  const [welcomeMessage, setWelcomeMessage] = useState<OutputItem | null>(null);
  const [availableCommands, setAvailableCommands] = useState<string[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const shellRef = useRef<HTMLDivElement>(null);

  // Initial window position (centered)
  const initialPosition = {
    x: Math.max(0, (window.innerWidth - 1200) / 2),
    y: Math.max(0, (window.innerHeight - 700) / 2),
  };
  const initialSize = { width: 1200, height: 700 };

  // Window management features
  const { size, setSize, handleResizeStart } = useWindowResize({
    initialSize,
    minWidth: 400,
    minHeight: 300,
    isMaximized: false, // Will be updated by useWindowControls
  });

  const { position, setPosition, isDragging, handleDragStart } = useWindowDrag({
    initialPosition,
    size,
    isMaximized: false, // Will be updated by useWindowControls
  });

  const { isMaximized, handleMinimize, handleMaximize, handleClose } =
    useWindowControls({
      position,
      size,
      setPosition,
      setSize,
    });

  // Display welcome message on mount and when size changes
  useEffect(() => {
    // Choose welcome message based on window size and viewport
    const getWelcomeMessageText = () => {
      const width = size.width;
      const viewportWidth = window.innerWidth;

      // Mobile devices (viewport < 768px) always use small message
      if (viewportWidth < 768) return WELCOME_MESSAGE_SMALL;

      // Desktop: based on window size
      if (width >= 1200) return WELCOME_MESSAGE_LARGE;
      if (width >= 1100) return WELCOME_MESSAGE_MEDIUM;
      return WELCOME_MESSAGE_SMALL;
    };
    const messageText = getWelcomeMessageText();

    const welcomeItem: OutputItem = {
      id: "welcome-permanent",
      type: "system",
      content: messageText,
      timestamp: Date.now(),
    };
    setWelcomeMessage(welcomeItem);

    // Initialize available commands only once
    if (availableCommands.length === 0) {
      const registry = createCommandRegistry(customCommands);
      setAvailableCommands(registry.getAllCommands());
    }
  }, [size.width, availableCommands.length]);

  const handleExecute = useCallback(
    (input: string) => {
      const trimmedInput = input.trim();

      // Add command to history if not empty
      if (trimmedInput) {
        setCommandHistory((prev) => [...prev, trimmedInput]);
      }

      // Add command to output with colored prompt
      const commandItem: OutputItem = {
        id: `cmd-${Date.now()}-${Math.random()}`,
        type: "command",
        content: `visitor@13months:${currentPath}$ ${trimmedInput}`,
        timestamp: Date.now(),
        prompt: {
          username: "visitor",
          hostname: "13months",
          path: currentPath,
        },
        command: trimmedInput,
      };

      setOutputs((prev) => [...prev, commandItem]);

      // Handle empty command
      if (!trimmedInput) {
        return;
      }

      // Handle clear command specially - clear outputs but keep welcome message
      if (trimmedInput === "clear") {
        setOutputs([]);
        return;
      }

      // Execute command
      const result = executeCommand(trimmedInput, {
        fileSystem,
        currentPath,
        customCommands,
        commandHistory,
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
    [currentPath, fileSystem, commandHistory]
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
        onMouseDown={handleDragStart}
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
        <OutputArea
          outputs={welcomeMessage ? [welcomeMessage, ...outputs] : outputs}
        >
          <CommandLine
            onExecute={handleExecute}
            username="visitor"
            hostname="13months"
            currentPath={currentPath}
            availableCommands={availableCommands}
          />
        </OutputArea>
      </div>

      {/* Resize handles */}
      {!isMaximized && (
        <>
          <div
            className="resize-handle resize-n"
            onMouseDown={(e) => handleResizeStart(e, "n")}
          />
          <div
            className="resize-handle resize-s"
            onMouseDown={(e) => handleResizeStart(e, "s")}
          />
          <div
            className="resize-handle resize-e"
            onMouseDown={(e) => handleResizeStart(e, "e")}
          />
          <div
            className="resize-handle resize-w"
            onMouseDown={(e) => handleResizeStart(e, "w")}
          />
          <div
            className="resize-handle resize-ne"
            onMouseDown={(e) => handleResizeStart(e, "ne")}
          />
          <div
            className="resize-handle resize-nw"
            onMouseDown={(e) => handleResizeStart(e, "nw")}
          />
          <div
            className="resize-handle resize-se"
            onMouseDown={(e) => handleResizeStart(e, "se")}
          />
          <div
            className="resize-handle resize-sw"
            onMouseDown={(e) => handleResizeStart(e, "sw")}
          />
        </>
      )}
    </div>
  );
};
