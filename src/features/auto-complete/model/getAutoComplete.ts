export interface AutoCompleteResult {
  matches: string[];
  commonPrefix: string;
}

/**
 * Find the common prefix among an array of strings
 */
const findCommonPrefix = (strings: string[]): string => {
  if (strings.length === 0) return "";
  if (strings.length === 1) return strings[0] || "";

  let prefix = strings[0] || "";

  for (let i = 1; i < strings.length; i++) {
    const current = strings[i];
    if (!current) continue;

    while (current.indexOf(prefix) !== 0) {
      prefix = prefix.substring(0, prefix.length - 1);
      if (prefix === "") return "";
    }
  }

  return prefix;
};

/**
 * Get auto-complete suggestions for a partial command input
 * @param partial - The partial command string to complete
 * @param availableCommands - Array of all available command names
 * @returns AutoCompleteResult with matches and common prefix
 */
export const getAutoComplete = (
  partial: string,
  availableCommands: string[]
): AutoCompleteResult => {
  // Filter commands that start with the partial input
  const matches = availableCommands.filter((cmd) => cmd.startsWith(partial));

  // No matches found
  if (matches.length === 0) {
    return { matches: [], commonPrefix: partial };
  }

  // Single match - return the complete command
  if (matches.length === 1) {
    return { matches, commonPrefix: matches[0] || partial };
  }

  // Multiple matches - find common prefix
  const commonPrefix = findCommonPrefix(matches);
  return { matches, commonPrefix };
};
