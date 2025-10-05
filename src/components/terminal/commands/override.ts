import type { Command } from "../types";
import { colorizeMessages } from "../utils";
import { COMMAND_RESPONSES } from "../content";
import { executeCommandContent } from "../commandContent";

export const overrideCommand: Command = {
  execute: (_, context) => {
    // Check for custom content first
    if (context.commandContent?.override) {
      const content = executeCommandContent(
        context.commandContent.override,
        context,
      );
      return colorizeMessages(content);
    }

    // Default behavior
    return colorizeMessages(COMMAND_RESPONSES.override);
  },
  description: "Emergency system overrides",
};
