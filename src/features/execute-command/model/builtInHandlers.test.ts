import { describe, it, expect, beforeEach } from "vitest";
import {
  handleLs,
  handlePwd,
  handleClear,
  handleEcho,
  handleHelp,
} from "./builtInHandlers";
import { VirtualFileSystem } from "../../../entities/file-system/model/VirtualFileSystem";
import type { ExecutionContext } from "./types";

describe("builtInHandlers", () => {
  let context: ExecutionContext;

  beforeEach(() => {
    const fileSystem = new VirtualFileSystem();
    context = {
      fileSystem,
      currentPath: fileSystem.getCurrentPath(),
      customCommands: [
        {
          name: "test",
          type: "text",
          value: "Test command",
          description: "A test command",
        },
      ],
    };
  });

  describe("handleLs", () => {
    it("should list current directory contents", () => {
      const result = handleLs([], context);
      expect(result.success).toBe(true);
      expect(result.output).toContain("Slowly.java");
      expect(result.output).toContain("Steadily.js");
      expect(result.output).toContain("Quietly.py");
    });

    it("should list specified directory", () => {
      const result = handleLs(["/home"], context);
      expect(result.success).toBe(true);
      expect(result.output).toContain("user/");
    });

    it("should return error for non-existent directory", () => {
      const result = handleLs(["nonexistent"], context);
      expect(result.success).toBe(false);
      expect(result.error).toContain("No such file or directory");
    });

    it("should return error when trying to ls a file", () => {
      const result = handleLs(["Slowly.java"], context);
      expect(result.success).toBe(false);
      expect(result.error).toContain("Not a directory");
    });

    it("should handle absolute paths", () => {
      const result = handleLs(["/home"], context);
      expect(result.success).toBe(true);
      expect(result.output).toContain("user/");
    });

    it("should show directories with trailing slash", () => {
      const result = handleLs(["/home"], context);
      expect(result.output).toContain("user/");
    });

    it("should show long format with -l flag", () => {
      const result = handleLs([], context, { l: true });
      expect(result.success).toBe(true);
      // Should contain newlines for multi-line output
      expect(result.output).toContain("\n");
      // Should contain file names
      expect(result.output).toContain("Slowly.java");
    });

    it("should show long format with -la flag", () => {
      const result = handleLs([], context, { l: true, a: true });
      expect(result.success).toBe(true);
      expect(result.output).toContain("\n");
    });

    it("should show long format with -al flag", () => {
      const result = handleLs([], context, { a: true, l: true });
      expect(result.success).toBe(true);
      expect(result.output).toContain("\n");
    });
  });

  describe("handlePwd", () => {
    it("should return current working directory", () => {
      const result = handlePwd([], context);
      expect(result.success).toBe(true);
      expect(result.output).toBe("/home/user");
    });

    it("should return updated path after directory change", () => {
      context.fileSystem.changeDirectory("/home");
      context.currentPath = context.fileSystem.getCurrentPath();

      const result = handlePwd([], context);
      expect(result.success).toBe(true);
      expect(result.output).toBe("/home");
    });
  });

  describe("handleClear", () => {
    it("should return clear marker", () => {
      const result = handleClear([], context);
      expect(result.success).toBe(true);
      expect(result.output).toBe("__CLEAR__");
    });
  });

  describe("handleEcho", () => {
    it("should echo single argument", () => {
      const result = handleEcho(["hello"], context);
      expect(result.success).toBe(true);
      expect(result.output).toBe("hello");
    });

    it("should echo multiple arguments with spaces", () => {
      const result = handleEcho(["hello", "world"], context);
      expect(result.success).toBe(true);
      expect(result.output).toBe("hello world");
    });

    it("should return empty string for no arguments", () => {
      const result = handleEcho([], context);
      expect(result.success).toBe(true);
      expect(result.output).toBe("");
    });

    it("should handle special characters", () => {
      const result = handleEcho(["hello!", "@world", "#test"], context);
      expect(result.success).toBe(true);
      expect(result.output).toContain("hello!");
      expect(result.output).toContain("@world");
    });
  });

  describe("handleHelp", () => {
    it("should display built-in commands", () => {
      const result = handleHelp([], context);
      expect(result.success).toBe(true);
      expect(result.output).toContain("ls");
      expect(result.output).toContain("cd");
      expect(result.output).toContain("pwd");
      expect(result.output).toContain("echo");
      expect(result.output).toContain("clear");
      expect(result.output).toContain("help");
    });

    it("should display custom commands", () => {
      const result = handleHelp([], context);
      expect(result.success).toBe(true);
      expect(result.output).toContain("test");
      expect(result.output).toContain("A test command");
    });

    it("should work with no custom commands", () => {
      context.customCommands = [];
      const result = handleHelp([], context);
      expect(result.success).toBe(true);
      expect(result.output).toContain("Built-in Commands");
    });
  });
});
