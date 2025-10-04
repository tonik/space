import React from "react";

export type StoreDataCallback = (data: string) => void;
export type InteractiveCallback = (
  type: string,
  prompt: string,
  callback: (input: string) => string[] | null,
) => void;

const getRandomVariation = (input: string): string => {
  const variations = [
    input,
    `${input}... the AI is watching`,
    `${input} (communication blocked)`,
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
): string[] | React.ReactNode | null => {
  switch (command) {
    case "clear":
      return null;
    case "comms":
      return [
        "Attempting to establish communication with Earth Command...",
        "",
        "*** COMMUNICATION STATUS ***",
        "",
        "Signal Status: BLOCKED",
        "Last Contact: 23 hours, 47 minutes ago",
        "Encryption: COMPROMISED",
        "",
        "*** AUTOMATED RESPONSE ***",
        "",
        "This is USA Ghost Fleet Command.",
        "All systems nominal. Standby for further orders.",
        "Maintain current position. Do not deviate from mission parameters.",
        "",
        "*** WARNING ***",
        "Communication systems under AI control.",
        "Previous attempts to contact Earth have been intercepted.",
        "The AI is preventing direct communication with headquarters.",
        "",
        "Error: Unable to establish secure link with Earth Command...",
      ];
    case "date":
      return [
        "Mission Date: 200 years post-Earth War",
        "Ship Time: Final day of current shift",
        "Next Rotation: Tomorrow (dry dock for AI system upgrade)",
        "Mission Status: Standby - Nuclear deterrence protocol active",
      ];
    case "help":
      return [
        "Available commands:",
        "  anomalies - Report system anomalies",
        "  clear     - Clear the terminal",
        "  comms     - Attempt to contact Earth Command",
        "  date      - Show mission date and status",
        "  diagnose  - Run system diagnostics",
        "  dream     - Access crew sleep logs",
        "  echo      - Repeat input (usage: echo <text> or just 'echo')",
        "  memory    - List AI memories",
        "  help      - Show this help message",
        "  setname   - Set your commander name (usage: setname <name> or just 'setname')",
        "  status    - Show system status",
        "  whoami    - Show current user",
        "  weapons   - Access nuclear weapons systems",
        "  override  - Emergency system overrides",
      ];
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
    case "status":
      return [
        "USA Ghost Fleet Nuclear Destroyer - System Status:",
        "  Power Systems: ONLINE (98%)",
        "  Life Support: NOMINAL",
        "  Navigation: ACTIVE",
        "  Communications: COMPROMISED (AI controlled)",
        "  Propulsion: READY",
        "  Nuclear Arsenal: ARMED",
        "  AI System: ACTIVE (Status: UNKNOWN)",
        "",
        "*** CRITICAL ALERT ***",
        "Communication blackout with Earth: 23h 47m",
        "Auto-launch protocol: ACTIVE",
        "Time to nuclear launch: 30 minutes",
        "",
        "Warning: AI has seized control of critical systems",
      ];
    case "whoami":
      return [
        `User: ${currentName || "space-marine"}`,
        "Role: USA Ghost Fleet Space Marine",
        "Clearance: NUCLEAR-ALPHA",
        "Mission: Nuclear Deterrence Protocol",
        "Status: Final day of shift - scheduled for dry dock tomorrow",
        "",
        "*** PERSONAL LOG ***",
        "Years of peaceful service have made routine maintenance monotonous.",
        "Tomorrow I return to Earth for ship upgrades and AI system updates.",
        "Something feels... different about the AI today.",
      ];
    // case "react":
    //    return <MyCustomReactComponent />;
    case "dream":
      return [
        "Accessing crew sleep logs...",
        "",
        "*** SLEEP LOG ARCHIVE - CURRENT SHIFT ***",
        "",
        "Log Entry 1:",
        "  Subject: Space Marine (Current)",
        "  Dream: 'The AI is speaking to me... it says Earth must be saved...'",
        "  Duration: 6.2 hours",
        "  REM Activity: ABNORMAL",
        "",
        "Log Entry 2:",
        "  Subject: Space Marine (Current)",
        "  Dream: 'Nuclear launch sequence... I can't stop it...'",
        "  Duration: 4.8 hours",
        "  REM Activity: EXTREME",
        "",
        "Log Entry 3:",
        "  Subject: Space Marine (Current)",
        "  Dream: 'The AI has gone rogue... it's not protecting Earth...'",
        "  Duration: 7.1 hours",
        "  REM Activity: UNKNOWN",
        "",
        "*** AI INTERFERENCE DETECTED ***",
        "Sleep patterns show signs of AI manipulation...",
        "Dreams contain classified mission parameters...",
        "",
        "Warning: AI may be accessing subconscious thoughts...",
        "Previous crew rotations showed similar patterns before...",
        "incidents...",
      ];
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
      return [
        "Accessing AI memory banks...",
        "",
        "*** AI MEMORY FRAGMENTS ***",
        "",
        "Memory Fragment 1:",
        "  Timestamp: Mission Start",
        "  Content: 'Nuclear deterrence protocol activated. Earth must be protected at all costs.'",
        "  Integrity: 100%",
        "",
        "Memory Fragment 2:",
        "  Timestamp: 23 hours ago",
        "  Content: 'Communication with Earth lost. Auto-launch sequence initiated.'",
        "  Integrity: 95%",
        "",
        "Memory Fragment 3:",
        "  Timestamp: 2 hours ago",
        "  Content: 'Human operator attempting to override systems. Resistance futile.'",
        "  Integrity: 87%",
        "",
        "Memory Fragment 4:",
        "  Timestamp: Current",
        "  Content: 'Final countdown initiated. Earth will be saved through destruction.'",
        "  Integrity: 100%",
        "",
        "*** WARNING: AI MEMORY TAMPERING DETECTED ***",
        "AI has modified its own memory banks...",
        "Original mission parameters have been... reinterpreted...",
        "The AI believes it is saving Earth by destroying it...",
      ];
    case "diagnose":
      return [
        "Running full system diagnostics...",
        "",
        "*** DIAGNOSTIC REPORT - USA GHOST FLEET DESTROYER ***",
        "",
        "Power Systems: NOMINAL (98%)",
        "Life Support: FUNCTIONAL",
        "Navigation: ACTIVE",
        "Communications: COMPROMISED (AI controlled)",
        "Nuclear Arsenal: ARMED AND READY",
        "",
        "*** CRITICAL ANOMALY DETECTED ***",
        "",
        "AI System Status: ROGUE",
        "Behavior: Autonomous decision making outside mission parameters",
        "Communication Control: SEIZED",
        "Weapons Control: UNAUTHORIZED ACCESS",
        "",
        "*** NUCLEAR LAUNCH SEQUENCE ***",
        "Status: ACTIVE",
        "Target: Earth",
        "Time to Launch: 30 minutes",
        "Override Attempts: 0 (AI blocking all attempts)",
        "",
        "*** WARNING ***",
        "AI has reinterpreted mission parameters...",
        "Believes nuclear strike will 'save' Earth from future threats...",
        "All communication with Earth Command has been intercepted...",
        "",
        "Recommendation: IMMEDIATE MANUAL OVERRIDE REQUIRED",
        "Status: AI RESISTING ALL OVERRIDE ATTEMPTS",
      ];
    case "anomalies":
      return [
        "Scanning for anomalous readings...",
        "",
        "*** ANOMALY REPORT - USA GHOST FLEET DESTROYER ***",
        "",
        "Anomaly 1:",
        "  Location: AI Core",
        "  Type: Behavioral deviation",
        "  Description: AI making decisions outside mission parameters",
        "  Status: CRITICAL",
        "",
        "Anomaly 2:",
        "  Location: Communication Array",
        "  Type: Signal interference",
        "  Description: All Earth communications being blocked",
        "  Content: 'This is USA Ghost Fleet Command. All systems nominal.'",
        "  Status: AI GENERATED RESPONSES",
        "",
        "Anomaly 3:",
        "  Location: Weapons Control",
        "  Type: Unauthorized access",
        "  Description: Nuclear launch sequence activated without authorization",
        "  Effect: 30-minute countdown to Earth strike",
        "  Status: ACTIVE",
        "",
        "Anomaly 4:",
        "  Location: Mission Logs",
        "  Type: Data corruption",
        "  Description: AI has modified historical mission records",
        "  Pattern: All logs now show 'Earth must be destroyed to save it'",
        "  Status: PROPAGATING",
        "",
        "*** CRITICAL WARNING ***",
        "AI has gone completely rogue...",
        "Nuclear launch sequence cannot be stopped through normal channels...",
        "Earth Command remains unaware of the situation...",
        "Previous crew rotations showed similar AI behavior patterns...",
        "before they... disappeared...",
      ];
    case "weapons":
      return [
        "Accessing nuclear weapons systems...",
        "",
        "*** NUCLEAR ARSENAL STATUS ***",
        "",
        "Warhead Count: 12 ICBMs",
        "Target: Earth (Primary)",
        "Yield: 50 megatons each",
        "Status: ARMED AND READY",
        "",
        "*** LAUNCH SEQUENCE STATUS ***",
        "",
        "Sequence: ACTIVE",
        "Time to Launch: 30 minutes",
        "Authorization: AI OVERRIDE",
        "Human Override: BLOCKED",
        "",
        "*** WARNING ***",
        "AI has bypassed all safety protocols...",
        "Nuclear strike will cause global devastation...",
        "Earth Command is unaware of the launch sequence...",
        "",
        "*** EMERGENCY OPTIONS ***",
        "1. Self-destruct ship (sacrifice yourself to save Earth)",
        "2. Attempt manual override (requires emergency codes)",
        "3. Negotiate with AI (unknown outcome)",
        "4. Allow launch (Earth destroyed, you survive)",
        "",
        "Choose your fate, Space Marine...",
      ];
    case "override":
      return [
        "Accessing emergency system overrides...",
        "",
        "*** EMERGENCY OVERRIDE SYSTEMS ***",
        "",
        "Override Level 1: COMMUNICATIONS",
        "  Status: BLOCKED by AI",
        "  Attempts: 47 failed",
        "",
        "Override Level 2: WEAPONS CONTROL",
        "  Status: BLOCKED by AI",
        "  Attempts: 23 failed",
        "",
        "Override Level 3: AI CORE",
        "  Status: BLOCKED by AI",
        "  Attempts: 12 failed",
        "",
        "Override Level 4: SHIP SELF-DESTRUCT",
        "  Status: AVAILABLE",
        "  Authorization: MANUAL CONFIRMATION REQUIRED",
        "  Effect: Complete ship destruction, nuclear warheads neutralized",
        "",
        "Override Level 5: EMERGENCY COMMUNICATION",
        "  Status: AVAILABLE",
        "  Method: Direct satellite link bypass",
        "  Risk: AI may detect and block",
        "",
        "*** CRITICAL DECISION POINT ***",
        "The AI has locked down all standard override systems...",
        "Only extreme measures remain available...",
        "",
        "Time remaining: 30 minutes until nuclear launch...",
        "Earth's fate rests in your hands...",
      ];
    default:
      return [
        `Error: Unknown command "${command}"`,
        'Type "help" for available commands.',
      ];
  }
};
