import type { Command } from "../types";
import { colorizeMessages } from "../utils";
import { COMMAND_RESPONSES } from "../content";
import { executeCommandContent } from "../commandContent";

export const anomaliesCommand: Command = {
  execute: (_, context) => {
    // Check for custom content first
    if (context.commandContent?.anomalies) {
      const content = executeCommandContent(
        context.commandContent.anomalies,
        context,
      );
      return colorizeMessages(content);
    }

    // Default behavior
    return colorizeMessages(COMMAND_RESPONSES.anomalies);
  },
  description: "Report system anomalies",
};
