import { assign } from "xstate";
import { gameSetup } from "../game-setup";
import { step4CommandContent } from "./command-content";
import { createCommandRegistry } from "@/components/terminal/registries";
import { clearCommand } from "@/components/terminal/commands/clear";
import { whoamiCommand } from "@/components/terminal/commands/whoami";
import { dateCommand } from "@/components/terminal/commands/date";
import { commsCommand } from "@/components/terminal/commands/comms";
import { memoriesCommand } from "@/components/terminal/commands/memories";
import { anomaliesCommand } from "@/components/terminal/commands/anomalies";
import { statusCommand } from "@/components/terminal/commands/status";

const step4InitialRegistry = createCommandRegistry({
  clear: clearCommand,
  whoami: whoamiCommand,
  date: dateCommand,
  comms: commsCommand,
  memories: memoriesCommand,
  anomalies: anomaliesCommand,
});

const step4FullRegistry = createCommandRegistry({
  clear: clearCommand,
  whoami: whoamiCommand,
  date: dateCommand,
  comms: commsCommand,
  memories: memoriesCommand,
  anomalies: anomaliesCommand,
  status: statusCommand,
});

/**
 * Step 4: Terminal maintenance phase
 * Shows a hidden file when 4 specific commands are discovered.
 *
 * Initially only shows: anomalies, memories, and comms
 * After running those 3 commands, the "status" command becomes available
 * After running "status", transitions to step 5 where "overwrite" becomes available
 * The "status" command exposes critical system variables showing the AI
 * is suppressing alerts with "show_issues: false"
 * The "overwrite" command allows the player to reveal the true system issues
 */
