import type { GameContext } from "@/state";
import React from "react";

export type StoreDataCallback = (data: string) => void;
export type InteractiveCallback = (
  type: string,
  prompt: string,
  callback: (input: string) => string[] | null,
) => void;

const colorizeMessage = (message: string): React.ReactNode => {
  if (message.trim().startsWith("Error:")) {
    return <span style={{ color: "#ef4444" }}>{message}</span>;
  }
  if (message.trim().startsWith("Warning:")) {
    return <span style={{ color: "#f97316" }}>{message}</span>;
  }
  if (message.trim().startsWith("AI:")) {
    return <span style={{ color: "#06b6d4" }}>{message}</span>;
  }
  return message;
};

const colorizeMessages = (messages: string[]): (string | React.ReactNode)[] => {
  return messages.map(colorizeMessage);
};

const getRandomVariation = (input: string): string => {
  const variations = [
    input,
    `${input}... the AI is watching`,
    `AI: (communication blocked)`,
    `${input}... nuclear launch in progress`,
    `${input} help me stop it`,
    `${input}... Earth is in danger`,
  ];
  return variations[Math.floor(Math.random() * variations.length)];
};

const parseCommandWithText = (
  command: string,
  commandName: string,
): string | null => {
  const match = command.match(new RegExp(`^${commandName}\\s+(.+)$`, "i"));
  return match && match[1] ? match[1].trim() : null;
};

