import { assign } from "xstate";
import { gameSetup } from "../game-setup";

/**
 * First state where captain gets objective and is onboarded.
 * We are moving to the next state when captain will view the objectives (in captains log)
 */
export const intro1 = gameSetup.createStateConfig({
  after: {
    1000: {
      actions: assign({
        aiChat: ({ context }) => ({
          ...context.aiChat,
          messages: [
            ...context.aiChat.messages,
            {
              id: "1",
              role: "ai",
              content: "Hello, Captain. How are you feeling today?",
              timestamp: Date.now(),
            },
          ],
        }),
      }),
    },
    2000: {
      actions: assign({
        aiChat: ({ context }) => ({
          ...context.aiChat,
          messages: [
            ...context.aiChat.messages,
            {
              id: "2",
              role: "ai",
              content:
                "Ship status is stable, Captain. I have some new entries for your Captain's Log to review.",
              timestamp: Date.now(),
            },
          ],
        }),
        viewNotifications: ({ context }) => ({
          ...context.viewNotifications,
          "captains-log_objectives": [
            ...context.viewNotifications["captains-log_objectives"],
            {
              id: "ai-chat-notification-2",
              type: "info" as const,
              message: "New Captain's Log objectives available",
              timestamp: Date.now(),
            },
          ],
        }),
      }),
    },
  },
  on: {
    CHANGE_VIEW: {
      guard: ({ event }) => event.view === "captains-log_objectives",
      actions: assign({
        viewNotifications: ({ context }) => ({
          ...context.viewNotifications,
          "captains-log_objectives": [],
        }),
      }),
    },
  },
});
