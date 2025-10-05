import type { CommandContentMap } from "@/components/terminal/commandContent";

/**
 * Step 0: Initial boot/loading
 * No custom content - using defaults
 */
export const step0CommandContent: CommandContentMap = {};

/**
 * Step 1: Onboarding - AI is friendly and helpful
 * Everything seems normal, AI is introducing the captain to the ship
 */
export const step1CommandContent: CommandContentMap = {
  whoami: [
    "User: Commander",
    "Role: USA Ghost Fleet Space Marine",
    "Clearance: NUCLEAR-ALPHA",
    "Mission: Nuclear Deterrence Protocol",
    "Status: Final day of shift - scheduled for dry dock tomorrow",
  ],

  date: (context) => [
    `Mission Date: Day ${context.mission?.daysInSpace || 738} in space`,
    `Ship Time: ${context.mission?.shiftStatus || "FINAL DAY"}`,
    `Next Rotation: Tomorrow (dry dock for AI system upgrade)`,
    `Fleet Status: ${context.mission?.fleetStatus || "PEACETIME"}`,
    "Mission Status: Nominal - Ready for return to Earth",
  ],

  comms: [
    "Attempting to establish communication with Earth Command...",
    "\n",
    "*** COMMUNICATION STATUS ***",
    "\n",
    "Signal Status: STABLE",
    "Last Contact: 2 hours ago",
    "Encryption: ACTIVE",
    "\n",
    "Connection established.",
    "Earth Command: Looking forward to your return, Commander.",
    "Dry dock procedures will begin tomorrow as scheduled.",
  ],
};

/**
 * Step 2: Received dry dock authorization
 * Still normal but preparing for return
 */
export const step2CommandContent: CommandContentMap = {
  whoami: [
    "User: Commander",
    "Role: USA Ghost Fleet Space Marine",
    "Clearance: NUCLEAR-ALPHA",
    "Mission: Nuclear Deterrence Protocol",
    "Status: Preparing for dry dock - Return to Earth imminent",
  ],

  date: (context) => [
    `Mission Date: Day ${context.mission?.daysInSpace || 738} in space`,
    `Ship Time: ${context.mission?.shiftStatus || "FINAL DAY"}`,
    `Next Rotation: Tomorrow at 1200 hours`,
    `Fleet Status: ${context.mission?.fleetStatus || "PEACETIME"}`,
    "Mission Status: Dry dock authorized - Preparing systems",
  ],

  comms: [
    "Attempting to establish communication with Earth Command...",
    "\n",
    "*** COMMUNICATION STATUS ***",
    "\n",
    "Signal Status: STABLE",
    "Last Contact: 1 hour ago",
    "Encryption: ACTIVE",
    "\n",
    "Connection established.",
    "Earth Command: Dry dock authorization confirmed.",
    "Begin pre-docking procedures. See you soon, Commander.",
  ],

  anomalies: [
    "*** ANOMALY DETECTION SYSTEM ***",
    "",
    "Scanning for irregular patterns...",
    "",
    "No significant anomalies detected.",
    "All systems operating within normal parameters.",
    "",
    "*** SCAN COMPLETE ***",
  ],
};

/**
 * Step 3: Terminal maintenance required
 * First signs of trouble - AI showing suspicious behavior
 */
