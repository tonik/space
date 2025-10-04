import type { Terminal } from "xterm";

export const getCommand = (terminal: Terminal, command: string) => {
  switch (command) {
    case "help":
      terminal.writeln("Available commands:");
      terminal.writeln("  help     - Show this help message");
      terminal.writeln("  status   - Show system status");
      terminal.writeln("  clear    - Clear the terminal");
      terminal.writeln("  date     - Show current stardate");
      terminal.writeln("  whoami   - Show current user");
      break;
    case "status":
      terminal.writeln("System Status:");
      terminal.writeln("  Power Systems: ONLINE (98%)");
      terminal.writeln("  Life Support: NOMINAL");
      terminal.writeln("  Navigation: ACTIVE");
      terminal.writeln("  Communications: FUNCTIONAL");
      terminal.writeln("  Propulsion: READY");
      break;
    case "clear":
      terminal.clear();
      break;
    case "date":
      terminal.writeln("Stardate: 2425.10.04");
      terminal.writeln("Sector: ALPHA-7");
      break;
    case "whoami":
      terminal.writeln("User: spaceship-commander");
      terminal.writeln("Role: Ship Commander");
      terminal.writeln("Clearance: ALPHA-7");
      break;
    default:
      terminal.writeln(`error: unknown command "${command}"`);
      terminal.writeln('Type "help" for available commands.');
  }
};
