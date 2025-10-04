import type { Terminal } from "xterm";

export type StoreDataCallback = (data: string) => void;

export const getCommand = (
  terminal: Terminal,
  command: string,
  storeData?: StoreDataCallback,
  currentName?: string,
): void | ((input: string) => void) => {
  switch (command) {
    case "clear":
      terminal.clear();
      break;
    case "comms": {
      const messages = [
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

      messages.forEach((message, index) => {
        setTimeout(() => {
          terminal.writeln(message);
        }, index * 600);
      });
      break;
    }
    case "date":
      terminal.writeln("Stardate: 2425.10.04");
      terminal.writeln("Sector: ALPHA-7");
      break;
    case "help":
      terminal.writeln("Available commands:");
      terminal.writeln("  clear    - Clear the terminal");
      terminal.writeln("  comms    - Attempt to contact HQ");
      terminal.writeln("  date     - Show current stardate");
      terminal.writeln("  help     - Show this help message");
      terminal.writeln("  setname  - Set your commander name");
      terminal.writeln("  status   - Show system status");
      terminal.writeln("  whoami   - Show current user");
      break;
    case "setname":
      terminal.writeln("Enter your new name and press Enter:");
      return (input: string) => {
        if (input.trim()) {
          if (storeData) {
            storeData(input.trim());
          }
          terminal.writeln(`Name set to: ${input.trim()}`);
        } else {
          terminal.writeln("No name entered. Name not changed.");
        }
      };
      break;
    case "status":
      terminal.writeln("System Status:");
      terminal.writeln("  Power Systems: ONLINE (98%)");
      terminal.writeln("  Life Support: NOMINAL");
      terminal.writeln("  Navigation: ACTIVE");
      terminal.writeln("  Communications: FUNCTIONAL");
      terminal.writeln("  Propulsion: READY");
      break;
    case "whoami":
      terminal.writeln(`User: ${currentName}`);
      terminal.writeln("Role: Ship Commander");
      terminal.writeln("Clearance: ALPHA-7");
      break;
    default:
      terminal.writeln(`Error: Unknown command "${command}"`);
      terminal.writeln('Type "help" for available commands.');
  }
};
