import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CommandLine } from "./CommandLine";

describe("CommandLine", () => {
  const mockOnExecute = vi.fn();
  const defaultProps = {
    onExecute: mockOnExecute,
    username: "testuser",
    hostname: "testhost",
    currentPath: "/home/user",
    availableCommands: ["ls", "cd", "pwd", "echo", "help"],
  };

  beforeEach(() => {
    mockOnExecute.mockClear();
  });

  it("should render prompt with username, hostname, and path", () => {
    render(<CommandLine {...defaultProps} />);

    expect(screen.getByText("testuser")).toBeInTheDocument();
    expect(screen.getByText("testhost")).toBeInTheDocument();
    expect(screen.getByText("/home/user")).toBeInTheDocument();
  });

  it("should render input field", () => {
    render(<CommandLine {...defaultProps} />);

    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
  });

  it("should update input value when typing", () => {
    render(<CommandLine {...defaultProps} />);

    const input = screen.getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "ls" } });

    expect(input.value).toBe("ls");
  });

  it("should execute command on Enter key", () => {
    render(<CommandLine {...defaultProps} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "ls" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockOnExecute).toHaveBeenCalledWith("ls");
  });

  it("should clear input after executing command", () => {
    render(<CommandLine {...defaultProps} />);

    const input = screen.getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "ls" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(input.value).toBe("");
  });

  it("should handle empty command on Enter", () => {
    render(<CommandLine {...defaultProps} />);

    const input = screen.getByRole("textbox");
    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockOnExecute).toHaveBeenCalledWith("");
  });

  it("should navigate command history with up arrow", () => {
    render(<CommandLine {...defaultProps} />);

    const input = screen.getByRole("textbox") as HTMLInputElement;

    // Execute first command
    fireEvent.change(input, { target: { value: "ls" } });
    fireEvent.keyDown(input, { key: "Enter" });

    // Execute second command
    fireEvent.change(input, { target: { value: "pwd" } });
    fireEvent.keyDown(input, { key: "Enter" });

    // Press up arrow to get previous command
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(input.value).toBe("pwd");

    // Press up arrow again
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(input.value).toBe("ls");
  });

  it("should navigate command history with down arrow", () => {
    render(<CommandLine {...defaultProps} />);

    const input = screen.getByRole("textbox") as HTMLInputElement;

    // Execute commands
    fireEvent.change(input, { target: { value: "ls" } });
    fireEvent.keyDown(input, { key: "Enter" });
    fireEvent.change(input, { target: { value: "pwd" } });
    fireEvent.keyDown(input, { key: "Enter" });

    // Navigate up
    fireEvent.keyDown(input, { key: "ArrowUp" });
    fireEvent.keyDown(input, { key: "ArrowUp" });

    // Navigate down
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input.value).toBe("pwd");
  });

  it("should auto-complete command on Tab key", () => {
    render(<CommandLine {...defaultProps} />);

    const input = screen.getByRole("textbox") as HTMLInputElement;

    // Type partial command
    fireEvent.change(input, { target: { value: "pw" } });
    fireEvent.keyDown(input, { key: "Tab" });

    // Should complete to "pwd "
    expect(input.value).toBe("pwd ");
  });

  it("should handle Tab with no matches", () => {
    render(<CommandLine {...defaultProps} />);

    const input = screen.getByRole("textbox") as HTMLInputElement;

    fireEvent.change(input, { target: { value: "xyz" } });
    fireEvent.keyDown(input, { key: "Tab" });

    // Should remain unchanged
    expect(input.value).toBe("xyz");
  });
});
