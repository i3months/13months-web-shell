import { describe, it, expect } from "vitest";
import { parseCommand } from "./parseCommand";

describe("parseCommand", () => {
  it("should parse simple command without arguments", () => {
    const result = parseCommand("ls");
    expect(result.name).toBe("ls");
    expect(result.args).toEqual([]);
    expect(result.flags).toEqual({});
  });

  it("should parse command with single argument", () => {
    const result = parseCommand("cd projects");
    expect(result.name).toBe("cd");
    expect(result.args).toEqual(["projects"]);
  });

  it("should parse command with multiple arguments", () => {
    const result = parseCommand("echo hello world");
    expect(result.name).toBe("echo");
    expect(result.args).toEqual(["hello", "world"]);
  });

  it("should parse command with flags", () => {
    const result = parseCommand("ls -la");
    expect(result.name).toBe("ls");
    expect(result.flags).toHaveProperty("l");
    expect(result.flags).toHaveProperty("a");
  });

  it("should handle quoted arguments", () => {
    const result = parseCommand('echo "hello world"');
    expect(result.name).toBe("echo");
    expect(result.args).toContain("hello world");
  });

  it("should handle empty input", () => {
    const result = parseCommand("");
    expect(result.name).toBe("");
    expect(result.args).toEqual([]);
  });

  it("should trim whitespace", () => {
    const result = parseCommand("  ls  ");
    expect(result.name).toBe("ls");
  });

  it("should handle multiple spaces between arguments", () => {
    const result = parseCommand("echo   hello   world");
    expect(result.name).toBe("echo");
    expect(result.args.length).toBeGreaterThan(0);
  });
});
