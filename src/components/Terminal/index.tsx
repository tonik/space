import { useState, useEffect, useRef } from "react";
import { getCommand } from "./commands.tsx";

interface TerminalProps {
  className?: string;
  onNameChange?: (name: string) => void;
  currentName?: string;
}

type TerminalLine = {
  type: "text" | "component";
  content: string | React.ReactNode;
};

export function Terminal({
  className = "",
  onNameChange,
  currentName,
}: TerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "text", content: "Welcome to Spaceship Terminal v2.4.1" },
    { type: "text", content: 'Type "help" for available commands.' },
    { type: "text", content: "" },
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);
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

  const addLinesWithDelay = async (lines: string[]) => {
    setIsPrinting(true);
    for (let i = 0; i < lines.length; i++) {
      addLine(lines[i]);
      if (i < lines.length - 1) {
        // Random delay between 500ms and 700ms
        const randomDelay = Math.floor(Math.random() * 201) + 500;
        await new Promise((resolve) => setTimeout(resolve, randomDelay));
      }
    }
    setIsPrinting(false);
  };

  const handleCommand = async (command: string) => {
    addLine(`> ${command}`);

    if (command.toLowerCase() === "clear") {
      clearTerminal();
      return;
    }

    const output = getCommand(command.toLowerCase(), onNameChange, currentName);
    if (output) {
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
          await addLinesWithDelay(output);
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
      className={`terminal-container ${className} bg-black text-[#00ff41] font-mono text-sm leading-[1.2] overflow-auto h-[500px] border border-[#00ff41]`}
    >
      <div className="p-4 space-y-1">
        {lines.map((line, index) => (
          <div
            key={index}
            className={
              line.type === "text" ? "whitespace-pre-wrap text-[#00ff41]" : ""
            }
          >
            {line.type === "text" ? line.content : line.content}
          </div>
        ))}

        {/* Current input line with cursor */}
        <div className="flex items-center">
          {!isPrinting && <span className="text-[#00ff41]">&gt;&nbsp;</span>}
          <div className="flex items-center flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              readOnly={isPrinting}
              className={`bg-transparent text-[#00ff41] outline-none font-mono caret-transparent ${
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
                className="text-[#00ff41] absolute"
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  left: `${currentInput.length * 8.4}px`,
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
