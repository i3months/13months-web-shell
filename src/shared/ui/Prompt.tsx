import React from "react";

/**
 * Props for the Prompt component.
 */
interface PromptProps {
  /** The username to display (e.g., "user") */
  username: string;
  /** The hostname to display (e.g., "localhost") */
  hostname: string;
  /** The current working directory path (e.g., "/home/user") */
  currentPath: string;
}

/**
 * Terminal prompt component that displays the command line prompt.
 * Shows username@hostname:path$ format similar to Unix/Linux shells.
 *
 * @example
 * ```tsx
 * <Prompt username="user" hostname="localhost" currentPath="/home/user" />
 * // Renders: user@localhost:/home/user$
 * ```
 */
export const Prompt: React.FC<PromptProps> = ({
  username,
  hostname,
  currentPath,
}) => {
  return (
    <span className="prompt inline-flex items-center gap-0 flex-shrink-0 text-xs sm:text-sm md:text-base">
      <span className="text-terminal-prompt">{username}</span>
      <span className="text-terminal-text">@</span>
      <span className="text-terminal-prompt">{hostname}</span>
      <span className="text-terminal-text">:</span>
      <span className="text-terminal-link truncate max-w-[100px] sm:max-w-[150px] md:max-w-none">
        {currentPath}
      </span>
      <span className="text-terminal-text">$</span>
      <span className="text-terminal-text">&nbsp;</span>
    </span>
  );
};
