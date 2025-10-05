import { assign } from "xstate";
import { gameSetup } from "../game-setup";
import { nanoid } from "nanoid";
import { set, subDays } from "date-fns";
import { INITIAL_CURRENT_DATE } from "@/lib";

/**
 * First state where captain gets objective and is onboarded.
 * We are moving to the next state when captain will view the objectives (in captains log)
 */
export const intro2 = gameSetup.createStateConfig({
  after: {
    1000: {
      actions: assign({
        messages: ({ context }) => [
          ...context.messages,
          {
            id: nanoid(),
            from: "EARTH BASE COMMAND",
            timestamp: set(subDays(INITIAL_CURRENT_DATE, 1), {
              hours: 10,
              minutes: 13,
              seconds: 0,
            }).getTime(),
            title: "Dry Dock Authorization",
            preview:
              "Dry dock ticket minted for USS Ghost Fleet destroyer. Scheduled maintenance includes AI system upgrade, memory cleaning, hull repairs, and weapons system calibration. Dock at Earth Base by 1200 hours.",
            type: "incoming",
            priority: "high",
            encrypted: false,
            corrupted: false,
          },
        ],
      }),
    },
  },
  on: {
    CHANGE_VIEW: {
      guard: ({ event }) => event.view === "communications",
      actions: assign({
        viewNotifications: ({ context }) => ({
          ...context.viewNotifications,
          messaging: true,
        }),
      }),
    },
  },
});
