import { useState, useCallback } from "react";

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface UseWindowControlsProps {
  position: Position;
  size: Size;
  setPosition: (position: Position) => void;
  setSize: (size: Size) => void;
}

export const useWindowControls = ({
  position,
  size,
  setPosition,
  setSize,
}: UseWindowControlsProps) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [prevPosition, setPrevPosition] = useState<Position>(position);
  const [prevSize, setPrevSize] = useState<Size>(size);

  const handleMinimize = useCallback(() => {
    // In a real app, this would minimize to taskbar
    alert(
      "Minimize functionality - in a real app, this would minimize the window"
    );
  }, []);

  const handleMaximize = useCallback(() => {
    if (isMaximized) {
      setPosition(prevPosition);
      setSize(prevSize);
      setIsMaximized(false);
    } else {
      setPrevPosition(position);
      setPrevSize(size);
      setPosition({ x: 0, y: 0 });
      setSize({ width: window.innerWidth, height: window.innerHeight });
      setIsMaximized(true);
    }
  }, [
    isMaximized,
    position,
    prevPosition,
    size,
    prevSize,
    setPosition,
    setSize,
  ]);

  const handleClose = useCallback(() => {
    // In a real app, this would close the window
    // For now, we'll just hide it or reload the page
    if (confirm("Close terminal?")) {
      // Option 1: Reload the page (simulates closing and reopening)
      window.location.reload();

      // Option 2: Navigate to a blank page (uncomment if preferred)
      // window.location.href = 'about:blank';
    }
  }, []);

  return {
    isMaximized,
    handleMinimize,
    handleMaximize,
    handleClose,
  };
};
