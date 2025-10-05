import { useSelector } from "@xstate/react";
import { gameActor } from "@/state/useGame";
import type { AvailableViewKeys } from "@/state/types";

export const useNavigationState = () => {
  return useSelector(gameActor, (state) => ({
    viewNotifications: state.context.viewNotifications,
    activeView: state.context.activeView,
    changeView: (view: AvailableViewKeys) =>
      gameActor.send({ type: "CHANGE_VIEW", view }),
  }));
};
