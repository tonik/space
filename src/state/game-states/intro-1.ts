import { assign } from "xstate";
import { gameSetup } from "../game-setup";

/**
 * First state where captain gets objective and is onboarded.
 * We are moving to the next state when captain will view the objectives (in captains log)
 */
export const intro1 = gameSetup.createStateConfig({
  entry: () => {
    setTimeout(() => {}, 1000);
  },
  on: {
    CHANGE_VIEW: {
      guard: ({ event }) => event.view === "captains-log_objectives",
      actions: assign({
        viewNotifications: ({ context }) => ({
          ...context.viewNotifications,
          "captains-log_objectives": [],
        }),
      }),
    },
  },
});
