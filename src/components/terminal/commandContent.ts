import type { CommandContext } from "./types";

/**
 * Command content can be either:
 * - Static array of strings
 * - Function that takes context and returns array of strings
 */
export type CommandContent = string[] | ((context: CommandContext) => string[]);

/**
 * Interface for defining custom command behaviors per scene/step
 */
export interface CommandContentMap {
  // Basic commands
  whoami?: CommandContent;
  date?: CommandContent;
  comms?: CommandContent;

  // Investigation commands
  "sleep log"?: CommandContent;
  memories?: CommandContent;
  anomalies?: CommandContent;
  status?: CommandContent;

  // Action commands
  override?: CommandContent;

  // Interactive commands can have custom prompts/responses
  echo?: {
    variations?: Array<(input: string) => string>;
  };
  overwrite?: CommandContent;
}

/**
 * Helper to execute command content with context
 */
export const executeCommandContent = (
  content: CommandContent,
  context: CommandContext,
): string[] => {
  if (typeof content === "function") {
    return content(context);
  }
  return content;
};
