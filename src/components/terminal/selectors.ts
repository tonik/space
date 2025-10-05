import { useSelector } from "@xstate/react";
import { useGameActor } from "@/state/context";

export const useTerminalState = () => {
  const { actor } = useGameActor();
  return useSelector(actor, (state) => ({
    commanderName: state.context.commanderName,
    commandCounts: state.context.commandCounts,
    mission: state.context.mission,
    repair: state.context.repair,
  }));
};
