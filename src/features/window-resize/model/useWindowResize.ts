import { useState, useEffect, useCallback } from "react";

interface Size {
  width: number;
  height: number;
}

interface UseWindowResizeProps {
  initialSize: Size;
  minWidth?: number;
  minHeight?: number;
  isMaximized: boolean;
}

export const useWindowResize = ({
  initialSize,
  minWidth = 400,
  minHeight = 300,
  isMaximized,
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

        if (resizeDirection.includes("e")) {
          newWidth = Math.max(minWidth, prevSize.width + deltaX);
        }
        if (resizeDirection.includes("w")) {
          const widthChange = Math.min(deltaX, prevSize.width - minWidth);
          newWidth = prevSize.width - widthChange;
        }
        if (resizeDirection.includes("s")) {
          newHeight = Math.max(minHeight, prevSize.height + deltaY);
        }
        if (resizeDirection.includes("n")) {
          const heightChange = Math.min(deltaY, prevSize.height - minHeight);
          newHeight = prevSize.height - heightChange;
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
  }, [isResizing, resizeDirection, minWidth, minHeight]);

  return {
    size,
    setSize,
    isResizing,
    handleResizeStart,
  };
};
