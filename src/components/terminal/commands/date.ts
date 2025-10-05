import type { Command } from "../types";

export const dateCommand: Command = {
  execute: (_, context) => {
    const { mission } = context;
    return [
      `Mission Date: Day ${mission?.daysInSpace || 738} in space`,
      `Ship Time: ${mission?.shiftStatus || "FINAL DAY"}`,
      `Next Rotation: ${mission?.aiUpdateScheduled ? "Tomorrow (dry dock for AI system upgrade)" : "TBD"}`,
      `Fleet Status: ${mission?.fleetStatus || "PEACETIME"}`,
      "Mission Status: Standby - Nuclear deterrence protocol active",
    ];
  },
  description: "Show mission date and status",
};
