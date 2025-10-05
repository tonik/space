import { assign } from "xstate";
import { gameSetup } from "../game-setup";
import { step0CommandContent } from "./command-content";

/**
 * State where user can close a system load
 */
export const step0 = gameSetup.createStateConfig({
  entry: assign({
    commandContent: () => step0CommandContent,
  }),
  initial: "initial",
  states: {
    initial: {
      on: {
        FINISHED_INTRO_SEQUENCE: {
          target: "finishedAnimating",
        },
      },
    },
    finishedAnimating: {
      on: {
        KEYPRESS: {
          guard: ({ event }) => event.message.key === "Enter",
          target: "hidingWelcomeScreen",
        },
      },
    },
    hidingWelcomeScreen: {
      after: {
        1000: {
          target: "closed",
        },
      },
    },
    closed: {
      type: "final",
    },
  },
  onDone: { target: "step1" },
});
