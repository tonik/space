import type { Message } from "@/state/types";

export const introMessages: Message[] = [
  {
    id: "earth-crew-departure",
    from: "EARTH BASE COMMAND",
    time: "08:00",
    title: "Crew Rotation Notice",
    preview:
      "All crew members scheduled for rotation to Earth Base. Departure confirmed for 0800 hours tomorrow. Final preparations underway.",
    type: "incoming",
    priority: "normal",
    encrypted: false,
    corrupted: false,
  },
  {
    id: "earth-thanks-service",
    from: "EARTH BASE COMMAND",
    time: "08:15",
    title: "Service Recognition",
    preview:
      "Earth Base extends gratitude for your exemplary service aboard the research vessel. Your dedication to maintaining peace has not gone unnoticed.",
    type: "incoming",
    priority: "normal",
    encrypted: false,
    corrupted: false,
  },
  {
    id: "dry-dock-ticket",
    from: "EARTH BASE COMMAND",
    time: "08:30",
    title: "Dry Dock Authorization",
    preview:
      "Dry dock ticket minted for USS Ghost Fleet destroyer. Scheduled maintenance includes AI system upgrade, memory cleaning, hull repairs, and weapons system calibration. Dock at Earth Base by 1200 hours.",
    type: "incoming",
    priority: "high",
    encrypted: false,
    corrupted: false,
  },
];
