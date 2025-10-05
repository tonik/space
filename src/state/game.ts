import { setup, assign } from "xstate";
import { introMessages } from "../data/messages";
import { introLogs } from "../data/logs";
import type { GameContext, GameEvent, System, SystemMetric } from "./types";
import { INITIAL_CURRENT_DATE } from "@/lib/utils";

function generateSystemMetrics(
  systemName: string,
  status: System["status"],
  integrity: number,
): SystemMetric[] {
  const baseIntegrity = Math.max(0, Math.min(100, integrity));
  const statusMultiplier = getStatusMultiplier(status);
  const adjustedIntegrity = Math.round(baseIntegrity * statusMultiplier);

  switch (systemName) {
    case "communications":
      return [
        {
          label: "Earth Uplink",
          value:
            status === "critical" || status === "offline"
              ? "INACTIVE"
              : "ACTIVE",
        },
        {
          label: "Signal Strength",
          value: `${adjustedIntegrity}%`,
          progress: adjustedIntegrity,
        },
        {
          label: "Last Contact",
          value: new Date(
            INITIAL_CURRENT_DATE.getTime() - 15 * 60 * 1000,
          ).toLocaleString(),
        },
        {
          label: "Encryption",
          value: status === "compromised" ? "COMPROMISED" : "AES-512",
        },
      ];

    case "navigation":
      return [
        {
          label: "Velocity",
          value:
            status === "offline"
              ? "0c"
              : status === "degraded"
                ? "0.4c"
                : "0.8c",
        },
        {
          label: "Heading",
          value: status === "offline" ? "UNKNOWN" : "045° MARK 12",
        },
        {
          label: "ETA to Destination",
          value:
            status === "offline"
              ? "UNKNOWN"
              : status === "degraded"
                ? "28.4 HOURS"
                : "14.2 HOURS",
        },
      ];

    case "lifeSupport": {
      const oxygenStatus =
        status === "critical"
          ? "CRITICAL"
          : status === "degraded"
            ? "LOW"
            : "OPTIMAL";
      const tempValue =
        status === "critical"
          ? "35.2°C"
          : status === "degraded"
            ? "28.1°C"
            : "21.5°C";
      const pressureValue =
        status === "critical"
          ? "87.2 kPa"
          : status === "degraded"
            ? "94.8 kPa"
            : "101.3 kPa";

      return [
        {
          label: "Oxygen Level",
          value: oxygenStatus,
        },
        {
          label: "Temperature",
          value: tempValue,
        },
        {
          label: "Pressure",
          value: pressureValue,
        },
      ];
    }

    case "power": {
      const mainReactor =
        status === "offline"
          ? 0
          : status === "degraded"
            ? Math.round(adjustedIntegrity * 0.7)
            : Math.round(adjustedIntegrity * 0.98);
      const auxiliary =
        status === "offline"
          ? 0
          : status === "degraded"
            ? Math.round(adjustedIntegrity * 0.6)
            : Math.round(adjustedIntegrity * 0.87);

      return [
        {
          label: "Main Reactor",
          value: `${mainReactor}%`,
          progress: mainReactor,
        },
        {
          label: "Auxiliary",
          value: `${auxiliary}%`,
          progress: auxiliary,
        },
      ];
    }

    case "weapons":
      return [
        {
          label: "Nuclear Arsenal",
          value:
            status === "offline"
              ? "OFFLINE"
              : status === "compromised"
                ? "COMPROMISED"
                : "READY",
        },
        {
          label: "Launch Status",
          value:
            status === "offline" || status === "compromised"
              ? "DISABLED"
              : "SAFE",
        },
        {
          label: "Auto-Fire",
          value: "DISABLED",
        },
        {
          label: "24H Countdown",
          value: status === "compromised" ? "ACTIVE" : "INACTIVE",
        },
      ];

    case "aiCore": {
      const processingLoad =
        status === "offline"
          ? 0
          : status === "degraded"
            ? Math.round(adjustedIntegrity * 0.5)
            : Math.round(adjustedIntegrity * 0.73);
      const aiStatus =
        status === "offline"
          ? "OFFLINE"
          : status === "compromised"
            ? "COMPROMISED"
            : status === "degraded"
              ? "DEGRADED"
              : "OPERATIONAL";

      return [
        {
          label: "AI Status",
          value: aiStatus,
        },
        {
          label: "Processing Load",
          value: `${processingLoad}%`,
          progress: processingLoad,
        },
        {
          label: "Neural Network",
          value:
            status === "compromised"
              ? "COMPROMISED"
              : status === "degraded"
                ? "UNSTABLE"
                : "STABLE",
        },
        {
          label: "Last Update",
          value: status === "offline" ? "OFFLINE" : "24H AGO",
        },
      ];
    }

    case "defensive": {
      const shieldStatus =
        status === "offline"
          ? "DISABLED"
          : status === "degraded"
            ? "WEAK"
            : status === "critical"
              ? "FAILING"
              : status === "compromised"
                ? "COMPROMISED"
                : "NOMINAL";
      const shieldIntegrity =
        status === "offline"
          ? 0
          : status === "degraded"
            ? Math.round(adjustedIntegrity * 0.6)
            : status === "critical"
              ? Math.round(adjustedIntegrity * 0.3)
              : status === "compromised"
                ? Math.round(adjustedIntegrity * 0.4)
                : adjustedIntegrity;

      return [
        {
          label: "Shield Status",
          value: shieldStatus,
        },
        {
          label: "Integrity",
          value: `${shieldIntegrity}%`,
          progress: shieldIntegrity,
        },
        {
          label: "Counter Measures",
          value: status === "offline" ? "OFFLINE" : "READY",
        },
      ];
    }

    case "propulsion": {
      const fuelLevel =
        status === "offline"
          ? 0
          : status === "degraded"
            ? Math.round(adjustedIntegrity * 0.6)
            : adjustedIntegrity;
      const thrustOutput =
        status === "offline"
          ? 0
          : status === "degraded"
            ? Math.round(adjustedIntegrity * 0.4)
            : Math.round(adjustedIntegrity * 0.8);

      return [
        {
          label: "Main Engine",
          value:
            status === "offline"
              ? "OFFLINE"
              : status === "degraded"
                ? "DEGRADED"
                : "NOMINAL",
        },
        {
          label: "Fuel Level",
          value: `${fuelLevel}%`,
          progress: fuelLevel,
        },
        {
          label: "Thrust Output",
          value: `${thrustOutput}%`,
          progress: thrustOutput,
        },
      ];
    }

    case "dataSystems": {
      const coreMemory =
        status === "offline"
          ? 0
          : status === "degraded"
            ? Math.round(adjustedIntegrity * 0.4)
            : Math.round(adjustedIntegrity * 0.67);
      const logStorage =
        status === "offline"
          ? 0
          : status === "degraded"
            ? Math.round(adjustedIntegrity * 0.3)
            : Math.round(adjustedIntegrity * 0.45);

      return [
        {
          label: "Core Memory",
          value: `${coreMemory}%`,
          progress: coreMemory,
        },
        {
          label: "Log Storage",
          value: `${logStorage}%`,
          progress: logStorage,
        },
        {
          label: "Backup Status",
          value:
            status === "offline"
              ? "OFFLINE"
              : status === "compromised"
                ? "COMPROMISED"
                : "SYNCED",
        },
      ];
    }

    default:
      return [];
  }
}

