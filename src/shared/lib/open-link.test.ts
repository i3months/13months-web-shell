import { describe, it, expect, vi, beforeEach } from "vitest";
import { openLink } from "./open-link";

describe("open-link", () => {
  describe("openLink", () => {
    beforeEach(() => {
      // Reset window.open mock before each test
      vi.restoreAllMocks();
    });

    it("should open URL in new tab with correct parameters", () => {
      const mockOpen = vi.fn();
      vi.stubGlobal("open", mockOpen);

      const url = "https://example.com";
      const result = openLink(url);

      expect(mockOpen).toHaveBeenCalledWith(
        url,
        "_blank",
        "noopener,noreferrer"
      );
      expect(result).toBe(true);
    });

    it("should return true on successful link opening", () => {
      vi.stubGlobal("open", vi.fn());

      const result = openLink("https://example.com");

      expect(result).toBe(true);
    });

    it("should return false when window.open throws error", () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      vi.stubGlobal(
        "open",
        vi.fn(() => {
          throw new Error("Failed to open");
        })
      );

      const result = openLink("https://example.com");

      expect(result).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it("should handle various URL formats", () => {
      const mockOpen = vi.fn();
      vi.stubGlobal("open", mockOpen);

      openLink("https://example.com");
      openLink("http://example.com");
      openLink("https://example.com/path/to/page");

      expect(mockOpen).toHaveBeenCalledTimes(3);
    });
  });
});
