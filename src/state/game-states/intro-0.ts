import { assign } from "xstate";
import { gameSetup } from "../game-setup";

/**
 * First state where captain gets objective and is onboarded.
 * We are moving to the next state when captain will view the objectives (in captains log)
 */
export const intro0 = gameSetup.createStateConfig({
  on: {
    CHANGE_VIEW: {
      actions: assign({}),
    },
  },
});
