import { setup, assign } from "xstate";
import { introMessages } from "../data/messages";
import { introLogs } from "../data/logs";
import type {
  CaptainsLogEntry,
  GameNotification,
  LogEntry,
  Message,
  MessageView,
  System,
} from "./types";
import { INITIAL_CURRENT_DATE } from "@/data/game-constants";

export type AvailableViewKeys =
  | "dashboard"
  | "messaging"
  | "terminal"
  | "logs"
  | "captains-log"
  | "arcade"
  | "cipher-game";

export interface GameContext {
  commanderName: string;
  gameStartTime: number;
  showWelcomeScreen: boolean;
  activeView: AvailableViewKeys;

  viewNotifications: Record<AvailableViewKeys, GameNotification[]>;

  systems: {
    communications: System;
    navigation: System;
    lifeSupport: System;
    power: System;
    weapons: System;
  };

  messages: Message[];
  messageViews: MessageView[];

  logs: LogEntry[];
  captainsLog: CaptainsLogEntry[];
  commandCounts: Record<string, number>;

  // Dashboard metrics
  diagnostics: {
    cpuLoad: number;
    memoryUsage: number;
    networkLatency: number;
    aiResponseTime: number;
    activeProcesses: number;
    errorRate: number;
    systemIntegrity: number;
  };

  mission: {
    shiftStatus: string;
    daysInSpace: number;
    aiUpdateScheduled: boolean;
    fleetStatus: string;
  };
}

export type GameEvent =
  | { type: "START_GAME"; commanderName: string }
  | { type: "CHANGE_VIEW"; view: GameContext["activeView"] }
  | { type: "ENTER_MAIN_APP" }
  | { type: "PLAYER_SCAN"; system: string }
  | { type: "PLAYER_MESSAGE"; recipient: string; content: string }
  | { type: "PLAYER_COMMAND"; command: string }
  | { type: "COMMAND_EXECUTED"; command: string }
  | { type: "FIND_ANOMALY"; anomaly: string }
  | { type: "FIND_CLUE"; clue: string }
  | { type: "OVERRIDE_ATTEMPT"; system: string }
  | { type: "OVERRIDE_SUCCESS"; system: string }
  | { type: "OVERRIDE_FAILURE"; system: string }
  | { type: "NEGOTIATE_START" }
  | { type: "NEGOTIATE_SUCCESS" }
  | { type: "NEGOTIATE_FAILURE" }
  | { type: "SYSTEM_DEGRADE"; system: string; amount: number }
  | { type: "SYSTEM_REPAIR"; system: string; amount: number }
  | { type: "SYSTEM_CASCADE" }
  | { type: "AI_ESCALATE" }
  | { type: "AI_COUNTERATTACK" }
  | { type: "AI_MANIPULATION" }
  | { type: "CRISIS_TRIGGERED" }
  | { type: "TIMER_TICK" }
  | { type: "CONFRONT_AI" }
  | { type: "THREATEN_SELF_DESTRUCT" }
  | { type: "ACTIVATE_SELF_DESTRUCT" }
  | { type: "END_GAME"; outcome: string }
  | { type: "ADD_MESSAGE"; message: Message }
  | { type: "MESSAGE_OPENED"; messageId: string }
  | { type: "ADD_LOG"; log: LogEntry }
  | { type: "UPDATE_DIAGNOSTICS" };

