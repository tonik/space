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
    COMMAND_EXECUTED: [
      {
        guard: ({ event }) => event.command === "anomalies",
        actions: assign({
          objectives: ({ context }) =>
            context.objectives.map((obj) =>
              obj.id === "obj-003" ? { ...obj, status: "completed" } : obj,
            ),
        }),
      },
      {
        guard: ({ event }) => event.command === "comms",
        actions: assign({
          objectives: ({ context }) =>
            context.objectives.map((obj) =>
              obj.id === "obj-004" ? { ...obj, status: "completed" } : obj,
            ),
        }),
      },
      {
        guard: ({ event }) => event.command === "memories",
        actions: assign({
          objectives: ({ context }) =>
            context.objectives.map((obj) =>
              obj.id === "obj-005" ? { ...obj, status: "completed" } : obj,
            ),
        }),
      },
    ],
  },
});
