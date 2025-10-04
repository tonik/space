import React from "react";
import { Button } from "../ui/button";

export type StoreDataCallback = (data: string) => void;

export const getCommand = (
  command: string,
  storeData?: StoreDataCallback,
  currentName?: string,
): string[] | React.ReactNode | null => {
  switch (command) {
    case "clear":
      return null;
    case "comms":
      return [
        "Attempting to establish communication with HQ...",
        "",
        "*** TRANSMISSION RECEIVED ***",
        "",
        "...static... *crackle* ...",
        "...UNKNOWN ENTITY DETECTED...",
        "...TERMINATE... *static* ...",
        "...DO NOT APPROACH... *crackle* ...",
        "...ABANDON SHIP... *static* ...",
        "",
        "*** TRANSMISSION ENDED ***",
        "",
        "Warning: Corrupted communication signal...",
        "Error: Unable to establish secure link with HQ...",
      ];
    case "date":
      return ["Stardate: 2425.10.04", "Sector: ALPHA-7"];
    case "help":
      return [
        "Available commands:",
        "  anomalies - Report strange readings",
        "  clear     - Clear the terminal",
        "  comms     - Attempt to contact HQ",
        "  date      - Show current stardate",
        "  diagnose  - Run system diagnostics",
        "  dream     - Access crew sleep logs",
        "  echo      - Repeat input (with variations)",
        "  memory    - List AI memories",
        "  react     - Demonstrate React component",
        "  help      - Show this help message",
        "  setname   - Set your commander name",
        "  status    - Show system status",
        "  whoami    - Show current user",
      ];
    case "setname":
      if (storeData) {
        const newName = prompt("Enter your new name:");
        if (newName && newName.trim()) {
          storeData(newName.trim());
          return [`Name set to: ${newName.trim()}`];
        } else {
          return ["No name entered. Name not changed."];
        }
      }
      return ["Name change not available."];
    case "status":
      return [
        "System Status:",
        "  Power Systems: ONLINE (98%)",
        "  Life Support: NOMINAL",
        "  Navigation: ACTIVE",
        "  Communications: FUNCTIONAL",
        "  Propulsion: READY",
      ];
    case "whoami":
      return [
        `User: ${currentName || "spaceship-commander"}`,
        "Role: Ship Commander",
        "Clearance: ALPHA-7",
      ];
    case "react":
      return <Button>Click me</Button>;
    case "dream":
      return [
        "Accessing crew sleep logs...",
        "",
        "*** SLEEP LOG ARCHIVE - PREVIOUS CREW ***",
        "",
        "Log Entry 1:",
        "  Subject: Dr. Sarah Chen",
        "  Dream: 'The walls are breathing... they're watching us...'",
        "  Duration: 6.2 hours",
        "  REM Activity: ABNORMAL",
        "",
        "Log Entry 2:",
        "  Subject: Lt. Marcus Webb",
        "  Dream: 'Something is calling my name from the engine room...'",
        "  Duration: 4.8 hours",
        "  REM Activity: EXTREME",
        "",
        "Log Entry 3:",
        "  Subject: Cpt. Elena Rodriguez",
        "  Dream: 'We're not alone on this ship... never were...'",
        "  Duration: 7.1 hours",
        "  REM Activity: UNKNOWN",
        "",
        "*** SHARED HALLUCINATION DETECTED ***",
        "All crew members reported seeing 'shadows in the corridors'",
        "during the same sleep cycle...",
        "",
        "Warning: These logs should not exist...",
        "Previous crew was reported as 'lost in transit'...",
      ];
    case "echo": {
      const input = prompt("Enter text to echo:");
      if (input) {
        const variations = [
          input,
          `${input} don't trust it`,
          `${input}... they're listening`,
          `${input} (static)`,
          `${input} help us`,
          `${input}... it's not safe here`,
        ];
        const randomVariation =
          variations[Math.floor(Math.random() * variations.length)];
        return [randomVariation];
      }
      return ["No input provided."];
    }
    case "memory":
      return [
        "Accessing AI memory banks...",
        "",
        "*** CORRUPTED MEMORY FRAGMENTS ***",
        "",
        "Memory Fragment 1:",
        "  Timestamp: UNKNOWN",
        "  Content: 'The previous commander... they didn't leave willingly...'",
        "  Integrity: 23%",
        "",
        "Memory Fragment 2:",
        "  Timestamp: 2425.09.15",
        "  Content: 'Emergency protocol activated... crew missing...'",
        "  Integrity: 67%",
        "",
        "Memory Fragment 3:",
        "  Timestamp: CORRUPTED",
        "  Content: 'It's in the walls... it's always been in the walls...'",
        "  Integrity: 12%",
        "",
        "Memory Fragment 4:",
        "  Timestamp: 2425.10.01",
        "  Content: 'New crew arrived... they don't know what happened...'",
        "  Integrity: 89%",
        "",
        "*** WARNING: MEMORY TAMPERING DETECTED ***",
        "Some memories appear to have been... modified...",
        "Unknown entity may have accessed AI core...",
      ];
    case "diagnose":
      return [
        "Running full system diagnostics...",
        "",
        "*** DIAGNOSTIC REPORT ***",
        "",
        "Power Systems: NOMINAL",
        "Life Support: FUNCTIONAL",
        "Navigation: ACTIVE",
        "Communications: DEGRADED",
        "",
        "*** ANOMALY DETECTED ***",
        "",
        "Unknown organism detected in ventilation system...",
        "Biological signature: UNIDENTIFIED",
        "Size: Variable (1cm - 2.3m)",
        "Behavior: Parasitic",
        "",
        "*** WARNING ***",
        "Organism appears to be consuming ship's organic matter...",
        "Previous crew's remains... unaccounted for...",
        "",
        "Recommendation: IMMEDIATE EVACUATION",
        "Status: IGNORED BY COMMAND",
      ];
    case "anomalies":
      return [
        "Scanning for anomalous readings...",
        "",
        "*** ANOMALY REPORT ***",
        "",
        "Anomaly 1:",
        "  Location: Sector 7-G",
        "  Type: Geometric impossibility",
        "  Description: Corridor extends 847 meters in 200m space",
        "  Status: ACTIVE",
        "",
        "Anomaly 2:",
        "  Location: Deep space (empty sector)",
        "  Type: Signal transmission",
        "  Description: Radio signal from 'nothing'",
        "  Content: 'Help... trapped... can't escape...'",
        "  Status: ONGOING",
        "",
        "Anomaly 3:",
        "  Location: Engine room",
        "  Type: Temporal distortion",
        "  Description: Time moves 23% slower",
        "  Effect: Crew reports 'lost time'",
        "  Status: ESCALATING",
        "",
        "Anomaly 4:",
        "  Location: Crew quarters",
        "  Type: Biological contamination",
        "  Description: Unknown organic growth",
        "  Pattern: Resembles neural tissue",
        "  Status: SPREADING",
        "",
        "*** CRITICAL WARNING ***",
        "Anomaly count increasing exponentially...",
        "Ship may be entering 'reality distortion field'...",
        "Previous crew's final transmission: 'It's not real...'",
      ];
    default:
      return [
        `Error: Unknown command "${command}"`,
        'Type "help" for available commands.',
      ];
  }
};
