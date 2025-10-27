import { createBrowserRouter, Navigate } from "react-router-dom";
import { TerminalPage } from "@/pages/terminal";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <TerminalPage />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
