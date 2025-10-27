import { useState, useEffect, useCallback } from "react";

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface UseWindowDragProps {
  initialPosition: Position;
  size: Size;
  isMaximized: boolean;
}

export const useWindowDrag = ({
  initialPosition,
  size,
  isMaximized,
}: UseWindowDragProps) => {
  const [position, setPosition] = useState<Position>(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });

  const handleDragStart = useCallback(
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
    if (!isDragging) return;

    const handleDragMove = (e: MouseEvent) => {
      // Calculate new position
      let newX = e.clientX - dragOffset.x;
      let newY = e.clientY - dragOffset.y;

      // Get window dimensions
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const shellWidth = size.width;

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

    const handleDragEnd = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleDragMove);
    document.addEventListener("mouseup", handleDragEnd);

    return () => {
      document.removeEventListener("mousemove", handleDragMove);
      document.removeEventListener("mouseup", handleDragEnd);
    };
  }, [isDragging, dragOffset, size]);

  return {
    position,
    setPosition,
    isDragging,
    handleDragStart,
  };
};
