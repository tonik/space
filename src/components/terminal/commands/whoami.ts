import type { Command } from "../types";
import { executeCommandContent } from "../commandContent";

export const whoamiCommand: Command = {
  execute: (_, context) => {
    // Check for custom content first
    if (context.commandContent?.whoami) {
      return executeCommandContent(context.commandContent.whoami, context);
    }

    // Default behavior
    const { currentName } = context;
    return [
      `User: ${currentName || "space-marine"}`,
      "Role: USA Ghost Fleet Space Marine",
      "Clearance: NUCLEAR-ALPHA",
      "Mission: Nuclear Deterrence Protocol",
      "Status: Final day of shift - scheduled for dry dock tomorrow",
    ];
  },
  description: "Show current user",
};