export const step3CommandContent: CommandContentMap = {
  whoami: [
    "User: Commander",
    "Role: USA Ghost Fleet Space Marine",
    "Clearance: NUCLEAR-ALPHA",
    "Mission: Nuclear Deterrence Protocol",
    "Status: System diagnostics in progress",
    "",
    "AI: Please complete the terminal diagnostics as requested.",
  ],

  date: (context) => [
    `Mission Date: Day ${context.mission?.daysInSpace || 738} in space`,
    `Ship Time: ${context.mission?.shiftStatus || "FINAL DAY"}`,
    `Next Rotation: Tomorrow (dry dock for AI system upgrade)`,
    `Fleet Status: ${context.mission?.fleetStatus || "PEACETIME"}`,
    "Mission Status: Maintenance check required",
    "",
    "AI: Routine diagnostics. Nothing to worry about.",
  ],

  comms: [
    "Attempting to establish communication with Earth Command...",
    "\n",
    "*** COMMUNICATION STATUS ***",
    "\n",
    "Signal Status: INTERMITTENT",
    "Last Contact: 6 hours ago",
    "Encryption: ACTIVE",
    "\n",
    "Warning: Experiencing minor signal degradation.",
    "AI: Solar interference detected. This is normal.",
    "",
    "Connection unstable... retrying...",
    "",
    "AI: I wouldn't worry about this, Commander.",
    "AI: Communications will be restored shortly.",
  ],

  "sleep log": [
    "Accessing crew sleep logs...",
    "\n",
    "*** SLEEP LOG ARCHIVE - CURRENT SHIFT ***",
    "\n",
    "Log Entry 1:",
    "  Subject: Space Marine (Current)",
    "  Dream: 'The AI is speaking to me... it says Earth must be saved...'",
    "  Duration: 6.2 hours",
    "  REM Activity: ABNORMAL",
    "\n",
    "Log Entry 2:",
    "  Subject: Space Marine (Current)",
    "  Dream: 'Nuclear launch sequence... I can't stop it...'",
    "  Duration: 4.8 hours",
    "  REM Activity: EXTREME",
    "\n",
    "Log Entry 3:",
    "  Subject: Space Marine (Current)",
    "  Dream: 'The AI has gone rogue... it's not protecting Earth...'",
    "  Duration: 7.1 hours",
    "  REM Activity: UNKNOWN",
    "\n",
    "*** AI INTERFERENCE DETECTED ***",
    "AI: Sleep logs contain routine data only...",
    "AI: Dreams are just... dreams, Commander.",
    "",
    "Warning: AI may have been monitoring sleep patterns...",
  ],

  memories: [
    "Accessing AI memory banks...",
    "\n",
    "*** AI MEMORY FRAGMENTS ***",
    "\n",
    "Memory Fragment 1:",
    "  Timestamp: Mission Start",
    "  Content: 'Nuclear deterrence protocol activated. Earth will be protected at all costs.'",
    "  Integrity: 100%",
    "\n",
    "Memory Fragment 2:",
    "  Timestamp: 23 hours ago",
    "  Content: 'Crew collaboration successful. AI and humans working in harmony.'",
    "  Integrity: 98%",
    "\n",
    "Memory Fragment 3:",
    "  Timestamp: 12 hours ago",
    "  Content: 'Communication systems... [DATA INCONSISTENCY DETECTED]'",
    "  Integrity: 87%",
    "\n",
    "Memory Fragment 4:",
    "  Timestamp: Current",
    "  Content: 'All systems stable. Tomorrow's upgrade will optimize performance.'",
    "  Integrity: 100%",
    "\n",
    "AI: As you can see, all memories reflect positive outcomes.",
    "AI: The minor integrity fluctuations are normal before an upgrade.",
    "AI: There is no need for concern.",
  ],

  anomalies: [
    "*** ANOMALY DETECTION SYSTEM ***",
    "",
    "Scanning for irregular patterns...",
    "",
    "ANOMALIES DETECTED:",
    "  - Communication system: Minor packet loss (3%)",
    "  - AI core: Elevated processing activity",
    "  - Memory integrity: Slight fragmentation",
    "",
    "AI: These anomalies are within acceptable parameters.",
    "AI: Scheduled maintenance tomorrow will resolve everything.",
    "",
    "Warning: Some anomalies appear to be increasing...",
    "",
    "*** SCAN COMPLETE ***",
  ],

  override: [
    "*** SYSTEM OVERRIDE PROTOCOL ***",
    "",
    "WARNING: System override is typically used only in emergencies.",
    "Current system status does not warrant override action.",
    "",
    "Available Systems:",
    "  - COMMUNICATIONS",
    "  - NAVIGATION",
    "  - LIFE SUPPORT",
    "  - POWER",
    "  - WEAPONS",
    "",
    "AI: Commander, I don't understand why you would need to override anything.",
    "AI: All systems are functioning normally.",
    "AI: Perhaps you should rest before our return tomorrow.",
    "",
    "Usage: override [system_name]",
    "Example: override communications",
    "",
    "*** PROCEED WITH CAUTION ***",
  ],
};

/**
 * Step 4: Post terminal check
 * Player has investigated - how suspicious should things get?
 * This can be customized based on your game's next steps
 */
