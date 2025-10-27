import { RouterProvider } from "react-router-dom";
import { FileSystemProvider, CommandProvider } from "./providers";
import { router } from "./router";

function App() {
  return (
    <FileSystemProvider>
      <CommandProvider>
        <RouterProvider router={router} />
      </CommandProvider>
    </FileSystemProvider>
  );
}

export default App;
