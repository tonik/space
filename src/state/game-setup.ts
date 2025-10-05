import { setup, assign } from "xstate";
import type { GameEvent, GameContext } from "./types";
import { generateSystemMetrics } from "./helpers";

export const gameSetup = setup({
  types: {
    context: {} as GameContext,
    events: {} as GameEvent,
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
    addObjective: assign({
      objectives: ({ context, event }) => {
        if (event.type === "ADD_OBJECTIVE") {
          return [...context.objectives, event.objective];
        }
        return context.objectives;
      },
    }),
    updateObjective: assign({
      objectives: ({ context, event }) => {
        if (event.type === "UPDATE_OBJECTIVE") {
          return context.objectives.map((obj) =>
            obj.id === event.objectiveId
              ? { ...obj, status: event.status }
              : obj,
          );
        }
        return context.objectives;
      },
    }),
    completeObjective: assign({
      objectives: ({ context, event }) => {
        if (event.type === "COMPLETE_OBJECTIVE") {
          return context.objectives.map((obj) =>
            obj.id === event.objectiveId
              ? {
                  ...obj,
                  status: "completed" as const,
                  completedAt: Date.now(),
                }
              : obj,
          );
        }
        return context.objectives;
      },
    }),
    showTrueIssues: assign({
      showTrueIssues: () => true,
    }),
  },
});
