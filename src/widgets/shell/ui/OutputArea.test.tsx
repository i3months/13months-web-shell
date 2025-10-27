import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { OutputArea, OutputItem } from "./OutputArea";

describe("OutputArea", () => {
  let scrollIntoViewMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    scrollIntoViewMock = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoViewMock;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render empty output area", () => {
    const { container } = render(<OutputArea outputs={[]} />);
    const outputArea = container.querySelector(".output-area");
    expect(outputArea).toBeInTheDocument();
  });

  it("should render command output items", () => {
    const outputs: OutputItem[] = [
      {
        id: "1",
        type: "command",
        content: "visitor@13months:~$ ls",
        timestamp: Date.now(),
      },
    ];

    render(<OutputArea outputs={outputs} />);
    expect(screen.getByText("visitor@13months:~$ ls")).toBeInTheDocument();
  });

  it("should render output items", () => {
    const outputs: OutputItem[] = [
      {
        id: "1",
        type: "output",
        content: "file1.txt file2.txt",
        timestamp: Date.now(),
      },
    ];

    render(<OutputArea outputs={outputs} />);
    expect(screen.getByText("file1.txt file2.txt")).toBeInTheDocument();
  });

  it("should render error items", () => {
    const outputs: OutputItem[] = [
      {
        id: "1",
        type: "error",
        content: "command not found: xyz",
        timestamp: Date.now(),
      },
    ];

    render(<OutputArea outputs={outputs} />);
    expect(screen.getByText("command not found: xyz")).toBeInTheDocument();
  });

  it("should render system messages", () => {
    const outputs: OutputItem[] = [
      {
        id: "1",
        type: "system",
        content: "Welcome to the shell!",
        timestamp: Date.now(),
      },
    ];

    render(<OutputArea outputs={outputs} />);
    expect(screen.getByText("Welcome to the shell!")).toBeInTheDocument();
  });

  it("should render multiple output items", () => {
    const outputs: OutputItem[] = [
      {
        id: "1",
        type: "command",
        content: "visitor@13months:~$ ls",
        timestamp: Date.now(),
      },
      {
        id: "2",
        type: "output",
        content: "file1.txt",
        timestamp: Date.now(),
      },
      {
        id: "3",
        type: "command",
        content: "visitor@13months:~$ pwd",
        timestamp: Date.now(),
      },
      {
        id: "4",
        type: "output",
        content: "/home/user",
        timestamp: Date.now(),
      },
    ];

    render(<OutputArea outputs={outputs} />);
    expect(screen.getByText("visitor@13months:~$ ls")).toBeInTheDocument();
    expect(screen.getByText("file1.txt")).toBeInTheDocument();
    expect(screen.getByText("visitor@13months:~$ pwd")).toBeInTheDocument();
    expect(screen.getByText("/home/user")).toBeInTheDocument();
  });

  it("should auto-scroll to bottom when new output is added", () => {
    const { rerender } = render(<OutputArea outputs={[]} />);

    const newOutputs: OutputItem[] = [
      {
        id: "1",
        type: "output",
        content: "New output",
        timestamp: Date.now(),
      },
    ];

    rerender(<OutputArea outputs={newOutputs} />);

    // scrollIntoView should be called for auto-scroll
    expect(scrollIntoViewMock).toHaveBeenCalled();
  });

  it("should handle multi-line output", () => {
    const outputs: OutputItem[] = [
      {
        id: "1",
        type: "output",
        content: "Line 1\nLine 2\nLine 3",
        timestamp: Date.now(),
      },
    ];

    render(<OutputArea outputs={outputs} />);
    expect(screen.getByText(/Line 1/)).toBeInTheDocument();
    expect(screen.getByText(/Line 2/)).toBeInTheDocument();
    expect(screen.getByText(/Line 3/)).toBeInTheDocument();
  });
});
