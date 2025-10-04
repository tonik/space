import { useSelector } from "@xstate/react";
import { gameActor } from "@/state/useGame";

export const useDashboardState = () => {
  return useSelector(gameActor, (state) => ({
    systems: state.context.systems,
    diagnostics: state.context.diagnostics,
    mission: state.context.mission,
    repair: state.context.repair,
    aiChat: state.context.aiChat,
  }));
};
