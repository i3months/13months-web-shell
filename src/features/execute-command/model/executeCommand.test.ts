import { describe, it, expect, beforeEach, vi } from "vitest";
import { executeCommand } from "./executeCommand";
import { VirtualFileSystem } from "../../../entities/file-system/model/VirtualFileSystem";
import type { ExecutionContext } from "./types";

describe("executeCommand", () => {
  let context: ExecutionContext;

  beforeEach(() => {
    const fileSystem = new VirtualFileSystem();
    context = {
      fileSystem,
      currentPath: fileSystem.getCurrentPath(),
      customCommands: [
        {
          name: "linkedin",
          type: "link",
          value: "https://linkedin.com/in/test",
          description: "LinkedIn profile",
        },
        {
          name: "hobby",
          type: "text",
          value: "🎹 Piano",
          description: "My hobbies",
        },
      ],
    };
    vi.restoreAllMocks();
  });

  describe("built-in commands", () => {
    it("should execute ls command", async () => {
      const result = await executeCommand("ls", context);
      expect(result.success).toBe(true);
      expect(result.output).toContain("about.txt");
    });

    it("should execute pwd command", async () => {
      const result = await executeCommand("pwd", context);
      expect(result.success).toBe(true);
      expect(result.output).toBe("/home/user");
    });

    it("should execute echo command", async () => {
      const result = await executeCommand("echo hello world", context);
      expect(result.success).toBe(true);
      expect(result.output).toBe("hello world");
    });

    it("should execute clear command", async () => {
      const result = await executeCommand("clear", context);
      expect(result.success).toBe(true);
      expect(result.output).toBe("__CLEAR__");
    });

    it("should execute help command", async () => {
      const result = await executeCommand("help", context);
      expect(result.success).toBe(true);
      expect(result.output).toContain("Available Commands");
    });

    it("should execute cd command", async () => {
      const result = await executeCommand("cd projects", context);
      expect(result.success).toBe(true);
      expect(context.fileSystem.getCurrentPath()).toBe("/home/user/projects");
    });
  });

  describe("custom commands", () => {
    it("should execute text-type custom command", async () => {
      const result = await executeCommand("hobby", context);
      expect(result.success).toBe(true);
      expect(result.output).toBe("🎹 Piano");
    });

    it("should execute link-type custom command", async () => {
      const mockOpen = vi.fn();
      vi.stubGlobal("open", mockOpen);

      const result = await executeCommand("linkedin", context);
      expect(result.success).toBe(true);
      expect(mockOpen).toHaveBeenCalled();
    });
  });

  describe("error handling", () => {
    it("should return error for unknown command", async () => {
      const result = await executeCommand("unknown", context);
      expect(result.success).toBe(false);
      expect(result.error).toContain("command not found");
      expect(result.error).toContain("unknown");
    });

    it("should handle empty command", async () => {
      const result = await executeCommand("", context);
      expect(result.success).toBe(true);
      expect(result.output).toBe("");
    });

    it("should handle command with invalid arguments", async () => {
      const result = await executeCommand("cd nonexistent", context);
      expect(result.success).toBe(false);
      expect(result.error).toContain("no such file or directory");
    });

    it("should handle ls with non-existent path", async () => {
      const result = await executeCommand("ls nonexistent", context);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe("command parsing", () => {
    it("should handle commands with extra whitespace", async () => {
      const result = await executeCommand("  ls  ", context);
      expect(result.success).toBe(true);
    });

    it("should handle commands with multiple arguments", async () => {
      const result = await executeCommand("echo one two three", context);
      expect(result.success).toBe(true);
      expect(result.output).toBe("one two three");
    });
  });

  describe("context updates", () => {
    it("should update context after cd command", async () => {
      const initialPath = context.currentPath;
      await executeCommand("cd projects", context);
      const newPath = context.fileSystem.getCurrentPath();

      expect(newPath).not.toBe(initialPath);
      expect(newPath).toBe("/home/user/projects");
    });

    it("should maintain context across multiple commands", async () => {
      await executeCommand("cd projects", context);
      context.currentPath = context.fileSystem.getCurrentPath();

      const result = await executeCommand("pwd", context);
      expect(result.output).toBe("/home/user/projects");
    });
  });
});
