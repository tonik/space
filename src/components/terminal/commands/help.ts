import type { Command, CommandRegistry } from "../types";
import { colorizeMessages } from "../utils";
import { COMMAND_RESPONSES } from "../content";

export const createHelpCommand = (registry: CommandRegistry): Command => ({
  execute: (_, context) => {
    const { commandCounts } = context;
    const helpCount = commandCounts?.["help"] || 0;

    if (helpCount === 4) {
      return colorizeMessages(COMMAND_RESPONSES.helpLimitExceeded);
    }

    const commands = Object.entries(registry)
      .filter(([name]) => name !== "help")
      .map(([name, cmd]) => {
        const usage = cmd.usage || name;
        return `  ${usage.padEnd(12)} - ${cmd.description}`;
      })
      .sort();

    return [
      "Available commands:",
      ...commands,
      "  help         - Show this help message",
    ];
  },
  description: "Show this help message",
});
