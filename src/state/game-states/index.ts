import { gameSetup } from "../game-setup";
import { intro0 } from "./intro-0";
import { intro1 } from "./intro-1";
import { intro2 } from "./intro-2";

export const gameProgressState = gameSetup.createStateConfig({
  initial: "intro0",
  states: {
    intro0,
    intro1,
    intro2,
  },
});
