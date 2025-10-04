import { useSelector } from "@xstate/react";
import { gameActor } from "@/state/useGame";

export const useNavigationState = () => {
  return useSelector(gameActor, (state) => ({
    viewNotifications: state.context.viewNotifications,
    activeView: state.context.activeView,
  }));
};