function getStatusMultiplier(status: System["status"]): number {
  switch (status) {
    case "online":
      return 1.0;
    case "degraded":
      return 0.7;
    case "jammed":
      return 0.5;
    case "offline":
      return 0.0;
    case "compromised":
      return 0.3;
    case "critical":
      return 0.2;
    default:
      return 1.0;
  }
}

const initialContext: GameContext = {
  commanderName: "Commander",
  gameStartTimestamp: Date.now(),
  activeView: "dashboard",
  showWelcomeScreen: true,

  viewNotifications: {
    dashboard: [],
    messaging: [],
    terminal: [],
    logs: [],
    "captains-log": [],
  },

  // Systems with dynamically generated metrics that are consistent with their status
  systems: {
    communications: {
      integrity: 100,
      status: "online",
      metrics: generateSystemMetrics("communications", "online", 100),
    },
    navigation: {
      integrity: 100,
      status: "online",
      metrics: generateSystemMetrics("navigation", "online", 100),
    },
    lifeSupport: {
      integrity: 100,
      status: "critical",
      metrics: generateSystemMetrics("lifeSupport", "critical", 100),
    },
    power: {
      integrity: 100,
      status: "online",
      metrics: generateSystemMetrics("power", "online", 100),
    },
    weapons: {
      integrity: 100,
      status: "online",
      metrics: generateSystemMetrics("weapons", "online", 100),
    },
    aiCore: {
      integrity: 100,
      status: "online",
      metrics: generateSystemMetrics("aiCore", "online", 100),
    },
    defensive: {
      integrity: 96,
      status: "online",
      metrics: generateSystemMetrics("defensive", "online", 96),
    },
    propulsion: {
      integrity: 84,
      status: "online",
      metrics: generateSystemMetrics("propulsion", "online", 84),
    },
    dataSystems: {
      integrity: 100,
      status: "online",
      metrics: generateSystemMetrics("dataSystems", "online", 100),
    },
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

  aiChat: {
    hasShownInitialMessage: false,
    messages: [
      {
        id: "1",
        role: "ai",
        content:
          "Hello, Captain. I am JASON, your AI assistant. How may I help you today?",
        timestamp: Date.now(),
      },
    ],
  },

  repair: {
    energy: 85, // Start with good energy reserves
    materials: 70, // Moderate material reserves
    maxEnergy: 100, // Maximum energy capacity
    energyRecoveryRate: 2, // 2 energy per minute
    lastEnergyRecovery: Date.now(), // Initialize with current time
    activeRepairs: {},
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
    updateSystemStatus: assign({
      systems: ({ context, event }) => {
        if (event.type === "UPDATE_SYSTEM_STATUS") {
          const system = context.systems[event.systemName];
          const newIntegrity =
            event.integrity !== undefined ? event.integrity : system.integrity;
          const newMetrics = generateSystemMetrics(
            event.systemName,
            event.status,
            newIntegrity,
          );

          return {
            ...context.systems,
            [event.systemName]: {
              ...system,
              status: event.status,
              integrity: newIntegrity,
              metrics: newMetrics,
            },
          };
        }
        return context.systems;
      },
    }),
    updateSystemIntegrity: assign({
      systems: ({ context, event }) => {
        if (event.type === "UPDATE_SYSTEM_INTEGRITY") {
          const system = context.systems[event.systemName];
          const newMetrics = generateSystemMetrics(
            event.systemName,
            system.status,
            event.integrity,
          );

          return {
            ...context.systems,
            [event.systemName]: {
              ...system,
              integrity: event.integrity,
              metrics: newMetrics,
            },
          };
        }
        return context.systems;
      },
    }),
    startRepair: assign({
      repair: ({ context, event }) => {
        if (event.type === "START_REPAIR") {
          const repairId = `${event.systemName}-${Date.now()}`;
          const repairDurations = {
            quick: 5000, // 5 seconds
            standard: 15000, // 15 seconds
            thorough: 30000, // 30 seconds
          };

          const energyCosts = {
            quick: 10,
            standard: 20,
            thorough: 35,
          };

          const materialCosts = {
            quick: 5,
            standard: 15,
            thorough: 25,
          };

          // Check if we have enough resources
          if (
            context.repair.energy < energyCosts[event.repairType] ||
            context.repair.materials < materialCosts[event.repairType]
          ) {
            return context.repair; // Not enough resources
          }

          return {
            ...context.repair,
            energy: Math.max(
              0,
              context.repair.energy - energyCosts[event.repairType],
            ),
            materials: Math.max(
              0,
              context.repair.materials - materialCosts[event.repairType],
            ),
            activeRepairs: {
              ...context.repair.activeRepairs,
              [repairId]: {
                systemName: event.systemName,
                repairType: event.repairType,
                startTime: Date.now(),
                duration: repairDurations[event.repairType],
                progress: 0,
              },
            },
          };
        }
        return context.repair;
      },
      logs: ({ context, event }) => {
        if (event.type === "START_REPAIR") {
          const energyCosts = { quick: 10, standard: 20, thorough: 35 };
          const materialCosts = { quick: 5, standard: 15, thorough: 25 };

          // Check if we have enough resources
          if (
            context.repair.energy < energyCosts[event.repairType] ||
            context.repair.materials < materialCosts[event.repairType]
          ) {
            return [
              ...context.logs,
              {
                id: `repair-failed-${Date.now()}`,
                timestamp: Date.now(),
                level: "WARN" as const,
                system: event.systemName,
                message: `Repair failed: Insufficient resources (need ${energyCosts[event.repairType]} energy, ${materialCosts[event.repairType]} materials)`,
              },
            ];
          }

          return [
            ...context.logs,
            {
              id: `repair-start-${Date.now()}`,
              timestamp: Date.now(),
              level: "INFO" as const,
              system: event.systemName,
              message: `Started ${event.repairType} repair (${energyCosts[event.repairType]} energy, ${materialCosts[event.repairType]} materials consumed)`,
            },
          ];
        }
        return context.logs;
      },
    }),
    completeRepair: assign({
      systems: ({ context, event }) => {
        if (event.type === "COMPLETE_REPAIR") {
          const system = context.systems[event.systemName];
          const repairAmounts = {
            quick: 15,
            standard: 35,
            thorough: 60,
          };

          // Find the active repair for this system
          const activeRepair = Object.values(context.repair.activeRepairs).find(
            (repair) => repair.systemName === event.systemName,
          );

          if (!activeRepair) return context.systems;

          const newIntegrity = Math.min(
            100,
            system.integrity + repairAmounts[activeRepair.repairType],
          );
          const newStatus =
            newIntegrity >= 90
              ? "online"
              : newIntegrity >= 70
                ? "degraded"
                : newIntegrity >= 40
                  ? "critical"
                  : "offline";

          const newMetrics = generateSystemMetrics(
            event.systemName,
            newStatus,
            newIntegrity,
          );

          return {
            ...context.systems,
            [event.systemName]: {
              ...system,
              integrity: newIntegrity,
              status: newStatus,
              metrics: newMetrics,
            },
          };
        }
        return context.systems;
      },
      repair: ({ context, event }) => {
        if (event.type === "COMPLETE_REPAIR") {
          // Remove the completed repair from active repairs
          const newActiveRepairs = { ...context.repair.activeRepairs };
          const repairToRemove = Object.keys(newActiveRepairs).find(
            (key) => newActiveRepairs[key].systemName === event.systemName,
          );

          if (repairToRemove) {
            delete newActiveRepairs[repairToRemove];
          }

          return {
            ...context.repair,
            activeRepairs: newActiveRepairs,
          };
        }
        return context.repair;
      },
      logs: ({ context, event }) => {
        if (event.type === "COMPLETE_REPAIR") {
          const system = context.systems[event.systemName];
          const repairAmounts = { quick: 15, standard: 35, thorough: 60 };

          const activeRepair = Object.values(context.repair.activeRepairs).find(
            (repair) => repair.systemName === event.systemName,
          );

          if (!activeRepair) return context.logs;

          const newIntegrity = Math.min(
            100,
            system.integrity + repairAmounts[activeRepair.repairType],
          );

          return [
            ...context.logs,
            {
              id: `repair-complete-${Date.now()}`,
              timestamp: Date.now(),
              level: "INFO" as const,
              system: event.systemName,
              message: `Repair completed: ${event.systemName} integrity increased to ${newIntegrity}%`,
            },
          ];
        }
        return context.logs;
      },
    }),
    recoverEnergy: assign({
      repair: ({ context, event }) => {
        if (event.type === "RECOVER_ENERGY") {
          const now = Date.now();
          const timeSinceLastRecovery = now - context.repair.lastEnergyRecovery;
          const minutesPassed = timeSinceLastRecovery / (1000 * 60); // Convert to minutes

          // Calculate energy to recover based on time passed
          const energyToRecover =
            event.amount ||
            Math.floor(minutesPassed * context.repair.energyRecoveryRate);

          if (energyToRecover > 0) {
            const newEnergy = Math.min(
              context.repair.maxEnergy,
              context.repair.energy + energyToRecover,
            );

            return {
              ...context.repair,
              energy: newEnergy,
              lastEnergyRecovery: now,
            };
          }
        }
        return context.repair;
      },
      logs: ({ context, event }) => {
        if (event.type === "RECOVER_ENERGY") {
          const now = Date.now();
          const timeSinceLastRecovery = now - context.repair.lastEnergyRecovery;
          const minutesPassed = timeSinceLastRecovery / (1000 * 60);

          const energyToRecover =
            event.amount ||
            Math.floor(minutesPassed * context.repair.energyRecoveryRate);

          if (energyToRecover > 0) {
            const newEnergy = Math.min(
              context.repair.maxEnergy,
              context.repair.energy + energyToRecover,
            );

            return [
              ...context.logs,
              {
                id: `energy-recovery-${Date.now()}`,
                timestamp: now,
                level: "INFO" as const,
                system: "power",
                message: `Energy recovered: +${energyToRecover} energy (${newEnergy}/${context.repair.maxEnergy})`,
              },
            ];
          }
        }
        return context.logs;
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
        viewNotifications: ({ context, event }) => {
          // Clear notifications for the view being switched to
          if (event.view === "captains-log") {
            return {
              ...context.viewNotifications,
              "captains-log": [],
            };
          }
          return context.viewNotifications;
        },
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
