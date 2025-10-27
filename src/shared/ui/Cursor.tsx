import React from "react";

interface CursorProps {
  visible?: boolean;
}

export const Cursor: React.FC<CursorProps> = ({ visible = true }) => {
  return (
    <span
      className={`inline-block text-terminal-text flex-shrink-0 text-xs sm:text-sm md:text-base ${
        visible ? "animate-blink" : ""
      }`}
    >
      █
    </span>
  );
};
