import type { LogEntry } from "@/state/types";
import { INITIAL_CURRENT_DATE } from "@/lib/utils";

export const introLogs: LogEntry[] = [
  {
    id: "crew-offboarding",
    timestamp: INITIAL_CURRENT_DATE.getTime(),
    level: "INFO",
    system: "personnel",
    message:
      "Crew offboarding procedure initiated. All personnel except commanding officer confirmed for Earth transport. Ship now operating with minimal crew - Commander remains sole occupant.",
  },
  {
    id: "nuclear-weapons-info",
    timestamp: INITIAL_CURRENT_DATE.getTime(),
    level: "WARN",
    system: "weapons",
    message:
      "Nuclear weapons systems active and primed. As commanding officer, you are authorized to initiate launch sequence only upon confirmed loss of Earth communication for 24+ hours. Handle with extreme caution - these are doomsday weapons.",
  },
  {
    id: "dry-dock-preparation",
    timestamp: INITIAL_CURRENT_DATE.getTime(),
    level: "INFO",
    system: "maintenance",
    message:
      "Ship preparation for dry dock initiated. Tasks: Secure all nuclear warheads, power down non-essential systems, prepare navigation logs for review, and ensure AI system is ready for upgrade. Estimated time to Earth Base: 14.2 hours.",
  },
  {
    id: "ship-true-purpose",
    timestamp: INITIAL_CURRENT_DATE.getTime(),
    level: "INFO",
    system: "classified",
    message:
      "CONFIDENTIAL: USS Ghost Fleet destroyer designated as doomsday weapon platform. Officially classified as research vessel to maintain peace treaty compliance. True purpose: Nuclear deterrence and rapid response capability.",
  },
];
