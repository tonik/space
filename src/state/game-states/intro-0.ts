import { assign } from "xstate";
import { gameSetup } from "../game-setup";

/**
 * State where user can close a system load
 */
export const intro0 = gameSetup.createStateConfig({
  on: {
    FINISHED_INTRO_SEQUENCE: {
      actions: assign({
        welcomeScreen: ({ context }) => ({
          ...context.welcomeScreen,
          finishedAnimating: true,
        }),
      }),
    },
    KEYPRESS: {
      guard: ({ event, context }) =>
        context.welcomeScreen.finishedAnimating &&
        event.message.key === "Enter",
      actions: "hideWelcomeScreen",
      target: "intro1",
    },
  },
});
