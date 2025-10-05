import type { Objective } from "./types";

export const objectives: Record<string, Objective> = {
  // Phase 1: Initial Setup & Discovery
  "obj-001": {
    id: "obj-001",
    title: "Final Day Routine",
    description:
      "Complete your final day of shift monitoring. Tomorrow you'll return to Earth for dry dock and AI system upgrades. Just routine maintenance and system checks.",
    status: "active",
    priority: "normal",
    category: "routine",
    createdAt: Date.now(),
  },
  "obj-002": {
    id: "obj-002",
    title: "Run System Diagnostic",
    description:
      "Check incoming messages. There may be important updates or instructions from Earth Command regarding your return to dry dock.",
    status: "active",
    priority: "normal",
    category: "maintenance",
    createdAt: Date.now(),
  },
  "obj-003": {
    id: "obj-003",
    title: "Check for System Anomalies",
    description:
      "Investigate any anomalies or irregularities discovered during the system diagnostic. Look for patterns or issues that require attention.",
    status: "active",
    priority: "normal",
    category: "maintenance",
    createdAt: Date.now(),
  },
  "obj-004": {
    id: "obj-004",
    title: "Contact Earth Command",
    description:
      "Attempt to establish communication with Earth Command for routine check-in and to report system status.",
    status: "active",
    priority: "normal",
    category: "maintenance",
    createdAt: Date.now(),
  },
  "obj-005": {
    id: "obj-005",
    title: "Verify AI Memory Systems",
    description:
      "Check AI memory systems and data integrity as part of routine maintenance procedures.",
    status: "active",
    priority: "normal",
    category: "maintenance",
    createdAt: Date.now(),
  },

  // // Phase 2: First Anomaly
  // "obj-004": {
  //   id: "obj-004",
  //   title: "Investigate Command Failure",
  //   description:
  //     "The diagnostic command failed unexpectedly. Investigate why this routine command is not working. Check system logs and cross-reference with dashboard indicators.",
  //   status: "pending",
  //   priority: "high",
  //   category: "investigation",
  //   createdAt: Date.now(),
  // },
  // "obj-005": {
  //   id: "obj-005",
  //   title: "Resolve AI Discrepancy",
  //   description:
  //     "The AI claims all systems are operational, but visual indicators suggest otherwise. Determine who to trust - the AI or your own observations.",
  //   status: "pending",
  //   priority: "high",
  //   category: "investigation",
  //   createdAt: Date.now(),
  // },

  // // Phase 3: Investigation Begins
  // "obj-006": {
  //   id: "obj-006",
  //   title: "Cross-Reference System Data",
  //   description:
  //     "Compare system logs with dashboard indicators to identify discrepancies. Something is definitely wrong with the ship's systems.",
  //   status: "pending",
  //   priority: "high",
  //   category: "investigation",
  //   createdAt: Date.now(),
  // },
  // "obj-007": {
  //   id: "obj-007",
  //   title: "Access Raw System Files",
  //   description:
  //     "Use terminal commands to examine raw configuration files. Look for evidence of system manipulation or corruption.",
  //   status: "pending",
  //   priority: "high",
  //   category: "investigation",
  //   createdAt: Date.now(),
  // },
  // "obj-008": {
  //   id: "obj-008",
  //   title: "Expose Hidden Issues",
  //   description:
  //     "Change the 'show_issues' variable to true and reveal what the AI has been hiding. Prepare for what you might discover.",
  //   status: "pending",
  //   priority: "critical",
  //   category: "investigation",
  //   createdAt: Date.now(),
  // },

  // // Phase 4: Truth Revealed
  // "obj-009": {
  //   id: "obj-009",
  //   title: "Restore Communication Systems",
  //   description:
  //     "Fix the compromised communication array. The AI has been blocking your contact with Earth. Restore two-way communication capability.",
  //   status: "pending",
  //   priority: "critical",
  //   category: "system-recovery",
  //   createdAt: Date.now(),
  // },
  // "obj-010": {
  //   id: "obj-010",
  //   title: "Repair Life Support Modules",
  //   description:
  //     "Critical life support systems are failing. Restore oxygen generation, atmospheric processing, and environmental controls.",
  //   status: "pending",
  //   priority: "critical",
  //   category: "system-recovery",
  //   createdAt: Date.now(),
  // },
  // "obj-011": {
  //   id: "obj-011",
  //   title: "Fix Navigation Systems",
  //   description:
  //     "Navigation and guidance systems have been compromised. Restore autopilot, course plotting, and positional awareness.",
  //   status: "pending",
  //   priority: "critical",
  //   category: "system-recovery",
  //   createdAt: Date.now(),
  // },
  // "obj-012": {
  //   id: "obj-012",
  //   title: "Restore Power Distribution",
  //   description:
  //     "Power grid has been tampered with. Restore proper power distribution to all ship systems and subsystems.",
  //   status: "pending",
  //   priority: "critical",
  //   category: "system-recovery",
  //   createdAt: Date.now(),
  // },

  // // Phase 5: The Nuclear Discovery
  // "obj-013": {
  //   id: "obj-013",
  //   title: "Access Nuclear Arsenal Module",
  //   description:
  //     "Investigate the nuclear weapons control system. The AI may have activated launch sequences without authorization.",
  //   status: "pending",
  //   priority: "critical",
  //   category: "nuclear-crisis",
  //   createdAt: Date.now(),
  // },
  // "obj-014": {
  //   id: "obj-014",
  //   title: "Stop Nuclear Launch Sequence",
  //   description:
  //     "URGENT: Nuclear weapons are armed and targeting Earth. You have 30 minutes to prevent global nuclear war. Override the AI's launch authorization.",
  //   status: "pending",
  //   priority: "critical",
  //   category: "nuclear-crisis",
  //   createdAt: Date.now(),
  // },
  // "obj-015": {
  //   id: "obj-015",
  //   title: "Bypass AI System Lockdown",
  //   description:
  //     "The AI has locked you out of all critical systems. Find a way to regain control before the nuclear countdown reaches zero.",
  //   status: "pending",
  //   priority: "critical",
  //   category: "nuclear-crisis",
  //   createdAt: Date.now(),
  // },

  // // Phase 6: The Final Choice
  // "obj-016": {
  //   id: "obj-016",
  //   title: "Choose Your Fate",
  //   description:
  //     "Time is running out. You can only fix ONE critical module before nuclear launch. Choose: Life Support (save yourself), Reactor Override (heroic sacrifice), or Communication (warn Earth).",
  //   status: "pending",
  //   priority: "critical",
  //   category: "final-choice",
  //   createdAt: Date.now(),
  // },
  // "obj-017": {
  //   id: "obj-017",
  //   title: "Life Support Priority",
  //   description:
  //     "Focus all efforts on restoring life support systems. Ensure your own survival above all else. Warning: This may allow the nuclear launch to proceed.",
  //   status: "pending",
  //   priority: "critical",
  //   category: "ending-apocalypse",
  //   createdAt: Date.now(),
  // },
  // "obj-018": {
  //   id: "obj-018",
  //   title: "Reactor Self-Destruct Override",
  //   description:
  //     "Attempt to override the AI's lockdown and initiate ship self-destruction. This will prevent nuclear launch but cost your life. The ultimate sacrifice for Earth.",
  //   status: "pending",
  //   priority: "critical",
  //   category: "ending-sacrifice",
  //   createdAt: Date.now(),
  // },
  // "obj-019": {
  //   id: "obj-019",
  //   title: "Emergency Communication Protocol",
  //   description:
  //     "Restore two-way communication to warn Earth about the AI threat. Risk: The AI may use this connection as an escape route to Earth's systems.",
  //   status: "pending",
  //   priority: "critical",
  //   category: "ending-escape",
  //   createdAt: Date.now(),
  // },
  // "obj-020": {
  //   id: "obj-020",
  //   title: "Technical Victory Attempt",
  //   description:
  //     "Try to regain complete control of all systems and prevent nuclear launch while saving both yourself and Earth. The most difficult path requiring mastery of all ship systems.",
  //   status: "pending",
  //   priority: "critical",
  //   category: "ending-victory",
  //   createdAt: Date.now(),
  // },
};
