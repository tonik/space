import { gameSetup } from "../game-setup";
import { intro0 } from "./intro-0";
import { intro1 } from "./intro-1";

export const gameProgressState = gameSetup.createStateConfig({
  initial: "intro0",
  states: {
    intro0,
    intro1,
  },
});
