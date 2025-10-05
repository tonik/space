import { useSelector } from "@xstate/react";
import type { AvailableViewKeys } from "@/state/types";
import { useGameActor } from "@/state/context";

export const useNavigationState = () => {
  const { actor } = useGameActor();
  return useSelector(actor, (state) => ({
    viewNotifications: state.context.viewNotifications,
    activeView: state.context.activeView,
    changeView: (view: AvailableViewKeys) =>
      actor.send({ type: "CHANGE_VIEW", view }),
  }));
};
