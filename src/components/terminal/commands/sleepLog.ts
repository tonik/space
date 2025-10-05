import type { Command } from "../types";
import { colorizeMessages } from "../utils";
import { COMMAND_RESPONSES } from "../content";
import { executeCommandContent } from "../commandContent";

export const sleepLogCommand: Command = {
  execute: (_, context) => {
    // Check for custom content first
    if (context.commandContent?.["sleep log"]) {
      const content = executeCommandContent(
        context.commandContent["sleep log"],
        context,
      );
      return colorizeMessages(content);
    }

    // Default behavior
    return colorizeMessages(COMMAND_RESPONSES.sleepLog);
  },
  description: "Access crew sleep logs",
  usage: "sleep log",
  aliases: ["sleep log"],
};
