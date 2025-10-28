import React, { useEffect, useRef } from "react";

export interface OutputItem {
  id: string;
  type: "command" | "output" | "error" | "system";
  content: string;
  timestamp: number;
  prompt?: {
    username: string;
    hostname: string;
    path: string;
  };
  command?: string;
}

interface OutputAreaProps {
  outputs: OutputItem[];
  children?: React.ReactNode;
}

const MAX_OUTPUT_ITEMS = 1000;

export const OutputArea: React.FC<OutputAreaProps> = ({
  outputs,
  children,
}) => {
  const outputEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new output is added
  useEffect(() => {
    // Scroll to the end marker instantly (no animation)
    outputEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [outputs]);

  // Apply output buffer limit
  const limitedOutputs = outputs.slice(-MAX_OUTPUT_ITEMS);

  return (
    <div ref={containerRef} className="output-area">
      {limitedOutputs.map((item) => (
        <div key={item.id} className="output-item select-text">
          {item.type === "command" && (
            <div className="font-mono whitespace-pre-wrap break-words text-xs sm:text-sm md:text-base">
              {item.prompt ? (
                <>
                  <span className="font-bold" style={{ color: "#8ae234" }}>
                    {item.prompt.username}
                  </span>
                  <span className="text-white">@</span>
                  <span className="font-bold" style={{ color: "#8ae234" }}>
                    {item.prompt.hostname}
                  </span>
                  <span className="text-white">:</span>
                  <span className="font-bold" style={{ color: "#8ae234" }}>
                    {item.prompt.path}
                  </span>
                  <span className="text-white">$ </span>
                  <span className="text-white">{item.command}</span>
                </>
              ) : (
                <span className="text-white">{item.content}</span>
              )}
            </div>
          )}
          {item.type === "output" && (
            <div
              className="text-terminal-text font-mono whitespace-pre-wrap break-words text-xs sm:text-sm md:text-base"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {item.content.split("\n").map((line, i, arr) => (
                <React.Fragment key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </React.Fragment>
              ))}
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
      {children}
      <div ref={outputEndRef} />
    </div>
  );
};
