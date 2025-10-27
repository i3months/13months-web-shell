import React from "react";

interface PromptProps {
  username: string;
  hostname: string;
  currentPath: string;
}

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
