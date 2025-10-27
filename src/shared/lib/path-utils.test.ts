import { describe, it, expect } from "vitest";
import { normalizePath, joinPath, isAbsolutePath } from "./path-utils";

describe("path-utils", () => {
  describe("normalizePath", () => {
    it("should normalize absolute paths", () => {
      expect(normalizePath("/home/user")).toEqual(["home", "user"]);
      expect(normalizePath("/home/user/projects")).toEqual([
        "home",
        "user",
        "projects",
      ]);
    });

    it("should normalize relative paths with current path", () => {
      const currentPath = ["home", "user"];
      expect(normalizePath("projects", currentPath)).toEqual([
        "home",
        "user",
        "projects",
      ]);
      expect(normalizePath("projects/web", currentPath)).toEqual([
        "home",
        "user",
        "projects",
        "web",
      ]);
    });

    it("should handle . (current directory)", () => {
      const currentPath = ["home", "user"];
      expect(normalizePath(".", currentPath)).toEqual(["home", "user"]);
      expect(normalizePath("./projects", currentPath)).toEqual([
        "home",
        "user",
        "projects",
      ]);
    });

    it("should handle .. (parent directory)", () => {
      const currentPath = ["home", "user", "projects"];
      expect(normalizePath("..", currentPath)).toEqual(["home", "user"]);
      expect(normalizePath("../..", currentPath)).toEqual(["home"]);
      expect(normalizePath("../../other", currentPath)).toEqual([
        "home",
        "other",
      ]);
    });

    it("should handle .. at root (should not go above root)", () => {
      expect(normalizePath("/..", [])).toEqual([]);
      expect(normalizePath("/../home", [])).toEqual(["home"]);
    });

    it("should handle complex paths with mixed . and ..", () => {
      const currentPath = ["home", "user"];
      expect(normalizePath("./projects/../documents", currentPath)).toEqual([
        "home",
        "user",
        "documents",
      ]);
      expect(normalizePath("projects/./web/../mobile", currentPath)).toEqual([
        "home",
        "user",
        "projects",
        "mobile",
      ]);
    });

    it("should filter out empty segments", () => {
      expect(normalizePath("/home//user///projects")).toEqual([
        "home",
        "user",
        "projects",
      ]);
      expect(normalizePath("///")).toEqual([]);
    });

    it("should handle root path", () => {
      expect(normalizePath("/")).toEqual([]);
    });
  });

  describe("joinPath", () => {
    it("should join path segments with leading slash", () => {
      expect(joinPath(["home", "user"])).toBe("/home/user");
      expect(joinPath(["home", "user", "projects"])).toBe(
        "/home/user/projects"
      );
    });

    it("should return / for empty segments", () => {
      expect(joinPath([])).toBe("/");
    });

    it("should handle single segment", () => {
      expect(joinPath(["home"])).toBe("/home");
    });
  });

  describe("isAbsolutePath", () => {
    it("should return true for absolute paths", () => {
      expect(isAbsolutePath("/")).toBe(true);
      expect(isAbsolutePath("/home")).toBe(true);
      expect(isAbsolutePath("/home/user")).toBe(true);
    });

    it("should return false for relative paths", () => {
      expect(isAbsolutePath("home")).toBe(false);
      expect(isAbsolutePath(".")).toBe(false);
      expect(isAbsolutePath("..")).toBe(false);
      expect(isAbsolutePath("projects/web")).toBe(false);
    });

    it("should return false for empty string", () => {
      expect(isAbsolutePath("")).toBe(false);
    });
  });
});
