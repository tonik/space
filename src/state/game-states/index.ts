import { gameSetup } from "../game-setup";
import { intro0 } from "./intro-0";

export const gameProgressState = gameSetup.createStateConfig({
  initial: "intro0",
  states: {
    intro0,
  },
});
