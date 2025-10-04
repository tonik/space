import { useSelector } from "@xstate/react";
import { gameActor } from "@/state/useGame";

export const useTerminalState = () => {
  return useSelector(gameActor, (state) => ({
    commanderName: state.context.commanderName,
    commandCounts: state.context.commandCounts,
    mission: state.context.mission,
    repair: state.context.repair,
  }));
};
