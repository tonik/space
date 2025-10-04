import { useSelector } from "@xstate/react";
import { gameActor } from "./useGame";
import { INITIAL_CURRENT_DATE } from "@/lib/utils";

export function useGameDateNow(): Date {
  return useSelector(gameActor, (state) => {
    const stateTimestamp = state.context.gameStartTimestamp;
    const nowTimestamp = Date.now();
    const diff = nowTimestamp - stateTimestamp;
    const gameTimestamp = INITIAL_CURRENT_DATE.getTime();
    return new Date(gameTimestamp + diff);
  });
}

export function useMessagingState() {
  return useSelector(gameActor, (state) => {
    const openedIds = new Set(
      state.context.messageViews.map((v) => v.messageId),
    );
    const unreadCount = state.context.messages.filter(
      (msg) => !openedIds.has(msg.id),
    ).length;

    return {
      systems: state.context.systems,
      messages: state.context.messages,
      messageViews: state.context.messageViews,
      openedMessageIds: openedIds,
      unreadCount,
      recentlyOpenedMessages: state.context.messageViews
        .sort((a, b) => b.openedAt - a.openedAt)
        .slice(0, 10)
        .map((v) => v.messageId),
    };
  });
}
