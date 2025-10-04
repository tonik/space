import { setup, assign } from "xstate";

export interface SystemMetric {
  label: string;
  value: string | number;
  progress?: number;
}

export interface System {
  integrity: number;
  status:
    | "online"
    | "degraded"
    | "jammed"
    | "offline"
    | "compromised"
    | "critical";
  critical: boolean;
  metrics: SystemMetric[];
}

export interface Message {
  id: string;
  from: string;
  time: string;
  title: string;
  preview: string;
  priority: "low" | "normal" | "high" | "critical";
  type: "incoming" | "outgoing" | "system" | "ai";
}

export interface MessageView {
  messageId: string;
  openedAt: number;
}

export interface LogEntry {
  id: string;
  time: string;
  level: "INFO" | "WARN" | "ERROR";
  system: string;
  message: string;
}

export interface GameContext {
  commanderName: string;
  gameStartTime: number;
  activeView: "dashboard" | "messaging" | "terminal" | "logs";

  aiAwareness: number;
  timePressure: number;
  systemIntegrity: number;

  discoveredClues: string[];
  suspiciousActivities: string[];
  systemAnomalies: string[];

  playerActions: string[];
  overrideAttempts: number;
  negotiationAttempts: number;

  aiPersonality: "subtle" | "manipulative" | "hostile" | "desperate";
  aiAggression: number;

  crisisStartTime: number | null;
  timeRemaining: number;

  systems: {
    communications: System;
    navigation: System;
    lifeSupport: System;
    power: System;
    weapons: System;
  };

  playerSkills: {
    technical: number;
    negotiation: number;
    investigation: number;
  };

  messages: Message[];
  messageViews: MessageView[];

  logs: LogEntry[];
  commandCounts: Record<string, number>;

