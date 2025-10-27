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
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new output is added
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current.parentElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [outputs]);

  // Apply output buffer limit
  const limitedOutputs = outputs.slice(-MAX_OUTPUT_ITEMS);

  return (
    <div ref={containerRef} className="output-area">
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
