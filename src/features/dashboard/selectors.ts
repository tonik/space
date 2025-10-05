import { useGameActor } from "@/state/context";
import { useSelector } from "@xstate/react";

export const useDashboardState = () => {
  const { actor } = useGameActor();
  return useSelector(actor, (state) => ({
    systems: state.context.systems,
    diagnostics: state.context.diagnostics,
    mission: state.context.mission,
    repair: state.context.repair,
    aiChat: state.context.aiChat,
  }));
};
