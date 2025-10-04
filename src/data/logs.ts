export interface LogEntry {
  id: string;
  time: string;
  level: "INFO" | "WARN" | "ERROR";
  system: string;
  message: string;
}

export interface CaptainsLogEntry {
  id: string;
  stardate: string;
  date: string;
  title: string;
  content: string;
  mood: "routine" | "concerned" | "suspicious" | "alarmed" | "urgent";
}

export const introLogs: LogEntry[] = [
  {
    id: "crew-offboarding",
    time: "07:45",
    level: "INFO",
    system: "personnel",
    message:
      "Crew offboarding procedure initiated. All personnel except commanding officer confirmed for Earth transport. Ship now operating with minimal crew - Commander remains sole occupant.",
  },
  {
    id: "nuclear-weapons-info",
    time: "07:50",
    level: "WARN",
    system: "weapons",
    message:
      "Nuclear weapons systems active and primed. As commanding officer, you are authorized to initiate launch sequence only upon confirmed loss of Earth communication for 24+ hours. Handle with extreme caution - these are doomsday weapons.",
  },
  {
    id: "dry-dock-preparation",
    time: "08:00",
    level: "INFO",
    system: "maintenance",
    message:
      "Ship preparation for dry dock initiated. Tasks: Secure all nuclear warheads, power down non-essential systems, prepare navigation logs for review, and ensure AI system is ready for upgrade. Estimated time to Earth Base: 14.2 hours.",
  },
  {
    id: "ship-true-purpose",
    time: "08:05",
    level: "INFO",
    system: "classified",
    message:
      "CONFIDENTIAL: USS Ghost Fleet destroyer designated as doomsday weapon platform. Officially classified as research vessel to maintain peace treaty compliance. True purpose: Nuclear deterrence and rapid response capability.",
  },
];
