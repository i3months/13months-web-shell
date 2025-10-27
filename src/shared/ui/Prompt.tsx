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
      <span className="font-bold" style={{ color: "#8ae234" }}>
        {username}
      </span>
      <span className="text-white">@</span>
      <span className="font-bold" style={{ color: "#8ae234" }}>
        {hostname}
      </span>
      <span className="text-white">:</span>
      <span
        className="font-bold truncate max-w-[100px] sm:max-w-[150px] md:max-w-none"
        style={{ color: "#8ae234" }}
      >
        {currentPath}
      </span>
      <span className="text-white">$</span>
      <span className="text-white">&nbsp;</span>
    </span>
  );
};