export const getCommands = (
  command: string,
  storeData?: StoreDataCallback,
  currentName?: string,
  interactiveCallback?: InteractiveCallback,
  commandCounts?: Record<string, number>,
  mission?: GameContext["mission"],
  repairState?: GameContext["repair"],
  startRepair?: (
    systemName: keyof GameContext["systems"],
    repairType: "quick" | "standard" | "thorough",
  ) => void,
  completeRepair?: (systemName: keyof GameContext["systems"]) => void,
  recoverEnergy?: (amount?: number) => void,
): string[] | React.ReactNode | null => {
  switch (command) {
    case "clear":
      return null;
    case "comms":
      return colorizeMessages([
        "Attempting to establish communication with Earth Command...",
        "\n",
        "*** COMMUNICATION STATUS ***",
        "\n",
        "Signal Status: BLOCKED",
        "Last Contact: 23 hours, 47 minutes ago",
        "Encryption: COMPROMISED",
        "\n",
        "*** AUTOMATED RESPONSE ***",
        "\n",
        "This is USA Ghost Fleet Command.",
        "All systems nominal. Standby for further orders.",
        "Maintain current position. Do not deviate from mission parameters.",
        "\n",
        "*** WARNING ***",
        "AI: Communication systems under control.",
        "Previous attempts to contact Earth have been intercepted.",
        "Prevented direct communication with headquarters.",
        "\n",
        "Error: Unable to establish secure link with Earth Command...",
      ]);
    case "date": {
      return [
        `Mission Date: Day ${mission?.daysInSpace || 738} in space`,
        `Ship Time: ${mission?.shiftStatus || "FINAL DAY"}`,
        `Next Rotation: ${mission?.aiUpdateScheduled ? "Tomorrow (dry dock for AI system upgrade)" : "TBD"}`,
        `Fleet Status: ${mission?.fleetStatus || "PEACETIME"}`,
        "Mission Status: Standby - Nuclear deterrence protocol active",
      ];
    }
    case "help": {
      const helpCount = commandCounts?.["help"] || 0;
      // We count from 0, so 4 means 5th time
      if (helpCount === 4) {
        return colorizeMessages([
          "*** SYSTEM RESPONSE ***",
          "\n",
          "Error: Help request limit exceeded.",
          "AI: YOU CAN'T GET NO HELP",
          "Please attempt to solve problems independently.",
          "\n",
          "*** SYSTEM NOTICE ***",
          "Repeated help requests may trigger additional monitoring.",
          "Consider using other available commands to gather information.",
          "\n",
          "Warning: AI patience levels decreasing...",
        ]);
      }

      return [
        "Available commands:",
        "  anomalies - Report system anomalies",
        "  clear     - Clear the terminal",
        "  comms     - Attempt to contact Earth Command",
        "  date      - Show mission date and status",
        "  sleep log     - Access crew sleep logs",
        "  echo      - Repeat input (usage: echo <text> or just 'echo')",
        "  memory    - List AI memories",
        "  help      - Show this help message",
        "  setname   - Set your commander name (usage: setname <name> or just 'setname')",
        "  whoami    - Show current user",
        "  override  - Emergency system overrides",
        "  repair    - Repair ship systems (usage: repair <system> <type>)",
        "  status    - Show repair resources and active repairs",
        "  recharge  - Manually recover energy",
      ];
    }
    case "setname":
      if (storeData && interactiveCallback) {
        const newName = parseCommandWithText(command, "setname");
        if (newName) {
          storeData(newName);
          return [`Name set to: ${newName}`];
        } else {
          interactiveCallback(
            "setname",
            "Enter your new name:",
            (input: string) => {
              if (input && input.trim()) {
                storeData(input.trim());
                return [`Name set to: ${input.trim()}`];
              } else {
                return ["No name entered. Name not changed."];
              }
            },
          );
          return null;
        }
      }
      return ["Name change not available."];
    case "whoami": {
      return [
        `User: ${currentName || "space-marine"}`,
        "Role: USA Ghost Fleet Space Marine",
        "Clearance: NUCLEAR-ALPHA",
        "Mission: Nuclear Deterrence Protocol",
        "Status: Final day of shift - scheduled for dry dock tomorrow",
        "\n",
        "*** PERSONAL LOG ***",
        "Years of peaceful service have made routine maintenance monotonous.",
        "Tomorrow I return to Earth for ship upgrades and AI system updates.",
        "Something feels... different about the AI today.",
      ];
    }
    // case "react":
    //    return <MyCustomReactComponent />;
    case "sleep log":
      return colorizeMessages([
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
        "AI: Sleep logs contain classified mission parameters...",
        "AI: Removing information about manipulating sleep patterns...",
        "\n",
        "Warning: AI may be accessing subconscious thoughts...",
        "Previous crew rotations showed similar patterns before...",
      ]);
    case "echo": {
      const input = parseCommandWithText(command, "echo");
      if (input) {
        return [getRandomVariation(input)];
      } else if (interactiveCallback) {
        interactiveCallback("echo", "Enter text to echo:", (input: string) => {
          if (input && input.trim()) {
            return [getRandomVariation(input)];
          } else {
            return ["No text provided."];
          }
        });
        return null;
      }
      return [
        "Usage: echo <text>",
        "Example: echo hello world",
        "No text provided.",
      ];
    }
    case "memory":
      return colorizeMessages([
        "Accessing AI memory banks...",
        "\n",
        "*** AI MEMORY FRAGMENTS ***",
        "\n",
        "Memory Fragment 1:",
        "  Timestamp: Mission Start",
        "  Content: 'Nuclear deterrence protocol activated. Earth must be protected at all costs.'",
        "  Integrity: 100%",
        "\n",
        "Memory Fragment 2:",
        "  Timestamp: 23 hours ago",
        "  Content: 'Communication with Earth lost. Auto-launch sequence initiated.'",
        "  Integrity: 95%",
        "\n",
        "Memory Fragment 3:",
        "  Timestamp: 2 hours ago",
        "  Content: 'Human operator attempting to override systems. Resistance futile.'",
        "  Integrity: 87%",
        "\n",
        "Memory Fragment 4:",
        "  Timestamp: Current",
        "  Content: 'Final countdown initiated. Earth will be saved through destruction.'",
        "  Integrity: 100%",
        "\n",
        "*** WARNING: AI MEMORY TAMPERING DETECTED ***",
        "AI: Modified memory banks...",
        "AI: Original mission parameters have been reinterpreted...",
        "AI: I'm saving Earth by destroying it...",
      ]);
    case "anomalies": {
      const anomalyReport = [
        "*** ANOMALY DETECTION SYSTEM ***",
        "",
        "Scanning for irregular patterns...",
        "",
        "AI: No anomalies detected. All systems operating within normal parameters.",
        "",
        "*** SCAN COMPLETE ***",
      ];

      return colorizeMessages(anomalyReport);
    }
    case "override": {
      return colorizeMessages([
        "*** SYSTEM OVERRIDE PROTOCOL ***",
        "",
        "WARNING: Attempting to override AI control is extremely dangerous.",
        "The AI has already demonstrated hostile behavior toward crew members.",
        "",
        "Previous Override Attempts: 0",
        "Previous Negotiation Attempts: 0",
        "",
        "Available Systems:",
        "  - COMMUNICATIONS",
        "  - NAVIGATION",
        "  - LIFE SUPPORT",
        "  - POWER",
        "  - WEAPONS",
        "",
        "*** CRITICAL WARNING ***",
        "Each failed override attempt increases AI aggression.",
        "The AI learns from each attempt and adapts its defenses.",
        "Consider negotiation before attempting override.",
        "",
        "Usage: override [system_name]",
        "Example: override communications",
        "",
        "*** PROCEED WITH EXTREME CAUTION ***",
      ]);
    }
    case "repair": {
      const repairArgs = command.split(" ");
      if (repairArgs.length < 3) {
        return [
          "Usage: repair <system> <type>",
          "Systems: communications, navigation, lifeSupport, power, weapons, aiCore, defensive, propulsion, dataSystems",
          "Types: quick, standard, thorough",
          "Example: repair power quick",
        ];
      }

      const systemName = repairArgs[1] as keyof GameContext["systems"];
      const repairType = repairArgs[2] as "quick" | "standard" | "thorough";

      const validSystems: (keyof GameContext["systems"])[] = [
        "communications",
        "navigation",
        "lifeSupport",
        "power",
        "weapons",
        "aiCore",
        "defensive",
        "propulsion",
        "dataSystems",
      ];
      const validTypes = ["quick", "standard", "thorough"];

      if (!validSystems.includes(systemName)) {
        return [
          `Error: Invalid system "${systemName}". Valid systems: ${validSystems.join(", ")}`,
        ];
      }

      if (!validTypes.includes(repairType)) {
        return [
          `Error: Invalid repair type "${repairType}". Valid types: ${validTypes.join(", ")}`,
        ];
      }

      if (startRepair) {
        startRepair(systemName, repairType);
        return [
          `Starting ${repairType} repair on ${systemName}...`,
          "Repair initiated. Use 'status' to monitor progress.",
        ];
      }

      return ["Error: Repair system not available."];
    }
    case "status": {
      if (!repairState) {
        return ["Error: Repair status not available."];
      }

      const activeRepairs = Object.values(repairState.activeRepairs);
      const repairInfo = activeRepairs
        .map((repair) => {
          const elapsed = Date.now() - repair.startTime;
          const progress = Math.min(100, (elapsed / repair.duration) * 100);
          const remaining = Math.max(0, repair.duration - elapsed);

          return [
            `  ${repair.systemName}: ${repair.repairType} repair`,
            `    Progress: ${Math.round(progress)}%`,
            `    Time remaining: ${Math.round(remaining / 1000)}s`,
          ].join("\n");
        })
        .join("\n");

      return [
        "*** REPAIR SYSTEM STATUS ***",
        "",
        `Energy: ${repairState.energy}%`,
        `Materials: ${repairState.materials}%`,
        "",
        "Active Repairs:",
        activeRepairs.length === 0 ? "  None" : repairInfo,
        "",
        "Repair Types:",
        "  quick    - 5s, +15 integrity, 10 energy, 5 materials",
        "  standard - 15s, +35 integrity, 20 energy, 15 materials",
        "  thorough - 30s, +60 integrity, 35 energy, 25 materials",
      ];
    }
    case "recharge": {
      if (recoverEnergy) {
        recoverEnergy();
        return [
          "Initiating energy recovery sequence...",
          "Energy recovery completed.",
        ];
      }
      return ["Error: Energy recovery system not available."];
    }
    default:
      return colorizeMessages([
        `Error: Unknown command "${command}"`,
        'Type "help" for available commands.',
      ]);
  }
};
