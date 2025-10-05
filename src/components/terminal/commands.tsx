import type { GameContext } from "@/state/types";
import { commandRegistry } from "./registry";
import { colorizeMessages } from "./utils";
import type {
  CommandContext,
  CommandResult,
  StoreDataCallback,
  InteractiveCallback,
} from "./types";

export type { StoreDataCallback, InteractiveCallback };

export const getCommands = (
  command: string,
  storeData?: StoreDataCallback,
  currentName?: string,
  interactiveCallback?: InteractiveCallback,
  commandCounts?: Record<string, number>,
  mission?: GameContext["mission"],
): CommandResult => {
  const context: CommandContext = {
    storeData,
    currentName,
    interactiveCallback,
    commandCounts,
    mission,
  };

  // Find and execute command
  const cmd = commandRegistry[command.toLowerCase()];

  if (cmd) {
    return cmd.execute(command, context);
  }

  // Handle unknown commands
  return colorizeMessages([
    `Error: Unknown command "${command}"`,
    'Type "help" for available commands.',
  ]);
};