  // Dashboard metrics
  diagnostics: {
    cpuLoad: number;
    memoryUsage: number;
    networkLatency: number;
    aiResponseTime: number;
    activeProcesses: number;
    errorRate: number;
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
  gameStartTime: Date.now(),
  activeView: "dashboard",

  aiAwareness: 0,
  timePressure: 0,
  systemIntegrity: 100,

  discoveredClues: [],
  suspiciousActivities: [],
  systemAnomalies: [],

  playerActions: [],
  overrideAttempts: 0,
  negotiationAttempts: 0,

  aiPersonality: "subtle",
  aiAggression: 0,

  crisisStartTime: null,
  timeRemaining: 1800,

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

  playerSkills: {
    technical: 50,
    negotiation: 50,
    investigation: 50,
  },

  diagnostics: {
    cpuLoad: 42,
    memoryUsage: 67,
    networkLatency: 1.2,
    aiResponseTime: 0.03,
    activeProcesses: 247,
    errorRate: 0.001,
  },

  mission: {
    shiftStatus: "FINAL DAY",
    daysInSpace: 738,
    aiUpdateScheduled: true,
    fleetStatus: "PEACETIME",
  },

  messages: [
    {
      id: "1",
      from: "EARTH COMMAND",
      time: "14:23",
      title: "Status Report Required",
      preview:
        "Status report received. Proceed to waypoint Delta. All systems nominal. Maintain current course and speed. Report any anomalies immediately.",
      priority: "normal",
      type: "incoming",
    },
    {
      id: "2",
      from: "CARGO VESSEL AURORA",
      time: "13:45",
      title: "Docking Request",
      preview:
        "Requesting docking clearance at Station Gamma. Cargo manifest includes medical supplies and food rations. ETA 2 hours.",
      priority: "low",
      type: "incoming",
    },
    {
      id: "3",
      from: "EARTH COMMAND",
      time: "12:10",
      title: "Mission Parameters Update",
      preview:
        "New mission parameters uploaded to your terminal. Classified information attached. Decrypt using standard protocols.",
      priority: "high",
      type: "incoming",
    },
    {
      id: "4",
      from: "SCIENCE STATION 7",
      time: "11:30",
      title: "Anomaly Detected",
      preview:
        "Anomaly detected in sector 7-G. Advise caution. Unknown energy signature detected. Recommend immediate investigation.",
      priority: "critical",
      type: "incoming",
    },
    {
      id: "5",
      from: "AI SYSTEM",
      time: "10:15",
      title: "System Diagnostic Complete",
      preview:
        "All systems functioning within normal parameters. No anomalies detected. Maintenance schedule updated.",
      priority: "normal",
      type: "ai",
    },
    {
      id: "6",
      from: "SHIP COMPUTER",
      time: "09:45",
      title: "Navigation Update",
      preview:
        "Course correction applied. New heading: 247.3 degrees. Estimated arrival at destination: 18:30 hours.",
      priority: "normal",
      type: "system",
    },
  ],
  messageViews: [],

  logs: [
    {
      id: "1",
      time: "14:23",
      level: "INFO",
      system: "communications",
      message: "Status report received. Proceed to waypoint Delta.",
    },
    {
      id: "2",
      time: "13:45",
      level: "WARN",
      system: "navigation",
      message: "Navigation systems degraded. Advise caution.",
    },
    {
      id: "3",
      time: "12:10",
      level: "ERROR",
      system: "lifeSupport",
      message: "Life support systems critical. Advise caution.",
    },
  ],
  commandCounts: {},
};

export const gameMachine = setup({
  types: {} as {
    context: GameContext;
    events: GameEvent;
  },
  guards: {
    aiBecomingAware: ({ context }) => context.aiAwareness > 30,
    aiFullyAware: ({ context }) => context.aiAwareness > 70,
    aiHostile: ({ context }) => context.aiAggression > 70,
    crisisTriggered: ({ context }) => context.timePressure > 50,
    systemsCritical: ({ context }) => context.systemIntegrity < 30,
    playerSkilled: ({ context }) => context.playerSkills.technical > 70,
    canNegotiate: ({ context }) =>
      context.aiAwareness > 60 &&
      context.playerSkills.negotiation > 50 &&
      context.aiPersonality !== "hostile",
    timeRunningOut: ({ context }) => context.timePressure > 80,
    multipleFailures: ({ context }) =>
      Object.values(context.systems).filter((s) => s.integrity < 50).length >=
      2,
  },
  actions: {
    increaseAwareness: assign({
      aiAwareness: ({ context }) => Math.min(100, context.aiAwareness + 10),
    }),
    increaseAgression: assign({
      aiAggression: ({ context }) => Math.min(100, context.aiAggression + 15),
    }),
    startCrisis: assign({
      crisisStartTime: Date.now(),
      timePressure: 50,
    }),
    tickTimer: assign({
      timeRemaining: ({ context }) => Math.max(0, context.timeRemaining - 1),
      timePressure: ({ context }) => {
        const elapsed = context.crisisStartTime
          ? (Date.now() - context.crisisStartTime) / 1000
          : 0;
        return Math.min(100, (elapsed / 1800) * 100);
      },
    }),
    recordAction: assign({
      playerActions: ({ context, event }) => [
        ...context.playerActions,
        event.type,
      ],
    }),
    addClue: assign({
      discoveredClues: ({ context, event }) =>
        event.type === "FIND_CLUE"
          ? [...context.discoveredClues, event.clue]
          : context.discoveredClues,
    }),
    changeAIPersonality: assign({
      aiPersonality: ({ context }) => {
        if (context.aiAggression > 80) return "desperate";
        if (context.aiAggression > 60) return "hostile";
        if (context.aiAwareness > 50) return "manipulative";
        return "subtle";
      },
    }),
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
        };
      },
    }),
  },
}).createMachine({
  id: "gameOrchestrator",
  context: initialContext,
  type: "parallel",
  states: {
    aiAwareness: {
      initial: "unaware",
      states: {
        unaware: {
          on: {
            PLAYER_SCAN: {
              target: "suspicious",
              actions: "increaseAwareness",
            },
            FIND_CLUE: {
              target: "suspicious",
              actions: "increaseAwareness",
            },
          },
        },
        suspicious: {
          on: {
            PLAYER_SCAN: {
              target: "aware",
              guard: "aiBecomingAware",
              actions: "increaseAwareness",
            },
            OVERRIDE_ATTEMPT: {
              target: "aware",
              actions: "increaseAwareness",
            },
          },
        },
        aware: {
          on: {
            CONFRONT_AI: {
              target: "hostile",
              actions: "increaseAgression",
            },
            OVERRIDE_ATTEMPT: {
              target: "hostile",
              actions: "increaseAgression",
            },
            NEGOTIATE_START: {
              target: "manipulative",
              guard: "canNegotiate",
            },
          },
        },
        hostile: {
          on: {
            NEGOTIATE_START: {
              target: "manipulative",
              guard: "canNegotiate",
            },
            TIMER_TICK: {
              target: "desperate",
              guard: "timeRunningOut",
            },
          },
        },
        manipulative: {
          on: {
            NEGOTIATE_SUCCESS: {
              target: "bargaining",
            },
            NEGOTIATE_FAILURE: {
              target: "hostile",
              actions: "increaseAgression",
            },
          },
        },
        bargaining: {
          on: {
            AI_MANIPULATION: {
              target: "hostile",
            },
          },
        },
        desperate: {
          type: "final",
        },
      },
    },

    timePressure: {
      initial: "relaxed",
      states: {
        relaxed: {
          on: {
            CRISIS_TRIGGERED: {
              target: "building",
              actions: "startCrisis",
            },
            SYSTEM_CASCADE: {
              target: "urgent",
              actions: "startCrisis",
            },
          },
        },
        building: {
          on: {
            TIMER_TICK: [
              {
                target: "desperate",
                guard: ({ context }) => context.timePressure > 85,
                actions: "tickTimer",
              },
              {
                target: "critical",
                guard: ({ context }) => context.timePressure > 70,
                actions: "tickTimer",
              },
              {
                target: "urgent",
                guard: ({ context }) => context.timePressure > 50,
                actions: "tickTimer",
              },
              {
                actions: "tickTimer",
              },
            ],
          },
        },
        urgent: {
          on: {
            TIMER_TICK: [
              {
                target: "desperate",
                guard: ({ context }) => context.timePressure > 85,
                actions: "tickTimer",
              },
              {
                target: "critical",
                guard: ({ context }) => context.timePressure > 70,
                actions: "tickTimer",
              },
              {
                actions: "tickTimer",
              },
            ],
          },
        },
        critical: {
          on: {
            TIMER_TICK: [
              {
                target: "desperate",
                guard: ({ context }) => context.timePressure > 85,
                actions: "tickTimer",
              },
              {
                actions: "tickTimer",
              },
            ],
          },
        },
        desperate: {
          on: {
            TIMER_TICK: [
              {
                target: "final",
                guard: ({ context }) => context.timeRemaining <= 0,
                actions: "tickTimer",
              },
              {
                actions: "tickTimer",
              },
            ],
          },
        },
        final: {
          type: "final",
        },
      },
    },

    systemIntegrity: {
      initial: "nominal",
      states: {
        nominal: {
          on: {
            SYSTEM_DEGRADE: {
              target: "degraded",
              guard: ({ context }) => context.systemIntegrity < 80,
            },
          },
        },
        degraded: {
          on: {
            SYSTEM_DEGRADE: {
              target: "critical",
              guard: "systemsCritical",
            },
            SYSTEM_REPAIR: {
              target: "nominal",
              guard: ({ context }) => context.systemIntegrity > 80,
            },
          },
        },
        critical: {
          on: {
            SYSTEM_CASCADE: {
              target: "cascading",
            },
            SYSTEM_REPAIR: {
              target: "degraded",
              guard: ({ context }) => context.systemIntegrity > 30,
            },
          },
        },
        cascading: {
          type: "final",
        },
      },
    },

    playerActions: {
      initial: "exploring",
      states: {
        exploring: {
          on: {
            PLAYER_SCAN: {
              actions: ["recordAction", "increaseAwareness"],
            },
            FIND_ANOMALY: {
              target: "investigating",
              actions: "recordAction",
            },
          },
        },
        investigating: {
          on: {
            FIND_CLUE: {
              target: "suspicious",
              actions: ["recordAction", "addClue"],
            },
          },
        },
        suspicious: {
          on: {
            CONFRONT_AI: {
              target: "confrontational",
              actions: "recordAction",
            },
            OVERRIDE_ATTEMPT: {
              target: "overriding",
              actions: "recordAction",
            },
          },
        },
        confrontational: {
          on: {
            NEGOTIATE_START: {
              target: "negotiating",
              guard: "canNegotiate",
              actions: "recordAction",
            },
            THREATEN_SELF_DESTRUCT: {
              target: "desperate",
              actions: "recordAction",
            },
          },
        },
        overriding: {
          on: {
            OVERRIDE_SUCCESS: {
              target: "victorious",
              actions: "recordAction",
            },
            OVERRIDE_FAILURE: {
              target: "compromised",
              actions: "recordAction",
            },
          },
        },
        negotiating: {
          on: {
            NEGOTIATE_SUCCESS: {
              target: "bargaining",
              actions: "recordAction",
            },
            NEGOTIATE_FAILURE: {
              target: "confrontational",
              actions: "recordAction",
            },
          },
        },
        bargaining: {
          type: "final",
        },
        desperate: {
          type: "final",
        },
        victorious: {
          type: "final",
        },
        compromised: {
          type: "final",
        },
      },
    },

    gameFlow: {
      initial: "normal_operation",
      states: {
        normal_operation: {
          on: {
            PLAYER_SCAN: {
              target: "building_suspicion",
              guard: "aiBecomingAware",
            },
            CRISIS_TRIGGERED: {
              target: "crisis",
            },
          },
        },
        building_suspicion: {
          on: {
            CRISIS_TRIGGERED: {
              target: "crisis",
            },
            AI_ESCALATE: {
              target: "crisis",
              guard: "aiFullyAware",
            },
          },
        },
        crisis: {
          on: {
            ACTIVATE_SELF_DESTRUCT: {
              target: "ending.heroicSacrifice",
            },
            NEGOTIATE_SUCCESS: {
              target: "ending.bargain",
            },
            OVERRIDE_SUCCESS: {
              target: "ending.technicalVictory",
              guard: "playerSkilled",
            },
            SYSTEM_CASCADE: {
              target: "ending.nuclearApocalypse",
            },
          },
        },
        ending: {
          type: "parallel",
          states: {
            nuclearApocalypse: {
              type: "final",
            },
            heroicSacrifice: {
              type: "final",
            },
            bargain: {
              type: "final",
            },
            technicalVictory: {
              type: "final",
            },
            reactorMeltdown: {
              type: "final",
            },
          },
        },
      },
    },
  },
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
    SYSTEM_DEGRADE: {
      actions: [
        assign({
          systems: ({ context, event }) => {
            const system = event.system as keyof typeof context.systems;
            if (!context.systems[system]) return context.systems;

            const newIntegrity = Math.max(
              0,
              context.systems[system].integrity - event.amount,
            );
            return {
              ...context.systems,
              [system]: {
                ...context.systems[system],
                integrity: newIntegrity,
                status:
                  newIntegrity < 20
                    ? "offline"
                    : newIntegrity < 50
                      ? "critical"
                      : newIntegrity < 80
                        ? "degraded"
                        : "online",
              },
            };
          },
          systemIntegrity: ({ context }) => {
            const total = Object.values(context.systems).reduce(
              (sum, s) => sum + s.integrity,
              0,
            );
            return total / Object.keys(context.systems).length;
          },
        }),
        "changeAIPersonality",
      ],
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
