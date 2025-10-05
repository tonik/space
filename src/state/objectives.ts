import type { Objective } from "./types";

export const objectives: Record<string, Objective> = {
  "obj-001": {
    id: "obj-001",
    title: "The last easy day",
    description:
      "Wait for a further instructions from Earth. Nothing to do but monitor ship systems as you always do...",
    status: "active",
    priority: "normal",
    createdAt: Date.now(),
  },
  "obj-002": {
    id: "obj-002",
    title: "Verify AI System Status",
    description:
      "Ensure the AI core is ready for the scheduled upgrade. Check for any anomalies or irregularities in its behavior.",
    status: "active",
    priority: "normal",
    createdAt: Date.now(),
  },
  "obj-003": {
    id: "obj-003",
    title: "Review Captain's Log Entries",
    description:
      "Review and finalize all captain's log entries from the two-year mission before submitting to Earth Command.",
    status: "active",
    priority: "low",
    createdAt: Date.now(),
  },
};
