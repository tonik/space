import { useSelector } from "@xstate/react";
import { INITIAL_CURRENT_DATE } from "@/lib/utils";
import { useGameActor } from "./context";

export function useGameDateNow(): Date {
  const { actor } = useGameActor();
  return useSelector(actor, (state) => {
    const stateTimestamp = state.context.gameStartTimestamp;
    const nowTimestamp = Date.now();
    const diff = nowTimestamp - stateTimestamp;
    const gameTimestamp = INITIAL_CURRENT_DATE.getTime();
    return new Date(gameTimestamp + diff);
  });
}

export function useMessagingState() {
  const { actor } = useGameActor();
  return useSelector(actor, (state) => {
    const openedIds = new Set(
      state.context.messageViews.map((v) => v.messageId),
    );
    const unreadCount = state.context?.messages?.filter?.(
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

export function useDisplayedCommands() {
  const { actor } = useGameActor();
  return useSelector(actor, (state) => ({
    displayedCommands: state.context.displayedCommands,
    hasDisplayedCommand: (command: string) =>
      state.context.displayedCommands.has(command.toLowerCase()),
    displayedCommandsArray: Array.from(state.context.displayedCommands),
    displayedCommandsCount: state.context.displayedCommands.size,
  }));
}
