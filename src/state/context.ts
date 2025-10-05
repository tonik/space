import { createActor } from "xstate";
import { gameMachine } from "./game";
import { createContext } from "react";
import type {
  Message,
  LogEntry,
  System,
  GameContext,
  Objective,
} from "./types";
import { useContext } from "react";

export const createState = () => createActor(gameMachine);

export const Context = createContext<{
  actor: ReturnType<typeof createState>;
  saveGameState: () => void;
  loadGameState: (index?: number) => void;
} | null>(null);

export const useGameActor = () => {
  const actor = useContext(Context);
  if (!actor)
    throw new Error("Cannot use useGameActor outside of StateProvider");
  return actor;
};

export const useGame = () => {
  const { actor } = useGameActor();
  return {
    startGame: (commanderName: string) =>
      actor.send({ type: "START_GAME", commanderName }),
    changeView: (view: GameContext["activeView"]) =>
      actor.send({ type: "CHANGE_VIEW", view }),

    addMessage: (message: Message) =>
      actor.send({ type: "ADD_MESSAGE", message }),
    openMessage: (messageId: string) =>
      actor.send({ type: "MESSAGE_OPENED", messageId }),

    addLog: (log: LogEntry) => actor.send({ type: "ADD_LOG", log }),

    trackCommand: (command: string) =>
      actor.send({ type: "COMMAND_EXECUTED", command }),

    updateSystemStatus: (
      systemName: keyof GameContext["systems"],
      status: System["status"],
      integrity?: number,
    ) =>
      actor.send({
        type: "UPDATE_SYSTEM_STATUS",
        systemName,
        status,
        integrity,
      }),
    updateSystemIntegrity: (
      systemName: keyof GameContext["systems"],
      integrity: number,
    ) =>
      actor.send({
        type: "UPDATE_SYSTEM_INTEGRITY",
        systemName,
        integrity,
      }),

    startRepair: (
      systemName: keyof GameContext["systems"],
      repairType: "quick" | "standard" | "thorough",
    ) =>
      actor.send({
        type: "START_REPAIR",
        systemName,
        repairType,
      }),

    completeRepair: (systemName: keyof GameContext["systems"]) =>
      actor.send({
        type: "COMPLETE_REPAIR",
        systemName,
      }),

    recoverEnergy: (amount?: number) =>
      actor.send({
        type: "RECOVER_ENERGY",
        amount,
      }),

    updateDiagnostics: () => actor.send({ type: "UPDATE_DIAGNOSTICS" }),

    markAiChatInitialMessageShown: () =>
      actor.send({ type: "AI_CHAT_INITIAL_MESSAGE_SHOWN" }),

    addAiChatMessage: (message: {
      id: string;
      role: "user" | "ai";
      content: string;
      timestamp: number;
    }) => actor.send({ type: "AI_CHAT_ADD_MESSAGE", message }),

    addObjective: (objective: Objective) =>
      actor.send({ type: "ADD_OBJECTIVE", objective }),

    updateObjective: (objectiveId: string, status: Objective["status"]) =>
      actor.send({
        type: "UPDATE_OBJECTIVE",
        objectiveId,
        status,
      }),

    completeObjective: (objectiveId: string) =>
      actor.send({ type: "COMPLETE_OBJECTIVE", objectiveId }),

    trackDisplayedCommand: (command: string) =>
      actor.send({ type: "COMMAND_DISPLAYED", command }),

    showHiddenFileMessage: () =>
      actor.send({ type: "SHOW_HIDDEN_FILE_MESSAGE" }),

    send: actor.send,
  };
};
