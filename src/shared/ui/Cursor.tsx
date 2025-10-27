import React from "react";

/**
 * Props for the Cursor component.
 */
interface CursorProps {
  /** Whether the cursor should be visible and blinking. Defaults to true. */
  visible?: boolean;
}

/**
 * Terminal cursor component that displays a blinking block cursor.
 * Used to indicate the current input position in the terminal.
 *
 * @example
 * ```tsx
 * <Cursor visible={true} />  // Blinking cursor
 * <Cursor visible={false} /> // Static cursor (no animation)
 * ```
 */
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
