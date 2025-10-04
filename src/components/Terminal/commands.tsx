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
        "  clear    - Clear the terminal",
        "  comms    - Attempt to contact HQ",
        "  date     - Show current stardate",
        "  react     - Demonstrate React component",
        "  help     - Show this help message",
        "  setname  - Set your commander name",
        "  status   - Show system status",
        "  whoami   - Show current user",
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
    default:
      return [
        `Error: Unknown command "${command}"`,
        'Type "help" for available commands.',
      ];
  }
};
