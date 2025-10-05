import { gameSetup } from "../game-setup";
import { step0 } from "./step-0";
import { step1 } from "./step-1";
import { step2 } from "./step-2";
import { step3 } from "./step-3";

export const gameProgressState = gameSetup.createStateConfig({
  initial: "step0",
  states: {
    step0,
    step1,
    step2,
    step3,
  },
});
