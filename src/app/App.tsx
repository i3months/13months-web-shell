import { FileSystemProvider, CommandProvider } from "./providers";

function App() {
  return (
    <FileSystemProvider>
      <CommandProvider>
        <div className="min-h-screen p-4">
          <h1 className="text-terminal-prompt text-2xl">13months Web Shell</h1>
          <p className="mt-2">Project initialized successfully!</p>
        </div>
      </CommandProvider>
    </FileSystemProvider>
  );
}

export default App;
