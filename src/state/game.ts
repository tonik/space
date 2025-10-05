import { assign } from "xstate";
import { initialContext } from "./initial-context";
import { gameSetup } from "./game-setup";
import { osState } from "./os-state";
import { gameProgressState } from "./game-states";

export const gameMachine = gameSetup.createMachine({
  id: "gameOrchestrator",
  context: initialContext,
  type: "parallel",
  states: {
    osState,
    gameProgressState,
  },
  on: {
    KEYPRESS: {},
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
    SET_AVAILABLE_COMMANDS: {
      actions: assign({
        availableCommands: ({ event }) => event.commands,
      }),
    },
    SET_COMMAND_CONTENT: {
      actions: assign({
        commandContent: ({ event }) => event.content,
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
    ADD_OBJECTIVE: {
      actions: "addObjective",
    },
    UPDATE_OBJECTIVE: {
      actions: "updateObjective",
    },
    COMPLETE_OBJECTIVE: {
      actions: "completeObjective",
    },
    SHOW_TRUE_ISSUES: {
      actions: "showTrueIssues",
    },
  },
});
