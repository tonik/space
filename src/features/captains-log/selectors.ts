import { useSelector } from "@xstate/react";
import { useGameActor } from "@/state/context";

export const useCaptainsLogState = () => {
  const { actor } = useGameActor();
  return useSelector(actor, (state) => ({
    captainsLog: state.context.captainsLog,
    objectives: state.context.objectives,
  }));
};
