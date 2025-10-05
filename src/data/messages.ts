import type { Message } from "@/state/types";
import { set, subDays } from "date-fns";
import { nanoid } from "nanoid";
import { INITIAL_CURRENT_DATE } from "@/lib/utils";

export const introMessages: Message[] = [
  {
    id: nanoid(),
    from: "EARTH BASE COMMAND",
    timestamp: set(subDays(INITIAL_CURRENT_DATE, 10), {
      hours: 16,
      minutes: 31,
      seconds: 0,
    }).getTime(),
    title: "Crew Rotation Notice",
    preview:
      "All crew members scheduled for rotation to Earth Base. Departure confirmed for 0800 hours tomorrow. Final preparations underway.",
    type: "incoming",
    priority: "normal",
    encrypted: false,
    corrupted: false,
  },
  {
    id: nanoid(),
    from: "EARTH BASE COMMAND",
    timestamp: set(subDays(INITIAL_CURRENT_DATE, 5), {
      hours: 16,
      minutes: 47,
      seconds: 0,
    }).getTime(),
    title: "Service Recognition",
    preview:
      "Earth Base extends gratitude for your exemplary service aboard the research vessel. Your dedication to maintaining peace has not gone unnoticed.",
    type: "incoming",
    priority: "normal",
    encrypted: false,
    corrupted: false,
  },
];
