import React from "react";

interface CursorProps {
  visible?: boolean;
}

export const Cursor: React.FC<CursorProps> = ({ visible = true }) => {
  return (
    <span
      className={`inline-block text-terminal-text ${
        visible ? "animate-blink" : ""
      }`}
    >
      █
    </span>
  );
};
