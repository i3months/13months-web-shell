import React, { useEffect, useRef } from "react";

export interface OutputItem {
  id: string;
  type: "command" | "output" | "error" | "system";
  content: string;
  timestamp: number;
}

interface OutputAreaProps {
  outputs: OutputItem[];
}

const MAX_OUTPUT_ITEMS = 1000;

export const OutputArea: React.FC<OutputAreaProps> = ({ outputs }) => {
  const outputEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new output is added
  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [outputs]);

  // Apply output buffer limit
  const limitedOutputs = outputs.slice(-MAX_OUTPUT_ITEMS);

  return (
    <div className="output-area flex-1 overflow-y-auto overflow-x-hidden pb-2 sm:pb-4 scrollbar-thin scrollbar-thumb-terminal-text/20 scrollbar-track-transparent overscroll-contain touch-pan-y">
      {limitedOutputs.map((item) => (
        <div key={item.id} className="output-item mb-1 select-text">
          {item.type === "command" && (
            <div className="text-terminal-text font-mono whitespace-pre-wrap break-words text-xs sm:text-sm md:text-base">
              {item.content}
            </div>
          )}
          {item.type === "output" && (
            <div className="text-terminal-text font-mono whitespace-pre-wrap break-words text-xs sm:text-sm md:text-base">
              {item.content}
            </div>
          )}
          {item.type === "error" && (
            <div className="text-terminal-error font-mono whitespace-pre-wrap break-words text-xs sm:text-sm md:text-base">
              {item.content}
            </div>
          )}
          {item.type === "system" && (
            <div className="text-terminal-success font-mono whitespace-pre-wrap break-words text-xs sm:text-sm md:text-base">
              {item.content}
            </div>
          )}
        </div>
      ))}
      <div ref={outputEndRef} />
    </div>
  );
};
