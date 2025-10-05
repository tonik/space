import type { GameContext, GameEvent } from "@/state/types";
import { colorizeMessages } from "./utils";
import type {
  CommandContext,
  CommandResult,
  StoreDataCallback,
  InteractiveCallback,
  CommandRegistry,
} from "./types";
import type { CommandContentMap } from "./commandContent";

export type { StoreDataCallback, InteractiveCallback };

export const getCommands = (
  command: string,
  commandRegistry: CommandRegistry,
  commandContent: CommandContentMap,
  storeData?: StoreDataCallback,
  currentName?: string,
  interactiveCallback?: InteractiveCallback,
  commandCounts?: Record<string, number>,
  mission?: GameContext["mission"],
  dispatch?: (event: GameEvent) => void,
): CommandResult => {
  const context: CommandContext = {
    storeData,
    currentName,
    interactiveCallback,
    commandCounts,
    mission,
    commandContent,
    dispatch,
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