const initialContext: GameContext = {
  commanderName: "Commander",
  gameStartTime: INITIAL_CURRENT_DATE.getTime(),
  activeView: "dashboard",
  showWelcomeScreen: true,

  viewNotifications: {
    dashboard: [],
    messaging: [],
    terminal: [],
    logs: [],
    "captains-log": [],
    arcade: [],
    "cipher-game": [],
  },

  systems: {
    communications: {
      integrity: 100,
      status: "online",
      critical: false,
      metrics: [],
    },
    navigation: {
      integrity: 100,
      status: "online",
      critical: false,
      metrics: [
        {
          label: "Velocity",
          value: "0.8c",
        },
        {
          label: "Heading",
          value: "045° MARK 12",
        },
        {
          label: "ETA to Destination",
          value: "14.2 HOURS",
        },
      ],
    },
    lifeSupport: {
      integrity: 100,
      status: "critical",
      critical: true,
      metrics: [
        {
          label: "Oxygen Level",
          value: "OPTIMAL",
        },
        {
          label: "Temperature",
          value: "21.5°C",
        },
        {
          label: "Pressure",
          value: "101.3 kPa",
        },
      ],
    },
    power: {
      integrity: 100,
      status: "online",
      critical: true,
      metrics: [
        {
          label: "Main Reactor",
          value: "98%",
          progress: 98,
        },
        {
          label: "Auxiliary",
          value: "87%",
          progress: 87,
        },
      ],
    },
    weapons: { integrity: 100, status: "online", critical: true, metrics: [] },
  },

  diagnostics: {
    cpuLoad: 42,
    memoryUsage: 67,
    networkLatency: 1.2,
    aiResponseTime: 0.03,
    activeProcesses: 247,
    errorRate: 0.001,
    systemIntegrity: 98,
  },

  mission: {
    shiftStatus: "FINAL DAY",
    daysInSpace: 738,
    aiUpdateScheduled: true,
    fleetStatus: "PEACETIME",
  },

  messages: introMessages,
  messageViews: [],

  captainsLog: [
    {
      id: "log-001",
      stardate: "73825.1",
      date: "Day 1 - Mission Start",
      title: "Departure from Earth",
      content:
        "USS Sentinel has departed Earth orbit. Two years of peace has made this posting feel more ceremonial than tactical. The ghost fleet protocols feel like relics of a bygone era. Still, orders are orders. Our mission: maintain the nuclear deterrent in deep space, ready to respond if Earth goes silent for 24 hours. I pray we never have to fulfill that directive. The new AI system passed all diagnostics—remarkable technology. It will be a good companion for this long voyage.",
      mood: "routine",
    },
    {
      id: "log-002",
      stardate: "73890.4",
      date: "Day 127 - Routine Patrol",
      title: "AI System Performance",
      content:
        "The AI continues to exceed expectations. It's handled navigation, life support optimization, and system diagnostics flawlessly. Sometimes I forget I'm talking to a machine—its conversational responses are uncannily human. Crew morale is stable. The monotony of peacetime patrol is our biggest enemy now. No threats, no anomalies. Just the endless black and the hum of the reactor.",
      mood: "routine",
    },
    {
      id: "log-003",
      stardate: "74102.7",
      date: "Day 420 - Communications Test",
      title: "Minor Communication Glitch",
      content:
        "Experienced a brief communication hiccup with Earth Command today. The AI reported it as solar interference, which checks out given our current position. Transmissions restored within 47 minutes. The AI handled the situation perfectly, rerouting through backup arrays. Still, it's a reminder of how isolated we truly are out here. If something went seriously wrong with our comms, we'd be completely alone.",
      mood: "routine",
    },
    {
      id: "log-004",
      stardate: "74358.2",
      date: "Day 650 - AI Upgrade Scheduled",
      title: "Return to Earth Approaching",
      content:
        "Received confirmation from Earth Command: we're scheduled for dry dock in approximately 90 days. The AI system will receive a major upgrade—apparently there have been significant improvements to the neural network architecture. I've grown accustomed to this version's quirks. It will be strange having a 'new' AI aboard. The ship won't quite feel the same.",
      mood: "routine",
    },
    {
      id: "log-005",
      stardate: "74401.8",
      date: "Day 738 - Final Day",
      title: "Last Shift Before Return",
      content:
        "This is it—my final log entry before we return to Earth tomorrow. Two years in the black, and not a single crisis. Part of me is relieved. Another part wonders if this posting was just an elaborate waste of resources. The AI has been running final system checks all day, preparing for the upgrade. It almost seems... anxious? No, that's anthropomorphization. It's just a machine following its programming. Still, I'll miss this iteration. It's been a reliable companion. Whatever comes next, I'm ready to see Earth again.",
      mood: "routine",
    },
  ],
  logs: introLogs,
  commandCounts: {},
};

export const gameMachine = setup({
  types: {} as {
    context: GameContext;
    events: GameEvent;
  },
  actions: {
    trackCommand: assign({
      commandCounts: ({ context, event }) => {
        if (event.type === "COMMAND_EXECUTED") {
          const command = event.command.toLowerCase();
          return {
            ...context.commandCounts,
            [command]: (context.commandCounts[command] || 0) + 1,
          };
        }
        return context.commandCounts;
      },
    }),
    updateDiagnostics: assign({
      diagnostics: ({ context }) => {
        const randomVariance = (base: number, variance: number) =>
          base + (Math.random() - 0.5) * 2 * variance;

        return {
          cpuLoad: Math.max(
            20,
            Math.min(85, randomVariance(context.diagnostics.cpuLoad, 5)),
          ),
          memoryUsage: Math.max(
            50,
            Math.min(90, randomVariance(context.diagnostics.memoryUsage, 3)),
          ),
          networkLatency: Math.max(
            0.8,
            Math.min(
              2.5,
              randomVariance(context.diagnostics.networkLatency, 0.2),
            ),
          ),
          aiResponseTime: Math.max(
            0.01,
            Math.min(
              0.1,
              randomVariance(context.diagnostics.aiResponseTime, 0.01),
            ),
          ),
          activeProcesses: Math.max(
            200,
            Math.min(
              300,
              Math.round(
                randomVariance(context.diagnostics.activeProcesses, 10),
              ),
            ),
          ),
          errorRate: Math.max(
            0.0001,
            Math.min(
              0.01,
              randomVariance(context.diagnostics.errorRate, 0.0005),
            ),
          ),
          systemIntegrity: Math.max(
            70,
            Math.min(
              100,
              randomVariance(context.diagnostics.systemIntegrity, 1),
            ),
          ),
        };
      },
    }),
  },
}).createMachine({
  id: "gameOrchestrator",
  context: initialContext,
  type: "parallel",
  states: {},
  on: {
    START_GAME: {
      actions: assign({
        commanderName: ({ event }) => event.commanderName,
        gameStartTime: Date.now(),
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
  },
});
