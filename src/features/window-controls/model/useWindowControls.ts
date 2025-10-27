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
    if (confirm("Close terminal?")) {
      // In a real app, this would close the window
      window.close();
    }
  }, []);

  return {
    isMaximized,
    handleMinimize,
    handleMaximize,
    handleClose,
  };
};
