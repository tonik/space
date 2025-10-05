import { setup } from "xstate";
import type { GameEvent, GameContext } from "./types";

export const gameSetup = setup({
  types: {
    context: {} as GameContext,
    events: {} as GameEvent,
  },
});
