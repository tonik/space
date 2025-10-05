import { assign } from "xstate";
import { gameSetup } from "../game-setup";
import { getGameTimestamp } from "@/lib/utils";
import { step3CommandContent } from "./command-content";

/**
 * First state where captain gets objective and is onboarded.
 * We are moving to the next state when captain will view the objectives (in captains log)
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
