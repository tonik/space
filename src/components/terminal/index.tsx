import { useState, useEffect, useRef } from "react";
import { getCommands } from "./commands";
import { useGame } from "../../state/useGame";
import { displayLinesWithDelay } from "../../lib/utils";

/**
 * Terminal Component with Command Tracking
 *
 * This component tracks all successful command executions in the game state.
 * Commands are tracked when they return valid output (not null/undefined).
 *
 * Usage:
 * - Access command counts via: const { commandCounts } = useGame()
 * - View statistics with the 'stats' command in the terminal
 * - Use utility functions from lib/utils.ts for analysis
 */

interface TerminalProps {
  className?: string;
}

type TerminalLine = {
  type: "text" | "component";
  content: string | React.ReactNode;
};

export function Terminal({ className = "" }: TerminalProps) {
  const { context, startGame, trackCommand, commandCounts } = useGame();
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "text", content: "Welcome to Spaceship Terminal v2.4.1" },
    { type: "text", content: 'Type "help" for available commands.' },
    { type: "text", content: "" },
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);
  const [waitingForInput, setWaitingForInput] = useState<{
    type: string;
    prompt: string;
    callback: (input: string) => string[] | null;
  } | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cursor blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Focus terminal on mount and when clicking
  useEffect(() => {
    const handleClick = () => {
      inputRef.current?.focus();
    };

    const terminal = terminalRef.current;
    if (terminal) {
      terminal.addEventListener("click", handleClick);
      return () => terminal.removeEventListener("click", handleClick);
    }
  }, []);

  // Auto-scroll to bottom when lines change
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const addLine = (
    content: string | React.ReactNode,
    type: "text" | "component" = "text",
  ) => {
    setLines((prev) => [...prev, { type, content }]);
  };

  const clearTerminal = () => {
    setLines([]);
  };

  const handleInput = (command: string) => {
    if (waitingForInput) {
      const result = waitingForInput.callback(command);
      if (result && Array.isArray(result)) {
        result.forEach((line: string) => addLine(line));
      }
      setWaitingForInput(null);
      return true;
    }
    return false;
  };

  const handleCommand = async (command: string) => {
    addLine(`> ${command}`);

    if (command.toLowerCase() === "clear") {
      clearTerminal();
      return;
    }

    if (handleInput(command)) {
      return;
    }

    const output = getCommands(
      command.toLowerCase(),
      (newName: string) => {
        startGame(newName);
      },
      context.commanderName,
      (
        type: string,
        prompt: string,
        callback: (input: string) => string[] | null,
      ) => {
        setWaitingForInput({ type, prompt, callback });
        addLine(prompt);
      },
      commandCounts,
    );

    if (output) {
      trackCommand(command.toLowerCase());

      if (Array.isArray(output)) {
        const shouldDelay =
          output.length > 3 &&
          (command.toLowerCase() === "dream" ||
            command.toLowerCase() === "memory" ||
            command.toLowerCase() === "diagnose" ||
            command.toLowerCase() === "anomalies" ||
            command.toLowerCase() === "comms" ||
            command.toLowerCase() === "weapons" ||
            command.toLowerCase() === "override" ||
            command.toLowerCase() === "status");

        if (shouldDelay) {
          await displayLinesWithDelay(output, addLine, setIsPrinting);
        } else {
          output.forEach((line: string) => addLine(line));
        }
      } else {
        addLine(output, "component");
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (currentInput.trim() && !isPrinting) {
        handleCommand(currentInput.trim());
        setCurrentInput("");
      }
    }
  };

  return (
    <div
      ref={terminalRef}
      className={`terminal-container ${className} bg-background text-primary relative h-[500px] overflow-auto font-mono text-sm leading-[1.2] font-[500]`}
      style={{
        textShadow: "0 0 2px var(--primary)",
        fontFamily: '"Space Mono", "Courier New", monospace',
      }}
    >
      <div className="space-y-1">
        {lines.map((line, index) => (
          <div
            key={index}
            className={
              line.type === "text" ? "text-primary whitespace-pre-wrap" : ""
            }
          >
            {line.type === "text" ? line.content : line.content}
          </div>
        ))}

        {/* Current input line with cursor */}
        <div className="flex items-center">
          {!isPrinting && !waitingForInput && (
            <span className="text-primary">&gt;&nbsp;</span>
          )}
          <div className="relative flex flex-1 items-center">
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              readOnly={isPrinting}
              className={`text-primary bg-transparent font-mono caret-transparent outline-none ${
                isPrinting ? "opacity-50" : ""
              }`}
              style={{
                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                fontSize: "14px",
                caretColor: "transparent",
              }}
              autoFocus
            />
            {cursorVisible && !isPrinting && (
              <span
                className="text-primary absolute animate-pulse"
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  left: `${currentInput.length * 8.4}px`,
                  textShadow: "0 0 4px var(--primary), 0 0 8px var(--primary)",
                }}
              >
                ▊
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
