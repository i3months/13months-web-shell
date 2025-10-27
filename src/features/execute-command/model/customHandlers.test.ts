import { describe, it, expect, vi, beforeEach } from "vitest";
import { executeCustom } from "./customHandlers";
import type { CustomCommand } from "../../../entities/command/model/types";

describe("customHandlers", () => {
  describe("executeCustom", () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it("should execute text-type custom command", () => {
      const command: CustomCommand = {
        name: "hobby",
        type: "text",
        value: "🎹 Piano, 📸 Photography",
        description: "My hobbies",
      };

      const result = executeCustom(command);
      expect(result.success).toBe(true);
      expect(result.output).toBe("🎹 Piano, 📸 Photography");
    });

    it("should execute link-type custom command", () => {
      const mockOpen = vi.fn();
      vi.stubGlobal("open", mockOpen);

      const command: CustomCommand = {
        name: "linkedin",
        type: "link",
        value: "https://linkedin.com/in/test",
        description: "LinkedIn profile",
      };

      const result = executeCustom(command);
      expect(result.success).toBe(true);
      expect(result.output).toContain("Opening");
      expect(mockOpen).toHaveBeenCalledWith(
        "https://linkedin.com/in/test",
        "_blank",
        "noopener,noreferrer"
      );
    });

    it("should handle link opening failure", () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      vi.stubGlobal("open", vi.fn(() => {
        throw new Error("Failed to open");
      }));

      const command: CustomCommand = {
        name: "blog",
        type: "link",
        value: "https://example.com",
      };

      const result = executeCustom(command);
      expect(result.success).toBe(false);
      expect(result.error).toContain("Failed to open link");
      
      consoleErrorSpy.mockRestore();
    });

    it("should handle multi-line text output", () => {
      const command: CustomCommand = {
        name: "about",
        type: "text",
        value: "Line 1\\nLine 2\\nLine 3",
      };

      const result = executeCustom(command);
      expect(result.success).toBe(true);
      expect(result.output).toContain("Line 1");
      expect(result.output).toContain("Line 2");
      expect(result.output).toContain("Line 3");
    });

    it("should handle empty text value", () => {
      const command: CustomCommand = {
        name: "empty",
        type: "text",
        value: "",
      };

      const result = executeCustom(command);
      expect(result.success).toBe(true);
      expect(result.output).toBe("");
    });
  });
});
