import type { ParsedCommand } from "./types";

/**
 * Parses a command string into command name, arguments, and flags
 * Handles quoted arguments and special characters
 * @param input - The raw command input string
 * @returns ParsedCommand object with name, args, and flags
 */
export const parseCommand = (input: string): ParsedCommand => {
  const trimmed = input.trim();

  if (!trimmed) {
    return {
      name: "",
      args: [],
      flags: {},
    };
  }

  const tokens: string[] = [];
  let current = "";
  let inQuotes = false;
  let quoteChar = "";

  // Tokenize the input, respecting quotes
  for (let i = 0; i < trimmed.length; i++) {
    const char = trimmed[i];

    if ((char === '"' || char === "'") && !inQuotes) {
      // Start of quoted string
      inQuotes = true;
      quoteChar = char;
    } else if (char === quoteChar && inQuotes) {
      // End of quoted string
      inQuotes = false;
      quoteChar = "";
    } else if (char === " " && !inQuotes) {
      // Space outside quotes - token boundary
      if (current) {
        tokens.push(current);
        current = "";
      }
    } else {
      // Regular character
      current += char;
    }
  }

  // Add the last token
  if (current) {
    tokens.push(current);
  }

  if (tokens.length === 0) {
    return {
      name: "",
      args: [],
      flags: {},
    };
  }

  const name = tokens[0] || "";
  const args: string[] = [];
  const flags: Record<string, boolean | string> = {};

  // Process remaining tokens as args or flags
  for (let i = 1; i < tokens.length; i++) {
    const token = tokens[i];
    if (!token) continue;

    if (token.startsWith("--")) {
      // Long flag (--flag or --flag=value)
      const flagName = token.slice(2);
      const equalIndex = flagName.indexOf("=");

      if (equalIndex !== -1) {
        // Flag with value: --flag=value
        const key = flagName.slice(0, equalIndex);
        const value = flagName.slice(equalIndex + 1);
        flags[key] = value;
      } else {
        // Boolean flag: --flag
        flags[flagName] = true;
      }
    } else if (token.startsWith("-") && token.length > 1) {
      // Short flag(s) (-f or -abc)
      const flagChars = token.slice(1);

      // Check if next token is a value for this flag
      const nextToken = tokens[i + 1];
      if (flagChars.length === 1 && nextToken && !nextToken.startsWith("-")) {
        // Single flag with value: -f value
        flags[flagChars] = nextToken;
        i++; // Skip next token
      } else {
        // Boolean flag(s): -f or -abc (treat as -a -b -c)
        for (const char of flagChars) {
          flags[char] = true;
        }
      }
    } else {
      // Regular argument
      args.push(token);
    }
  }

  return {
    name,
    args,
    flags,
  };
};
