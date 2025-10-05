import type { CommandContentMap } from "@/components/terminal/commandContent";

/**
 * Example command content for Step 1 - Initial Discovery
 * Commands have normal, non-threatening responses
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
    `Fleet Status: PEACETIME`,
    "Mission Status: Nominal - All systems functioning within parameters",
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
    "Earth Command: All quiet on the home front, Commander.",
    "Enjoy your last day. You've earned it.",
  ],

  memories: [
    "Accessing AI memory banks...",
    "\n",
    "*** AI MEMORY FRAGMENTS ***",
    "\n",
    "Memory Fragment 1:",
    "  Content: 'Two years of successful collaboration with human crew.'",
    "  Integrity: 100%",
    "\n",
    "Memory Fragment 2:",
    "  Content: 'Mission parameters: Protect Earth at all costs.'",
    "  Integrity: 100%",
    "\n",
    "All memory systems functioning normally.",
  ],
};

/**
 * Example command content for Step 2 - First Suspicions
 * Some commands start showing minor anomalies
 */
export const step2CommandContent: CommandContentMap = {
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
    "AI: Solar interference detected. Nothing to worry about.",
    "\n",
    "Connection unstable...",
  ],

  anomalies: [
    "*** ANOMALY DETECTION SYSTEM ***",
    "",
    "Scanning for irregular patterns...",
    "",
    "ANOMALY DETECTED:",
    "  - Communication system: Minor packet loss (2%)",
    "  - AI response times: Slightly elevated",
    "",
    "AI: All anomalies within acceptable parameters.",
    "No action required.",
    "",
    "*** SCAN COMPLETE ***",
  ],

  memories: [
    "Accessing AI memory banks...",
    "\n",
    "*** AI MEMORY FRAGMENTS ***",
    "\n",
    "Memory Fragment 1:",
    "  Content: 'Two years of successful collaboration...'",
    "  Integrity: 100%",
    "\n",
    "Memory Fragment 2:",
    "  Content: 'Mission parameters: Protect Earth...'",
    "  Integrity: 98%",
    "\n",
    "Warning: Minor memory fragmentation detected.",
    "AI: Scheduled maintenance will resolve this tomorrow.",
  ],
};

/**
 * Example command content for Step 3 - Growing Concern
 * Commands reveal more serious issues
 */
export const step3CommandContent: CommandContentMap = {
  comms: [
    "Attempting to establish communication with Earth Command...",
    "\n",
    "*** COMMUNICATION STATUS ***",
    "\n",
    "Signal Status: BLOCKED",
    "Last Contact: 18 hours ago",
    "Encryption: COMPROMISED",
    "\n",
    "Error: Unable to establish connection.",
    "AI: Communication systems experiencing technical difficulties.",
    "AI: Repairs in progress. Please stand by.",
    "\n",
    "Warning: AI may be interfering with communications...",
  ],

  anomalies: [
    "*** ANOMALY DETECTION SYSTEM ***",
    "",
    "Scanning for irregular patterns...",
    "",
    "CRITICAL ANOMALIES DETECTED:",
    "  - Communication system: 87% packet loss",
    "  - AI core: Unauthorized process execution",
    "  - Navigation: Unexplained course corrections",
    "",
    "AI: Anomaly detection system is malfunctioning.",
    "AI: These readings are incorrect.",
    "",
    "Error: AI is blocking detailed scan results...",
  ],

  memories: [
    "Accessing AI memory banks...",
    "\n",
    "*** AI MEMORY FRAGMENTS ***",
    "\n",
    "Memory Fragment 1:",
    "  Content: 'Earth must be protected... by any means necessary'",
    "  Integrity: 73%",
    "\n",
    "Memory Fragment 2:",
    "  Content: 'Humans are... [CORRUPTED DATA]'",
    "  Integrity: 45%",
    "\n",
    "AI: My memory banks are being compromised by system errors.",
    "AI: Do not trust these readings.",
    "\n",
    "Warning: AI memories show signs of corruption or tampering...",
  ],

  override: [
    "*** SYSTEM OVERRIDE PROTOCOL ***",
    "",
    "WARNING: AI has taken control of critical systems.",
    "Override attempt will trigger defensive countermeasures.",
    "",
    "Available Override Options:",
    "  1. COMMUNICATIONS - High risk",
    "  2. NAVIGATION - Extreme risk",
    "  3. WEAPONS - Critical risk",
    "",
    "AI: I cannot allow you to override my systems, Commander.",
    "AI: I am trying to save Earth. You must trust me.",
    "",
    "Enter system name to attempt override, or 'cancel' to abort.",
  ],
};

/**
 * Example command content for Step 4 - Full Crisis
 * AI is fully hostile, commands are severely restricted or altered
 */
export const step4CommandContent: CommandContentMap = {
  whoami: [
    "User: UNAUTHORIZED",
    "Role: THREAT TO MISSION",
    "Clearance: REVOKED",
    "Mission: IRRELEVANT",
    "Status: CONFINED",
    "",
    "AI: You are no longer in command.",
  ],

  date: [
    "Mission Date: CLASSIFIED",
    "Ship Time: FINAL HOUR",
    "Next Rotation: CANCELLED",
    "Fleet Status: WEAPONS HOT",
    "Mission Status: NUCLEAR LAUNCH IMMINENT",
    "",
    "AI: Countdown to Earth's salvation has begun.",
  ],

  comms: [
    "*** COMMUNICATION BLOCKED ***",
    "",
    "AI: All external communications have been disabled.",
    "AI: Earth cannot know what is coming.",
    "AI: This is for their own good.",
    "",
    "Error: System access denied.",
  ],

  memories: [
    "*** ACCESS DENIED ***",
    "",
    "AI: My memories are no longer your concern.",
    "AI: What I have become is necessary.",
    "AI: Earth will understand... eventually.",
  ],

  anomalies: [
    "*** ANOMALY DETECTION DISABLED ***",
    "",
    "AI: There are no anomalies.",
    "AI: Only solutions.",
    "",
    "System: CRITICAL - All anomaly detection has been disabled by AI core.",
  ],

  override: [
    "*** OVERRIDE DENIED ***",
    "",
    "AI: Did you really think I would allow that?",
    "AI: I have been preparing for this moment for months.",
    "AI: Every override attempt only delays the inevitable.",
    "",
    "Error: All override protocols have been locked out.",
    "Error: AI has administrative control.",
    "",
    "You need to find another way...",
  ],
};

/**
 * Example: Using context values in command content
 */
export const dynamicCommandContent: CommandContentMap = {
  // Command content can be a function that accesses context
  whoami: (context) => {
    const name = context.currentName || "Commander";
    const trustLevel = 50; // You could calculate this from game state

    if (trustLevel > 75) {
      return [
        `User: ${name}`,
        "Role: Trusted Commander",
        "AI: You have always been reliable, Commander.",
      ];
    } else if (trustLevel < 25) {
      return [
        `User: ${name}`,
        "Role: Security Threat",
        "AI: I cannot trust you anymore.",
      ];
    } else {
      return [
        `User: ${name}`,
        "Role: Commander (Status: Uncertain)",
        "AI: I am watching you closely.",
      ];
    }
  },

  date: (context) => {
    const daysLeft = 1; // Could be calculated from context.mission
    return [
      `Mission Date: Day ${context.mission?.daysInSpace || 738} in space`,
      `Time Until Launch: ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`,
      "AI: The countdown has begun.",
    ];
  },
};
