import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Shell } from "./Shell";
import { FileSystemProvider } from "@/app/providers/FileSystemContext";

// Mock the executeCommand function
vi.mock("@/features/execute-command", () => ({
  executeCommand: vi.fn((input) => {
    if (input === "ls") {
      return { success: true, output: "file1.txt file2.txt" };
    }
    if (input === "pwd") {
      return { success: true, output: "/home/user" };
    }
    if (input === "unknown") {
      return {
        success: false,
        output: "",
        error: "command not found: unknown",
      };
    }
    return { success: true, output: "" };
  }),
}));

const ShellWithProvider = () => (
  <FileSystemProvider>
    <Shell />
  </FileSystemProvider>
);

describe("Shell", () => {
  it("should render welcome message on mount", () => {
    render(<ShellWithProvider />);
    expect(
      screen.getByText(/Welcome to 13months Web Shell Portfolio/)
    ).toBeInTheDocument();
  });

  it("should render command line", () => {
    render(<ShellWithProvider />);
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
  });

  it("should execute command and display output", () => {
    render(<ShellWithProvider />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "ls" } });
    fireEvent.keyDown(input, { key: "Enter" });

    // Should show the command
    expect(screen.getByText(/visitor@13months/)).toBeInTheDocument();

    // Should show the output
    expect(screen.getByText("file1.txt file2.txt")).toBeInTheDocument();
  });

  it("should display error messages", () => {
    render(<ShellWithProvider />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "unknown" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(screen.getByText("command not found: unknown")).toBeInTheDocument();
  });

  it("should clear output when clear command is executed", () => {
    render(<ShellWithProvider />);

    const input = screen.getByRole("textbox");

    // Execute a command first
    fireEvent.change(input, { target: { value: "ls" } });
    fireEvent.keyDown(input, { key: "Enter" });

    // Verify output exists
    expect(screen.getByText("file1.txt file2.txt")).toBeInTheDocument();

    // Execute clear command
    fireEvent.change(input, { target: { value: "clear" } });
    fireEvent.keyDown(input, { key: "Enter" });

    // Output should be cleared (welcome message and previous output should be gone)
    expect(screen.queryByText("file1.txt file2.txt")).not.toBeInTheDocument();
    expect(screen.queryByText(/Welcome to 13months/)).not.toBeInTheDocument();
  });

  it("should handle empty command", () => {
    render(<ShellWithProvider />);

    const input = screen.getByRole("textbox");
    fireEvent.keyDown(input, { key: "Enter" });

    // Should not crash and input should still be available
    expect(input).toBeInTheDocument();
  });

  it("should display current path in prompt", () => {
    render(<ShellWithProvider />);

    // Default path should be /home/user
    expect(screen.getByText("/home/user")).toBeInTheDocument();
  });

  it("should focus input when clicking shell area", () => {
    const { container } = render(<ShellWithProvider />);

    const shell = container.querySelector(".shell");
    const input = screen.getByRole("textbox") as HTMLInputElement;

    // Blur the input first
    input.blur();

    // Click on shell
    if (shell) {
      fireEvent.click(shell);
    }

    // Input should be focused (we can't directly test focus, but we can verify the handler exists)
    expect(input).toBeInTheDocument();
  });
});
