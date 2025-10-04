import { useSelector } from "@xstate/react";
import { gameActor } from "@/state/useGame";

export const useCaptainsLogState = () => {
  return useSelector(gameActor, (state) => ({
    captainsLog: state.context.captainsLog,
  }));
};
