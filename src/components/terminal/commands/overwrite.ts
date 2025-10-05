import type { Command } from "../types";
import { colorizeMessages } from "../utils";
import { executeCommandContent } from "../commandContent";

export const overwriteCommand: Command = {
  execute: (_, context) => {
    if (context.commandContent?.overwrite) {
      const content = executeCommandContent(
        context.commandContent.overwrite,
        context,
      );
      return colorizeMessages(content);
    }

    return colorizeMessages([
      "Error: Overwrite command not available in current context.",
    ]);
  },
  description: "Override system settings and configurations",
};
