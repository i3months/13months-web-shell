import { useState, useEffect, useCallback } from "react";

interface Size {
  width: number;
  height: number;
}

interface Position {
  x: number;
  y: number;
}

interface UseWindowResizeProps {
  initialSize: Size;
  minWidth?: number;
  minHeight?: number;
  isMaximized: boolean;
  position: Position;
  setPosition: (position: Position) => void;
}

export const useWindowResize = ({
  initialSize,
  minWidth = 400,
  minHeight = 300,
  isMaximized,
  position,
  setPosition,
}: UseWindowResizeProps) => {
  const [size, setSize] = useState<Size>(initialSize);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string>("");

  const handleResizeStart = useCallback(
    (e: React.MouseEvent, direction: string) => {
      if (isMaximized) return;
      e.stopPropagation();
      setIsResizing(true);
      setResizeDirection(direction);
    },
    [isMaximized]
  );

  useEffect(() => {
    if (!isResizing) return;

    const handleResizeMove = (e: MouseEvent) => {
      const deltaX = e.movementX;
      const deltaY = e.movementY;

      setSize((prevSize) => {
        let newWidth = prevSize.width;
        let newHeight = prevSize.height;
        let newX = position.x;
        let newY = position.y;

        // Handle horizontal resizing
        if (resizeDirection.includes("e")) {
          newWidth = Math.max(minWidth, prevSize.width + deltaX);
        }
        if (resizeDirection.includes("w")) {
          const potentialWidth = prevSize.width - deltaX;
          if (potentialWidth >= minWidth) {
            newWidth = potentialWidth;
            newX = position.x + deltaX;
          }
        }

        // Handle vertical resizing
        if (resizeDirection.includes("s")) {
          newHeight = Math.max(minHeight, prevSize.height + deltaY);
        }
        if (resizeDirection.includes("n")) {
          const potentialHeight = prevSize.height - deltaY;
          if (potentialHeight >= minHeight) {
            newHeight = potentialHeight;
            newY = position.y + deltaY;
          }
        }

        // Update position if it changed
        if (newX !== position.x || newY !== position.y) {
          setPosition({ x: newX, y: newY });
        }

        return { width: newWidth, height: newHeight };
      });
    };

    const handleResizeEnd = () => {
      setIsResizing(false);
      setResizeDirection("");
    };

    document.addEventListener("mousemove", handleResizeMove);
    document.addEventListener("mouseup", handleResizeEnd);

    return () => {
      document.removeEventListener("mousemove", handleResizeMove);
      document.removeEventListener("mouseup", handleResizeEnd);
    };
  }, [isResizing, resizeDirection, minWidth, minHeight, position, setPosition]);

  return {
    size,
    setSize,
    isResizing,
    handleResizeStart,
  };
};
