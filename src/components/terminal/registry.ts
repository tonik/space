import type { CommandRegistry } from "./types";

import { clearCommand } from "./commands/clear";
import { commsCommand } from "./commands/comms";
import { dateCommand } from "./commands/date";
import { whoamiCommand } from "./commands/whoami";
import { setnameCommand } from "./commands/setname";
import { sleepLogCommand } from "./commands/sleepLog";
import { echoCommand } from "./commands/echo";
import { memoriesCommand } from "./commands/memories";
import { anomaliesCommand } from "./commands/anomalies";
import { overrideCommand } from "./commands/override";
import { createHelpCommand } from "./commands/help";

const baseRegistry: CommandRegistry = {
  clear: clearCommand,
  comms: commsCommand,
  date: dateCommand,
  whoami: whoamiCommand,
  setname: setnameCommand,
  "sleep log": sleepLogCommand,
  echo: echoCommand,
  memories: memoriesCommand,
  anomalies: anomaliesCommand,
  override: overrideCommand,
};

// Add help command with access to registry
export const commandRegistry: CommandRegistry = {
  ...baseRegistry,
  help: createHelpCommand(baseRegistry),
};
