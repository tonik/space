import type { Command } from "../types";

export const whoamiCommand: Command = {
  execute: (_, context) => {
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
