import type { CommandRegistry } from "./types";

import { clearCommand } from "./commands/clear";
import { commsCommand } from "./commands/comms";
import { dateCommand } from "./commands/date";
import { whoamiCommand } from "./commands/whoami";
import { sleepLogCommand } from "./commands/sleepLog";
import { echoCommand } from "./commands/echo";
import { memoriesCommand } from "./commands/memories";
import { anomaliesCommand } from "./commands/anomalies";
import { overrideCommand } from "./commands/override";
import { createHelpCommand } from "./commands/help";

/**
 * Base command registry with all available commands
 * Use this as the default or as a base to build custom registries
 */
export const commandRegistry: CommandRegistry = {
  clear: clearCommand,
  comms: commsCommand,
  date: dateCommand,
  whoami: whoamiCommand,
  "sleep log": sleepLogCommand,
  echo: echoCommand,
  memories: memoriesCommand,
  anomalies: anomaliesCommand,
  override: overrideCommand,
};

// Add help command with access to registry
commandRegistry.help = createHelpCommand(commandRegistry);

/**
 * Helper function to create a custom command registry
 * @param commands - Object mapping command names to Command objects
 * @returns A complete registry with help command auto-generated
 */
export const createCommandRegistry = (
  commands: Omit<CommandRegistry, "help">,
): CommandRegistry => {
  const registry = { ...commands };
  return {
    ...registry,
    help: createHelpCommand(registry),
  };
};

/**
 * Example: Limited registry for tutorial/intro stage
 * Only basic commands available
 */
export const tutorialCommandRegistry = createCommandRegistry({
  clear: clearCommand,
  whoami: whoamiCommand,
  date: dateCommand,
  echo: echoCommand,
});

/**
 * Example: Emergency scenario registry
 * Commands relevant during crisis situations
 */
export const emergencyCommandRegistry = createCommandRegistry({
  clear: clearCommand,
  whoami: whoamiCommand,
  date: dateCommand,
  comms: commsCommand,
  anomalies: anomaliesCommand,
  override: overrideCommand,
});

/**
 * Example: Full access registry
 * All commands available for normal gameplay
 */
export const fullAccessCommandRegistry = commandRegistry;

/**
 * Example: Post-AI takeover registry
 * Limited commands as AI restricts access
 */
export const restrictedCommandRegistry = createCommandRegistry({
  clear: clearCommand,
  whoami: whoamiCommand,
  echo: echoCommand,
  // Most commands removed - AI has taken control
});
