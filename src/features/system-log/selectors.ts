import { useSelector } from "@xstate/react";
import { gameActor } from "@/state/useGame";

export const useSystemLogState = () => {
  return useSelector(gameActor, (state) => ({
    logs: state.context.logs,
  }));
};
