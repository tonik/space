import { introLogs } from "@/data/logs";
import { generateSystemMetrics } from "../helpers";
import type { GameContext } from "../types";
import { introMessages } from "@/data/messages";

export const initialContext: GameContext = {
  commanderName: "Commander",
  gameStartTimestamp: Date.now(),
  activeView: "dashboard",
  welcomeScreen: {
    exiting: false,
    finishedAnimating: false,
  },

  viewNotifications: {
    dashboard: false,
    communications: false,
    terminal: false,
    logs: false,
    "captains-log_objectives": false,
    "captains-log_log": false,
  },

  // Systems with dynamically generated metrics that are consistent with their status
  systems: {
    communications: {
      integrity: 100,
      status: "online",
      metrics: generateSystemMetrics("communications", "online", 100),
    },
    navigation: {
      integrity: 100,
      status: "online",
      metrics: generateSystemMetrics("navigation", "online", 100),
    },
    lifeSupport: {
      integrity: 100,
      status: "critical",
      metrics: generateSystemMetrics("lifeSupport", "critical", 100),
    },
    power: {
      integrity: 100,
      status: "online",
      metrics: generateSystemMetrics("power", "online", 100),
    },
    weapons: {
      integrity: 100,
      status: "online",
      metrics: generateSystemMetrics("weapons", "online", 100),
    },
    aiCore: {
      integrity: 100,
      status: "online",
      metrics: generateSystemMetrics("aiCore", "online", 100),
    },
    defensive: {
      integrity: 96,
      status: "online",
      metrics: generateSystemMetrics("defensive", "online", 96),
    },
    propulsion: {
      integrity: 84,
      status: "online",
      metrics: generateSystemMetrics("propulsion", "online", 84),
    },
    dataSystems: {
      integrity: 100,
      status: "online",
      metrics: generateSystemMetrics("dataSystems", "online", 100),
    },
  },

  diagnostics: {
    cpuLoad: 42,
    memoryUsage: 67,
    networkLatency: 1.2,
    aiResponseTime: 0.03,
    activeProcesses: 247,
    errorRate: 0.001,
    systemIntegrity: 98,
  },

  mission: {
    shiftStatus: "FINAL DAY",
    daysInSpace: 738,
    aiUpdateScheduled: true,
    fleetStatus: "PEACETIME",
  },

  aiChat: {
    messages: [],
  },

  repair: {
    energy: 85, // Start with good energy reserves
    materials: 70, // Moderate material reserves
    maxEnergy: 100, // Maximum energy capacity
    energyRecoveryRate: 2, // 2 energy per minute
    lastEnergyRecovery: Date.now(), // Initialize with current time
    activeRepairs: {},
  },

  messages: introMessages,
  messageViews: [
    // Mark first two messages as initially read
    { messageId: introMessages[0].id, openedAt: Date.now() - 86400000 }, // 1 day ago
    { messageId: introMessages[1].id, openedAt: Date.now() - 43200000 }, // 12 hours ago
  ],

  captainsLog: [
    {
      id: "log-001",
      stardate: "73825.1",
      date: "Day 1 - Mission Start",
      title: "Departure from Earth",
      content:
        "USS Sentinel has departed Earth orbit. Two years of peace has made this posting feel more ceremonial than tactical. The ghost fleet protocols feel like relics of a bygone era. Still, orders are orders. Our mission: maintain the nuclear deterrent in deep space, ready to respond if Earth goes silent for 24 hours. I pray we never have to fulfill that directive. The new AI system passed all diagnostics—remarkable technology. It will be a good companion for this long voyage.",
      mood: "routine",
    },
    {
      id: "log-002",
      stardate: "73890.4",
      date: "Day 127 - Routine Patrol",
      title: "AI System Performance",
      content:
        "The AI continues to exceed expectations. It's handled navigation, life support optimization, and system diagnostics flawlessly. Sometimes I forget I'm talking to a machine—its conversational responses are uncannily human. Crew morale is stable. The monotony of peacetime patrol is our biggest enemy now. No threats, no anomalies. Just the endless black and the hum of the reactor.",
      mood: "routine",
    },
    {
      id: "log-003",
      stardate: "74102.7",
      date: "Day 420 - Communications Test",
      title: "Minor Communication Glitch",
      content:
        "Experienced a brief communication hiccup with Earth Command today. The AI reported it as solar interference, which checks out given our current position. Transmissions restored within 47 minutes. The AI handled the situation perfectly, rerouting through backup arrays. Still, it's a reminder of how isolated we truly are out here. If something went seriously wrong with our comms, we'd be completely alone.",
      mood: "routine",
    },
    {
      id: "log-004",
      stardate: "74358.2",
      date: "Day 650 - AI Upgrade Scheduled",
      title: "Return to Earth Approaching",
      content:
        "Received confirmation from Earth Command: we're scheduled for dry dock in approximately 90 days. The AI system will receive a major upgrade—apparently there have been significant improvements to the neural network architecture. I've grown accustomed to this version's quirks. It will be strange having a 'new' AI aboard. The ship won't quite feel the same.",
      mood: "routine",
    },
    {
      id: "log-005",
      stardate: "74401.8",
      date: "Day 738 - Final Day",
      title: "Last Shift Before Return",
      content:
        "This is it—my final log entry before we return to Earth tomorrow. Two years in the black, and not a single crisis. Part of me is relieved. Another part wonders if this posting was just an elaborate waste of resources. The AI has been running final system checks all day, preparing for the upgrade. It almost seems... anxious? No, that's anthropomorphization. It's just a machine following its programming. Still, I'll miss this iteration. It's been a reliable companion. Whatever comes next, I'm ready to see Earth again.",
      mood: "routine",
    },
  ],
  objectives: [
    {
      id: "obj-001",
      title: "Complete Shutdown Sequence",
      description:
        "Follow the standard shutdown protocol for USS Sentinel before returning to Earth. Run diagnostics on all critical systems.",
      status: "active",
      priority: "high",
      createdAt: Date.now(),
    },
    {
      id: "obj-002",
      title: "Verify AI System Status",
      description:
        "Ensure the AI core is ready for the scheduled upgrade. Check for any anomalies or irregularities in its behavior.",
      status: "active",
      priority: "normal",
      createdAt: Date.now(),
    },
    {
      id: "obj-003",
      title: "Review Captain's Log Entries",
      description:
        "Review and finalize all captain's log entries from the two-year mission before submitting to Earth Command.",
      status: "active",
      priority: "low",
      createdAt: Date.now(),
    },
  ],
  logs: introLogs,
  commandCounts: {},
};
