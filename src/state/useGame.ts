import { createActor } from "xstate";
import { gameMachine, type GameContext } from "./game";
import type { Message, LogEntry, System } from "./types";

// commented out because when we are mutating initial state new keys and changes aren't loaded from localStorage
// const stateString = localStorage.getItem("gameState");

// const gameActor = createActor(gameMachine, {
//   state: stateString ? JSON.parse(stateString) : undefined,
// });

const gameActor = createActor(gameMachine);

gameActor.start();
gameActor.subscribe((state) => {
  localStorage.setItem("gameState", JSON.stringify(state));
});

export const useGame = () => {
  return {
    startGame: (commanderName: string) =>
      gameActor.send({ type: "START_GAME", commanderName }),
    changeView: (view: GameContext["activeView"]) =>
      gameActor.send({ type: "CHANGE_VIEW", view }),
    enterMainApp: () => gameActor.send({ type: "ENTER_MAIN_APP" }),

    addMessage: (message: Message) =>
      gameActor.send({ type: "ADD_MESSAGE", message }),
    openMessage: (messageId: string) =>
      gameActor.send({ type: "MESSAGE_OPENED", messageId }),

    addLog: (log: LogEntry) => gameActor.send({ type: "ADD_LOG", log }),

    trackCommand: (command: string) =>
      gameActor.send({ type: "COMMAND_EXECUTED", command }),

    updateSystemStatus: (
      systemName: keyof GameContext["systems"],
      status: System["status"],
      integrity?: number,
    ) =>
      gameActor.send({
        type: "UPDATE_SYSTEM_STATUS",
        systemName,
        status,
        integrity,
      }),
    updateSystemIntegrity: (
      systemName: keyof GameContext["systems"],
      integrity: number,
    ) =>
      gameActor.send({
        type: "UPDATE_SYSTEM_INTEGRITY",
        systemName,
        integrity,
      }),

    startRepair: (
      systemName: keyof GameContext["systems"],
      repairType: "quick" | "standard" | "thorough",
    ) =>
      gameActor.send({
        type: "START_REPAIR",
        systemName,
        repairType,
      }),

    completeRepair: (systemName: keyof GameContext["systems"]) =>
      gameActor.send({
        type: "COMPLETE_REPAIR",
        systemName,
      }),

    recoverEnergy: (amount?: number) =>
      gameActor.send({
        type: "RECOVER_ENERGY",
        amount,
      }),

    updateDiagnostics: () => gameActor.send({ type: "UPDATE_DIAGNOSTICS" }),

    send: gameActor.send,
  };
};

export { gameActor };
