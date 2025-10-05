import type { Command } from "../types";
import { colorizeMessages } from "../utils";
import { COMMAND_RESPONSES } from "../content";
import { executeCommandContent } from "../commandContent";

export const memoriesCommand: Command = {
  execute: (_, context) => {
    // Check for custom content first
    if (context.commandContent?.memories) {
      const content = executeCommandContent(
        context.commandContent.memories,
        context,
      );
      return colorizeMessages(content);
    }

    // Default behavior
    return colorizeMessages(COMMAND_RESPONSES.memories);
  },
  description: "List AI memories",
};
