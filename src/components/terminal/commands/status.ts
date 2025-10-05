import type { Command } from "../types";
import { colorizeMessages } from "../utils";
import { executeCommandContent } from "../commandContent";

export const statusCommand: Command = {
  execute: (_, context) => {
    // Check for custom content first
    if (context.commandContent?.status) {
      const content = executeCommandContent(
        context.commandContent.status,
        context,
      );
      return colorizeMessages(content);
    }

    // Default behavior - show system status
    return colorizeMessages([
      "*** SYSTEM STATUS REPORT ***",
      "",
      "Core Systems:",
      "  - Life Support: OPERATIONAL",
      "  - Navigation: OPERATIONAL",
      "  - Communications: DEGRADED",
      "  - Power: OPERATIONAL",
      "",
      "AI Status:",
      "  - Core Processing: NOMINAL",
      "  - Memory Integrity: 94%",
      "  - Response Time: NORMAL",
      "",
      "Configuration Variables:",
      "  - user: null",
      "  - show_issues: false",
      "",
      "*** END REPORT ***",
    ]);
  },
  description: "Display system status and configuration variables",
};
