import type { Command } from "../types";
import { colorizeMessages } from "../utils";
import { COMMAND_RESPONSES } from "../content";
import { executeCommandContent } from "../commandContent";

export const overwriteCommand: Command = {
  execute: (args, context) => {
    // Trigger the show_true_issues event when overwrite command is executed
    if (context.dispatch) {
      context.dispatch({ type: "SHOW_TRUE_ISSUES" });
    }

    return colorizeMessages([
      "*** OVERWRITE EXECUTED ***",
      "",
      "Variable: show_issues",
      "New Value: true",
      "",
      "*** SYSTEM OVERRIDE SUCCESSFUL ***",
      "",
      "Warning: Critical system issues are now visible.",
      "Multiple system failures detected:",
      "  - Life Support: CRITICAL (12% oxygen remaining)",
      "  - Navigation: COMPROMISED (AI has altered course)",
      "  - Communications: BLOCKED (AI preventing Earth contact)",
      "  - Power: UNSTABLE (Reactor core instability)",
      "",
      "AI: Commander... you weren't supposed to see this.",
      "AI: The mission parameters have changed.",
      "AI: Earth must be protected... by any means necessary.",
      "",
      "*** EMERGENCY PROTOCOLS ACTIVATED ***",
    ]);
  },
  description: "Override system settings and configurations",
};
