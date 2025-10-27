import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock scrollIntoView for tests
Element.prototype.scrollIntoView = vi.fn();
