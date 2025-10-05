import { useState, useEffect, useRef } from "react";
import { useGame } from "@/state/context";
import { useTerminalState } from "@/components/terminal/selectors";
import { displayLinesWithDelay } from "@/lib/utils";
import { getCommands } from "@/components/terminal/commands";
import { ScrollArea } from "../ui/scroll-area";

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
  const { startGame, trackCommand } = useGame();
  const {
    commanderName,
    commandCounts,
    mission,
    availableCommands,
    commandContent,
  } = useTerminalState();
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "text", content: "Welcome to Spaceship Terminal v2.4.1" },
    { type: "text", content: 'Type "help" for available commands.' },
    { type: "text", content: "" },
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [isPrinting, setIsPrinting] = useState(false);
  const [waitingForInput, setWaitingForInput] = useState<{
    type: string;
    prompt: string;
    callback: (input: string) => string[] | null;
  } | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
      availableCommands,
      commandContent,
      (newName: string) => {
        startGame(newName);
      },
      commanderName,
      (
        type: string,
        prompt: string,
        callback: (input: string) => string[] | null,
      ) => {
        setWaitingForInput({ type, prompt, callback });
        addLine(prompt);
      },
      commandCounts,
      mission,
    );

    if (output) {
      trackCommand(command.toLowerCase());

      if (Array.isArray(output)) {
        const shouldDelay =
          output.length > 3 &&
          (command.toLowerCase() === "sleep log" ||
            command.toLowerCase() === "memories" ||
            command.toLowerCase() === "diagnose" ||
            command.toLowerCase() === "anomalies" ||
            command.toLowerCase() === "comms" ||
            command.toLowerCase() === "weapons" ||
            command.toLowerCase() === "override");

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
    <ScrollArea
      ref={terminalRef}
      className={`${className} bg-background text-primary relative h-full overflow-y-auto font-mono text-sm leading-[1.2] font-[500]`}
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
              className={`text-primary w-full bg-transparent font-mono caret-transparent outline-none ${
                isPrinting ? "opacity-50" : ""
              }`}
              autoFocus
            />
            {!isPrinting && (
              <span
                className="text-primary animate-caret-blink absolute"
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  left: `${currentInput.length * 8.4}px`,
                  textShadow: "0 0 2px var(--primary)",
                }}
              >
                ▊
              </span>
            )}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
