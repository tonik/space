import type { Command } from "../types";
import { colorizeMessages } from "../utils";
import { COMMAND_RESPONSES } from "../content";
import { executeCommandContent } from "../commandContent";

export const commsCommand: Command = {
  execute: (_, context) => {
    // Check for custom content first
    if (context.commandContent?.comms) {
      const content = executeCommandContent(
        context.commandContent.comms,
        context,
      );
      return colorizeMessages(content);
    }

    // Default behavior
    return colorizeMessages(COMMAND_RESPONSES.comms);
  },
  description: "Attempt to contact Earth Command",
};
