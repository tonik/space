import { useEffect, useRef } from "react";
import { Terminal as XTerm } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import { getCommand } from "./commands";

interface TerminalProps {
  className?: string;
  onNameChange?: (name: string) => void;
  currentName?: string;
}

export function Terminal({
  className = "",
  onNameChange,
  currentName,
}: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const currentNameRef = useRef<string>(currentName || "spaceship-commander");

  useEffect(() => {
    if (!terminalRef.current) return;

    const terminal = new XTerm({
      theme: {
        background: "#000000",
        foreground: "#00ff41",
        cursor: "#00ff41",
        black: "#000000",
        red: "#ff0000",
        green: "#00ff41",
        yellow: "#ffff00",
        blue: "#0000ff",
        magenta: "#ff00ff",
        cyan: "#00ffff",
        white: "#ffffff",
        brightBlack: "#666666",
        brightRed: "#ff6666",
        brightGreen: "#66ff66",
        brightYellow: "#ffff66",
        brightBlue: "#6666ff",
        brightMagenta: "#ff66ff",
        brightCyan: "#66ffff",
        brightWhite: "#ffffff",
      },
      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
      fontSize: 14,
      lineHeight: 1.2,
      cursorBlink: true,
      cursorStyle: "block",
      scrollback: 1000,
    });

    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    terminal.open(terminalRef.current);
    fitAddon.fit();

    // Initial welcome message
    terminal.writeln("Welcome to Spaceship Terminal v2.4.1");
    terminal.writeln('Type "help" for available commands.');
    terminal.writeln("");

    let currentLine = "";
    let cursorPosition = 0;
    let pendingInputHandler: ((input: string) => void) | null = null;

    const writePrompt = () => {
      terminal.write("\r\n> ");
      currentLine = "";
      cursorPosition = 0;
    };

    const handleInput = (data: string) => {
      const code = data.charCodeAt(0);

      if (code === 13) {
        // Enter key
        terminal.write("\r\n");

        if (currentLine.trim()) {
          if (pendingInputHandler) {
            // Input mode
            pendingInputHandler(currentLine.trim());
            pendingInputHandler = null;
          } else {
            // Normal command mode
            handleCommand(currentLine.trim());
          }
        }

        writePrompt();
      } else if (code === 127) {
        // Backspace
        if (cursorPosition > 0) {
          terminal.write("\b \b");
          currentLine = currentLine.slice(0, -1);
          cursorPosition--;
        }
      } else if (code >= 32 && code <= 126) {
        // Printable characters
        terminal.write(data);
        currentLine += data;
        cursorPosition++;
      }
    };

    const handleCommand = (command: string) => {
      const result = getCommand(
        terminal,
        command.toLowerCase(),
        onNameChange,
        currentNameRef.current,
      );
      if (typeof result === "function") {
        pendingInputHandler = result;
      }
    };

    terminal.onData(handleInput);

    writePrompt();

    xtermRef.current = terminal;

    const handleResize = () => {
      fitAddon.fit();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      terminal.dispose();
    };
  }, [onNameChange]);

  // Update the ref when currentName changes without recreating the terminal
  useEffect(() => {
    currentNameRef.current = currentName || "spaceship-commander";
  }, [currentName]);

  return (
    <div
      ref={terminalRef}
      className={`terminal-container ${className}`}
      style={{ height: "500px", width: "100%" }}
    />
  );
}
