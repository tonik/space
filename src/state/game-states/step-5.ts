import { assign } from "xstate";
import { gameSetup } from "../game-setup";
import { step4CommandContent } from "./command-content";
import { createCommandRegistry } from "@/components/terminal/registries";
import { clearCommand } from "@/components/terminal/commands/clear";
import { whoamiCommand } from "@/components/terminal/commands/whoami";
import { dateCommand } from "@/components/terminal/commands/date";
import { commsCommand } from "@/components/terminal/commands/comms";
import { memoriesCommand } from "@/components/terminal/commands/memories";
import { anomaliesCommand } from "@/components/terminal/commands/anomalies";
import { statusCommand } from "@/components/terminal/commands/status";
import { overwriteCommand } from "@/components/terminal/commands/overwrite";

const step5Registry = createCommandRegistry({
  clear: clearCommand,
  whoami: whoamiCommand,
  date: dateCommand,
  comms: commsCommand,
  memories: memoriesCommand,
  anomalies: anomaliesCommand,
  status: statusCommand,
  overwrite: overwriteCommand,
});

/**
 * Step 5: Transition state after status command
 * The 'overwrite' command becomes available here.
 * After running 'overwrite' command, the true system issues are revealed.
 * Multiple systems are now showing as critical with notification dots.
 * Player needs to investigate and potentially repair the systems.
 */
export const step5 = gameSetup.createStateConfig({
  entry: assign({
    commandContent: () => step4CommandContent,
    availableCommands: () => step5Registry,
  }),
  on: {
    COMMAND_EXECUTED: {
      guard: ({ event }) => event.command === "overwrite",
      actions: assign({
        // Add dashboard notification
        viewNotifications: ({ context }) => ({
          ...context.viewNotifications,
          dashboard: true,
        }),
        // Set 5 systems to critical status to show notification dots
        systems: ({ context }) => {
          const systems = { ...context.systems };

          // Essential systems (3): lifeSupport, communications, and power
          systems.lifeSupport = {
            ...systems.lifeSupport,
            status: "critical" as const,
          };
          systems.communications = {
            ...systems.communications,
            status: "critical" as const,
          };
          systems.power = {
            ...systems.power,
            status: "critical" as const,
          };

          // Random systems (2): weapons and aiCore
          systems.weapons = {
            ...systems.weapons,
            status: "critical" as const,
          };
          systems.aiCore = {
            ...systems.aiCore,
            status: "critical" as const,
          };

          return systems;
        },
      }),
    },
    CHANGE_VIEW: {
      guard: ({ event }) => event.view === "dashboard",
      actions: assign({
        viewNotifications: ({ context }) => ({
          ...context.viewNotifications,
          dashboard: false,
        }),
      }),
    },
  },
});