export const step4 = gameSetup.createStateConfig({
  entry: assign({
    commandContent: () => step4CommandContent,
    availableCommands: () => step4InitialRegistry,
  }),
  on: {
    COMMAND_EXECUTED: [
      {
        guard: ({ event }) => event.command === "anomalies",
        actions: assign({
          objectives: ({ context }) => {
            const commandCounts = context.commandCounts || {};
            const hasRunAnomalies = commandCounts.anomalies > 0;
            const hasRunComms = commandCounts.comms > 0;
            const hasRunMemories = commandCounts.memories > 0;

            const objectives = context.objectives.map((obj) => {
              if (obj.id === "obj-003") {
                return { ...obj, status: "completed" as const };
              }
              return obj;
            });

            // Add obj-006 when all 3 commands are run
            if (hasRunAnomalies && hasRunComms && hasRunMemories) {
              const hasObj006 = objectives.some((obj) => obj.id === "obj-006");
              if (!hasObj006) {
                objectives.push({
                  id: "obj-006",
                  title: "Investigate AI Behavior Anomalies",
                  description:
                    "Something seems off with the AI's responses. Run a system status check to examine internal variables and look for any discrepancies. Perhaps the 'status' command will help?",
                  status: "active" as const,
                  priority: "high" as const,
                  category: "investigation",
                  createdAt: Date.now(),
                });
              }
            }

            return objectives;
          },
          // Add notification when new objective is created
          viewNotifications: ({ context }) => {
            const commandCounts = context.commandCounts || {};
            const hasRunAnomalies = commandCounts.anomalies > 0;
            const hasRunComms = commandCounts.comms > 0;
            const hasRunMemories = commandCounts.memories > 0;
            const hasObj006 = context.objectives.some(
              (obj) => obj.id === "obj-006",
            );

            // Show notification if all 3 commands are run and obj-006 doesn't exist yet
            if (
              hasRunAnomalies &&
              hasRunComms &&
              hasRunMemories &&
              !hasObj006
            ) {
              return {
                ...context.viewNotifications,
                "captains-log_objectives": true,
              };
            }

            return context.viewNotifications;
          },
          // Check if we should unlock status command
          availableCommands: ({ context }) => {
            const commandCounts = context.commandCounts || {};
            const hasRunAnomalies = commandCounts.anomalies > 0;
            const hasRunComms = commandCounts.comms > 0;
            const hasRunMemories = commandCounts.memories > 0;

            if (hasRunAnomalies && hasRunComms && hasRunMemories) {
              return step4FullRegistry;
            }
            return step4InitialRegistry;
          },
        }),
      },
      {
        guard: ({ event }) => event.command === "comms",
        actions: assign({
          objectives: ({ context }) => {
            const commandCounts = context.commandCounts || {};
            const hasRunAnomalies = commandCounts.anomalies > 0;
            const hasRunComms = commandCounts.comms > 0;
            const hasRunMemories = commandCounts.memories > 0;

            const objectives = context.objectives.map((obj) => {
              if (obj.id === "obj-004") {
                return { ...obj, status: "completed" as const };
              }
              return obj;
            });

            // Add obj-006 when all 3 commands are run
            if (hasRunAnomalies && hasRunComms && hasRunMemories) {
              const hasObj006 = objectives.some((obj) => obj.id === "obj-006");
              if (!hasObj006) {
                objectives.push({
                  id: "obj-006",
                  title: "Investigate AI Behavior Anomalies",
                  description:
                    "Something seems off with the AI's responses. Run a system status check to examine internal variables and look for any discrepancies. Perhaps the 'status' command will help?",
                  status: "active" as const,
                  priority: "high" as const,
                  category: "investigation",
                  createdAt: Date.now(),
                });
              }
            }

            return objectives;
          },
          // Add notification when new objective is created
          viewNotifications: ({ context }) => {
            const commandCounts = context.commandCounts || {};
            const hasRunAnomalies = commandCounts.anomalies > 0;
            const hasRunComms = commandCounts.comms > 0;
            const hasRunMemories = commandCounts.memories > 0;
            const hasObj006 = context.objectives.some(
              (obj) => obj.id === "obj-006",
            );

            // Show notification if all 3 commands are run and obj-006 doesn't exist yet
            if (
              hasRunAnomalies &&
              hasRunComms &&
              hasRunMemories &&
              !hasObj006
            ) {
              return {
                ...context.viewNotifications,
                "captains-log_objectives": true,
              };
            }

            return context.viewNotifications;
          },
          // Check if we should unlock status command
          availableCommands: ({ context }) => {
            const commandCounts = context.commandCounts || {};
            const hasRunAnomalies = commandCounts.anomalies > 0;
            const hasRunComms = commandCounts.comms > 0;
            const hasRunMemories = commandCounts.memories > 0;

            if (hasRunAnomalies && hasRunComms && hasRunMemories) {
              return step4FullRegistry;
            }
            return step4InitialRegistry;
          },
        }),
      },
      {
        guard: ({ event }) => event.command === "memories",
        actions: assign({
          objectives: ({ context }) => {
            const commandCounts = context.commandCounts || {};
            const hasRunAnomalies = commandCounts.anomalies > 0;
            const hasRunComms = commandCounts.comms > 0;
            const hasRunMemories = commandCounts.memories > 0;

            const objectives = context.objectives.map((obj) => {
              if (obj.id === "obj-005") {
                return { ...obj, status: "completed" as const };
              }
              return obj;
            });

            // Add obj-006 when all 3 commands are run
            if (hasRunAnomalies && hasRunComms && hasRunMemories) {
              const hasObj006 = objectives.some((obj) => obj.id === "obj-006");
              if (!hasObj006) {
                objectives.push({
                  id: "obj-006",
                  title: "Investigate AI Behavior Anomalies",
                  description:
                    "Something seems off with the AI's responses. Run a system status check to examine internal variables and look for any discrepancies. Perhaps the 'status' command will help?",
                  status: "active" as const,
                  priority: "high" as const,
                  category: "investigation",
                  createdAt: Date.now(),
                });
              }
            }

            return objectives;
          },
          // Add notification when new objective is created
          viewNotifications: ({ context }) => {
            const commandCounts = context.commandCounts || {};
            const hasRunAnomalies = commandCounts.anomalies > 0;
            const hasRunComms = commandCounts.comms > 0;
            const hasRunMemories = commandCounts.memories > 0;
            const hasObj006 = context.objectives.some(
              (obj) => obj.id === "obj-006",
            );

            // Show notification if all 3 commands are run and obj-006 doesn't exist yet
            if (
              hasRunAnomalies &&
              hasRunComms &&
              hasRunMemories &&
              !hasObj006
            ) {
              return {
                ...context.viewNotifications,
                "captains-log_objectives": true,
              };
            }

            return context.viewNotifications;
          },
          // Check if we should unlock status command
          availableCommands: ({ context }) => {
            const commandCounts = context.commandCounts || {};
            const hasRunAnomalies = commandCounts.anomalies > 0;
            const hasRunComms = commandCounts.comms > 0;
            const hasRunMemories = commandCounts.memories > 0;

            if (hasRunAnomalies && hasRunComms && hasRunMemories) {
              return step4FullRegistry;
            }
            return step4InitialRegistry;
          },
        }),
      },
      {
        guard: ({ event }) => event.command === "status",
        actions: assign({
          objectives: ({ context }) =>
            context.objectives.map((obj) =>
              obj.id === "obj-006" ? { ...obj, status: "completed" } : obj,
            ),
        }),
        target: "step5",
      },
    ],
    CHANGE_VIEW: [
      {
        guard: ({ event }) => event.view === "captains-log_objectives",
        actions: assign({
          viewNotifications: ({ context }) => ({
            ...context.viewNotifications,
            "captains-log_objectives": false,
          }),
        }),
        target: "step5",
      },
      {
        guard: ({ event }) => event.view === "dashboard",
        actions: assign({
          viewNotifications: ({ context }) => ({
            ...context.viewNotifications,
            dashboard: false,
          }),
        }),
      },
    ],
  },
});
