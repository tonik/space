import { assign } from "xstate";
import { gameSetup } from "../game-setup";
import { getGameTimestamp } from "@/lib/utils";

/**
 * Step 4: Terminal maintenance phase
 * Shows a hidden file when 3 specific commands are discovered.
 *
 * When "anomalies", "memories", and "comms" have all been displayed,
 * reveals: { user: null, show_issues: false }
 */
export const step4 = gameSetup.createStateConfig({
  on: {
    COMMAND_DISPLAYED: {
      actions: [
        "trackDisplayedCommand",
        assign({
          logs: ({ context, event }) => {
            console.log("Step-4: COMMAND_DISPLAYED event received", {
              command: event.command,
              displayedCommands: Array.from(context.displayedCommands),
            });

            const newLogs = [...context.logs];
            const requiredCommands = ["anomalies", "memories", "comms"];
            const currentCommand = event.command;

            const displayedCommandsWithCurrent = new Set(
              context.displayedCommands,
            );
            displayedCommandsWithCurrent.add(currentCommand);

            const allCommandsDisplayed = requiredCommands.every((cmd) =>
              displayedCommandsWithCurrent.has(cmd),
            );
            const hasShownFile = newLogs.some((log) =>
              log.message.includes("user: null"),
            );

            console.log("Step-4: Checking conditions", {
              allCommandsDisplayed,
              hasShownFile,
              displayedCommandsWithCurrent: Array.from(
                displayedCommandsWithCurrent,
              ),
            });

            if (allCommandsDisplayed && !hasShownFile) {
              console.log("Step-4: Adding hidden file to logs");
              newLogs.push({
                id: `hidden-file-${Date.now()}`,
                timestamp: getGameTimestamp(context.gameStartTimestamp),
                level: "INFO" as const,
                system: "file",
                message: `{
                user: null,
                show_issues: false
              }`,
              });
            }

            return newLogs;
          },
        }),
      ],
    },
  },
});
