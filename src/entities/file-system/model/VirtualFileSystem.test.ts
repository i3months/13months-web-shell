import { describe, it, expect, beforeEach } from "vitest";
import { VirtualFileSystem } from "./VirtualFileSystem";

describe("VirtualFileSystem", () => {
  let vfs: VirtualFileSystem;

  beforeEach(() => {
    vfs = new VirtualFileSystem();
  });

  describe("getCurrentPath", () => {
    it("should return initial path as /home/user", () => {
      expect(vfs.getCurrentPath()).toBe("/home/user");
    });

    it("should return / when at root", () => {
      vfs.changeDirectory("/");
      expect(vfs.getCurrentPath()).toBe("/");
    });

    it("should return correct path after navigation", () => {
      vfs.changeDirectory("/home");
      expect(vfs.getCurrentPath()).toBe("/home");
    });
  });

  describe("changeDirectory", () => {
    it("should navigate to absolute paths", () => {
      const result = vfs.changeDirectory("/home");
      expect(result).toBe(true);
      expect(vfs.getCurrentPath()).toBe("/home");
    });

    it("should navigate to relative paths", () => {
      vfs.changeDirectory("/");
      const result = vfs.changeDirectory("home");
      expect(result).toBe(true);
      expect(vfs.getCurrentPath()).toBe("/home");
    });

    it("should handle .. to go to parent directory", () => {
      vfs.changeDirectory("/home/user");
      const result = vfs.changeDirectory("..");
      expect(result).toBe(true);
      expect(vfs.getCurrentPath()).toBe("/home");
    });

    it("should handle multiple .. to go up multiple levels", () => {
      vfs.changeDirectory("/home/user");
      const result = vfs.changeDirectory("../..");
      expect(result).toBe(true);
      expect(vfs.getCurrentPath()).toBe("/");
    });

    it("should handle . to stay in current directory", () => {
      const result = vfs.changeDirectory(".");
      expect(result).toBe(true);
      expect(vfs.getCurrentPath()).toBe("/home/user");
    });

    it("should navigate to root with /", () => {
      const result = vfs.changeDirectory("/");
      expect(result).toBe(true);
      expect(vfs.getCurrentPath()).toBe("/");
    });

    it("should navigate to home with ~ or empty string", () => {
      vfs.changeDirectory("/");

      let result = vfs.changeDirectory("~");
      expect(result).toBe(true);
      expect(vfs.getCurrentPath()).toBe("/home/user");

      vfs.changeDirectory("/");
      result = vfs.changeDirectory("");
      expect(result).toBe(true);
      expect(vfs.getCurrentPath()).toBe("/home/user");
    });

    it("should return false for non-existent directory", () => {
      const result = vfs.changeDirectory("nonexistent");
      expect(result).toBe(false);
      expect(vfs.getCurrentPath()).toBe("/home/user");
    });

    it("should return false when trying to cd into a file", () => {
      const result = vfs.changeDirectory("Slowly.java");
      expect(result).toBe(false);
      expect(vfs.getCurrentPath()).toBe("/home/user");
    });

    it("should not go above root with ..", () => {
      vfs.changeDirectory("/");
      const result = vfs.changeDirectory("..");
      expect(result).toBe(true);
      expect(vfs.getCurrentPath()).toBe("/");
    });

    it("should handle complex paths with mixed . and ..", () => {
      const result = vfs.changeDirectory("./../user");
      expect(result).toBe(true);
      expect(vfs.getCurrentPath()).toBe("/home/user");
    });
  });

  describe("listDirectory", () => {
    it("should list current directory contents", () => {
      const contents = vfs.listDirectory();
      expect(contents).toHaveLength(3);

      const names = contents.map((node) => node.name);
      expect(names).toContain("Slowly.java");
      expect(names).toContain("Steadily.js");
      expect(names).toContain("Quietly.py");
    });

    it("should list directory contents with . path", () => {
      const contents = vfs.listDirectory(".");
      expect(contents).toHaveLength(3);
    });

    it("should list root directory contents", () => {
      const contents = vfs.listDirectory("/");
      expect(contents).toHaveLength(1);
      expect(contents[0]?.name).toBe("home");
    });

    it("should list absolute path directory", () => {
      const contents = vfs.listDirectory("/home");
      expect(contents).toHaveLength(1);
      expect(contents[0]?.name).toBe("user");
    });

    it("should list relative path directory", () => {
      vfs.changeDirectory("/");
      const contents = vfs.listDirectory("home");
      expect(contents).toHaveLength(1);
      expect(contents[0]?.name).toBe("user");
    });

    it("should return empty array for non-existent directory", () => {
      const contents = vfs.listDirectory("nonexistent");
      expect(contents).toEqual([]);
    });

    it("should return empty array when trying to list a file", () => {
      const contents = vfs.listDirectory("Slowly.java");
      expect(contents).toEqual([]);
    });

    it("should handle .. in path", () => {
      vfs.changeDirectory("/home/user");
      const contents = vfs.listDirectory("..");
      expect(contents).toHaveLength(1);
      expect(contents[0]?.name).toBe("user");
    });
  });

  describe("getNode", () => {
    it("should get root node", () => {
      const node = vfs.getNode("/");
      expect(node).not.toBeNull();
      expect(node?.type).toBe("directory");
    });

    it("should get node by absolute path", () => {
      const node = vfs.getNode("/home/user/Slowly.java");
      expect(node).not.toBeNull();
      expect(node?.name).toBe("Slowly.java");
      expect(node?.type).toBe("file");
    });

    it("should get node by relative path", () => {
      const node = vfs.getNode("Slowly.java");
      expect(node).not.toBeNull();
      expect(node?.name).toBe("Slowly.java");
    });

    it("should get directory node", () => {
      vfs.changeDirectory("/");
      const node = vfs.getNode("home");
      expect(node).not.toBeNull();
      expect(node?.type).toBe("directory");
    });

    it("should return null for non-existent path", () => {
      const node = vfs.getNode("nonexistent");
      expect(node).toBeNull();
    });

    it("should handle .. in path", () => {
      vfs.changeDirectory("/home/user");
      const node = vfs.getNode("../user/Slowly.java");
      expect(node).not.toBeNull();
      expect(node?.name).toBe("Slowly.java");
    });

    it("should handle . in path", () => {
      const node = vfs.getNode("./Slowly.java");
      expect(node).not.toBeNull();
      expect(node?.name).toBe("Slowly.java");
    });
  });

  describe("edge cases", () => {
    it("should handle paths with multiple slashes", () => {
      const result = vfs.changeDirectory("//home//user");
      expect(result).toBe(true);
      expect(vfs.getCurrentPath()).toBe("/home/user");
    });

    it("should maintain state across multiple operations", () => {
      vfs.changeDirectory("/home");
      expect(vfs.getCurrentPath()).toBe("/home");

      const contents = vfs.listDirectory();
      expect(contents).toHaveLength(1);

      vfs.changeDirectory("user");
      expect(vfs.getCurrentPath()).toBe("/home/user");
    });
  });
});
