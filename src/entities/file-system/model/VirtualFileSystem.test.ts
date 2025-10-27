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
      vfs.changeDirectory("projects");
      expect(vfs.getCurrentPath()).toBe("/home/user/projects");
    });
  });

  describe("changeDirectory", () => {
    it("should navigate to absolute paths", () => {
      const result = vfs.changeDirectory("/home");
      expect(result).toBe(true);
      expect(vfs.getCurrentPath()).toBe("/home");
    });

    it("should navigate to relative paths", () => {
      const result = vfs.changeDirectory("projects");
      expect(result).toBe(true);
      expect(vfs.getCurrentPath()).toBe("/home/user/projects");
    });

    it("should handle .. to go to parent directory", () => {
      vfs.changeDirectory("projects");
      const result = vfs.changeDirectory("..");
      expect(result).toBe(true);
      expect(vfs.getCurrentPath()).toBe("/home/user");
    });

    it("should handle multiple .. to go up multiple levels", () => {
      vfs.changeDirectory("projects");
      const result = vfs.changeDirectory("../..");
      expect(result).toBe(true);
      expect(vfs.getCurrentPath()).toBe("/home");
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
      const result = vfs.changeDirectory("about.txt");
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
      const result = vfs.changeDirectory("./projects/../projects");
      expect(result).toBe(true);
      expect(vfs.getCurrentPath()).toBe("/home/user/projects");
    });
  });

  describe("listDirectory", () => {
    it("should list current directory contents", () => {
      const contents = vfs.listDirectory();
      expect(contents).toHaveLength(3);

      const names = contents.map((node) => node.name);
      expect(names).toContain("about.txt");
      expect(names).toContain("contact.txt");
      expect(names).toContain("projects");
    });

    it("should list directory contents with . path", () => {
      const contents = vfs.listDirectory(".");
      expect(contents).toHaveLength(3);
    });

    it("should list root directory contents", () => {
      const contents = vfs.listDirectory("/");
      expect(contents).toHaveLength(1);
      expect(contents[0].name).toBe("home");
    });

    it("should list absolute path directory", () => {
      const contents = vfs.listDirectory("/home");
      expect(contents).toHaveLength(1);
      expect(contents[0].name).toBe("user");
    });

    it("should list relative path directory", () => {
      const contents = vfs.listDirectory("projects");
      expect(contents).toHaveLength(1);
      expect(contents[0].name).toBe("README.md");
    });

    it("should return empty array for non-existent directory", () => {
      const contents = vfs.listDirectory("nonexistent");
      expect(contents).toEqual([]);
    });

    it("should return empty array when trying to list a file", () => {
      const contents = vfs.listDirectory("about.txt");
      expect(contents).toEqual([]);
    });

    it("should handle .. in path", () => {
      vfs.changeDirectory("projects");
      const contents = vfs.listDirectory("..");
      expect(contents).toHaveLength(3);
    });
  });

  describe("getNode", () => {
    it("should get root node", () => {
      const node = vfs.getNode("/");
      expect(node).not.toBeNull();
      expect(node?.type).toBe("directory");
    });

    it("should get node by absolute path", () => {
      const node = vfs.getNode("/home/user/about.txt");
      expect(node).not.toBeNull();
      expect(node?.name).toBe("about.txt");
      expect(node?.type).toBe("file");
    });

    it("should get node by relative path", () => {
      const node = vfs.getNode("about.txt");
      expect(node).not.toBeNull();
      expect(node?.name).toBe("about.txt");
    });

    it("should get directory node", () => {
      const node = vfs.getNode("projects");
      expect(node).not.toBeNull();
      expect(node?.type).toBe("directory");
    });

    it("should return null for non-existent path", () => {
      const node = vfs.getNode("nonexistent");
      expect(node).toBeNull();
    });

    it("should handle .. in path", () => {
      vfs.changeDirectory("projects");
      const node = vfs.getNode("../about.txt");
      expect(node).not.toBeNull();
      expect(node?.name).toBe("about.txt");
    });

    it("should handle . in path", () => {
      const node = vfs.getNode("./about.txt");
      expect(node).not.toBeNull();
      expect(node?.name).toBe("about.txt");
    });
  });

  describe("edge cases", () => {
    it("should handle paths with multiple slashes", () => {
      const result = vfs.changeDirectory("//home//user//projects");
      expect(result).toBe(true);
      expect(vfs.getCurrentPath()).toBe("/home/user/projects");
    });

    it("should maintain state across multiple operations", () => {
      vfs.changeDirectory("projects");
      expect(vfs.getCurrentPath()).toBe("/home/user/projects");

      const contents = vfs.listDirectory();
      expect(contents).toHaveLength(1);

      vfs.changeDirectory("..");
      expect(vfs.getCurrentPath()).toBe("/home/user");
    });
  });
});
