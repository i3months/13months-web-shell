import { Shell } from "@/widgets/shell";

export const TerminalPage: React.FC = () => {
  return (
    <div className="terminal-page w-full h-screen overflow-hidden touch-none">
      <Shell />
    </div>
  );
};
