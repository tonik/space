import { assign } from "xstate";
import { gameSetup } from "../game-setup";
import { step4CommandContent } from "./command-content";

/**
 * First state where captain gets objective and is onboarded.
 * We are moving to the next state when captain will view the objectives (in captains log)
 */
export const step4 = gameSetup.createStateConfig({
  entry: assign({
    commandContent: () => step4CommandContent,
  }),
  on: {
    EXECUTE_COMMAND: {},
  },
});