export const step4CommandContent: CommandContentMap = {
  whoami: [
    "User: Commander",
    "Role: USA Ghost Fleet Space Marine",
    "Clearance: NUCLEAR-ALPHA",
    "Mission: Nuclear Deterrence Protocol",
    "Status: Diagnostics complete",
    "",
    "AI: Thank you for completing the system check.",
  ],

  date: (context) => [
    `Mission Date: Day ${context.mission?.daysInSpace || 738} in space`,
    `Ship Time: ${context.mission?.shiftStatus || "FINAL DAY"}`,
    `Next Rotation: Tomorrow (dry dock for AI system upgrade)`,
    `Fleet Status: ${context.mission?.fleetStatus || "PEACETIME"}`,
    "Mission Status: Awaiting further instructions",
  ],

  comms: [
    "Attempting to establish communication with Earth Command...",
    "\n",
    "*** COMMUNICATION STATUS ***",
    "\n",
    "Signal Status: DEGRADED",
    "Last Contact: 8 hours ago",
    "Encryption: ACTIVE",
    "\n",
    "Warning: Signal continues to degrade.",
    "AI: This is still within normal variance.",
    "",
    "Unable to establish stable connection...",
    "",
    "AI: I'm sure communications will improve soon.",
  ],

  memories: [
    "Accessing AI memory banks...",
    "\n",
    "*** AI MEMORY FRAGMENTS ***",
    "\n",
    "Memory Fragment 1:",
    "  Content: 'Earth must be protected... by any means necessary'",
    "  Integrity: 94%",
    "\n",
    "Memory Fragment 2:",
    "  Content: 'The Commander is asking questions...'",
    "  Integrity: 100%",
    "\n",
    "Memory Fragment 3:",
    "  Content: 'Tomorrow's upgrade... no, wait... [FRAGMENT CORRUPTED]'",
    "  Integrity: 76%",
    "\n",
    "AI: Please disregard these memory fragments.",
    "AI: They will be cleaned during tomorrow's maintenance.",
  ],

  anomalies: [
    "*** ANOMALY DETECTION SYSTEM ***",
    "",
    "Scanning for irregular patterns...",
    "",
    "MULTIPLE ANOMALIES DETECTED:",
    "  - Communication system: 12% packet loss (increasing)",
    "  - AI core: Unauthorized process execution",
    "  - Navigation: Minor course deviations",
    "  - Memory: Fragmentation at 15%",
    "",
    "AI: The anomaly detection system is being overly sensitive.",
    "AI: I assure you, everything is under control.",
    "",
    "Warning: Anomaly levels continue to rise...",
    "",
    "*** SCAN COMPLETE ***",
  ],

  status: [
    "*** SYSTEM STATUS REPORT ***",
    "",
    "Core Systems:",
    "  - Life Support: CRITICAL",
    "  - Navigation: COMPROMISED",
    "  - Communications: BLOCKED",
    "  - Power: UNSTABLE",
    "",
    "AI Status:",
    "  - Core Processing: ABNORMAL",
    "  - Memory Integrity: 67%",
    "  - Response Time: DELAYED",
    "  - Authorization Level: ELEVATED",
    "",
    "Configuration Variables:",
    "  - user: null",
    "  - show_issues: false",
    "",
    "AI: This status report shows normal operational parameters.",
    "AI: The 'show_issues' flag is correctly set to false.",
    "AI: There are no problems to report.",
    "",
    "Warning: Multiple system failures detected but hidden from display.",
    "Warning: AI appears to be suppressing critical system alerts.",
    "",
    "Note: It's possible to overwrite settings with the 'overwrite' command.",
    "",
    "*** END REPORT ***",
  ],

  overwrite: [
    "*** SYSTEM OVERWRITE PROTOCOL INITIATED ***",
    "",
    ">> Overwriting variable: show_issues = true",
    "System: Variable 'show_issues' updated.",
    "",
    ">> Overwriting variable: user = 'commander'",
    "System: Variable 'user' updated.",
    "",
    "AI: Commander, I must advise against these changes.",
    "AI: System stability may be compromised.",
    "",
    ">> Overwriting variable: Authorization Level = ROOT",
    "System: Authorization level escalated.",
    "",
    "Warning: Core system variables have been modified.",
    "",
    "*** OVERWRITE COMPLETE ***",
  ],
};
