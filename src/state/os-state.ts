import { assign } from "xstate";
import { gameSetup } from "./game-setup";

export const osState = gameSetup.createStateConfig({
  on: {
    START_GAME: {
      actions: assign({
        commanderName: ({ event }) => event.commanderName,
      }),
    },
    CHANGE_VIEW: {
      actions: assign({
        activeView: ({ event }) => event.view,
      }),
    },
    ENTER_MAIN_APP: {
      actions: assign({
        showWelcomeScreen: () => false,
      }),
    },
    ADD_MESSAGE: {
      actions: assign({
        messages: ({ context, event }) => [...context.messages, event.message],
      }),
    },
    MESSAGE_OPENED: {
      actions: assign({
        messageViews: ({ context, event }) => [
          ...context.messageViews,
          { messageId: event.messageId, openedAt: Date.now() },
        ],
      }),
    },
    ADD_LOG: {
      actions: assign({
        logs: ({ context, event }) => [...context.logs, event.log],
      }),
    },
    COMMAND_EXECUTED: {
      actions: "trackCommand",
    },
    UPDATE_DIAGNOSTICS: {
      actions: "updateDiagnostics",
    },
    UPDATE_SYSTEM_STATUS: {
      actions: "updateSystemStatus",
    },
    UPDATE_SYSTEM_INTEGRITY: {
      actions: "updateSystemIntegrity",
    },
    START_REPAIR: {
      actions: "startRepair",
    },
    COMPLETE_REPAIR: {
      actions: "completeRepair",
    },
    RECOVER_ENERGY: {
      actions: "recoverEnergy",
    },
    AI_CHAT_INITIAL_MESSAGE_SHOWN: {
      actions: assign({
        aiChat: ({ context }) => ({
          ...context.aiChat,
          hasShownInitialMessage: true,
        }),
        viewNotifications: ({ context }) => ({
          ...context.viewNotifications,
          "captains-log": [
            ...context.viewNotifications["captains-log"],
            {
              id: `ai-chat-notification-${Date.now()}`,
              type: "info" as const,
              message: "New Captain's Log entries available",
              timestamp: Date.now(),
            },
          ],
        }),
      }),
    },
    AI_CHAT_ADD_MESSAGE: {
      actions: assign({
        aiChat: ({ context, event }) => ({
          ...context.aiChat,
          messages: [...context.aiChat.messages, event.message],
        }),
      }),
    },
  },
});
