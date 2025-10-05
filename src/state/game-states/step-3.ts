import { assign } from "xstate";
import { gameSetup } from "../game-setup";
import { getGameTimestamp } from "@/lib/utils";
import { step3CommandContent } from "./command-content";

/**
 * Step 3: Terminal maintenance phase
 * Player receives a system message requiring terminal maintenance.
 * This triggers the investigation phase where the player must run diagnostic commands
 * to check for anomalies, contact Earth Command, and examine AI memories.
 * Transitions to step 4 when the player accesses the terminal.
 */
export const step3 = gameSetup.createStateConfig({
  entry: assign({
    commandContent: () => step3CommandContent,
  }),
  after: {
    1000: {
      actions: assign({
        messages: ({ context }) => [
          ...context.messages,
          {
            id: `terminal-alert-${Date.now()}`,
            from: "SYSTEM",
            timestamp: getGameTimestamp(context.gameStartTimestamp),
            title: "Terminal Maintenance Required",
            preview:
              "Execute system diagnostic commands and check for anomalies, attempt to contact Earth Command and check AI memories.",
            type: "system" as const,
            priority: "normal" as const,
            encrypted: false,
            corrupted: false,
          },
        ],
        viewNotifications: ({ context }) => ({
          ...context.viewNotifications,
          terminal: true,
        }),
      }),
    },
  },
  on: {
    CHANGE_VIEW: {
      guard: ({ event }) => event.view === "terminal",
      actions: assign({
        viewNotifications: ({ context }) => ({
          ...context.viewNotifications,
          terminal: false,
        }),
      }),
      target: "step4",
    },
  },
});
