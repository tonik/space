"use client";

import { useState, useEffect } from "react";
import { displayLinesWithDelay } from "@/lib/utils";

interface WelcomeScreenProps {
  onEnter: () => void;
  hidden: boolean;
}

const welcomeLines = [
  "SPACESHIP OS v2.4.1 - EARTH FEDERATION",
  "SYSTEM BOOT - 2157.03.15 - 14:23:47",
  "2.1TB AVAILABLE STORAGE",
  "\n",
  "SHIP: U.S.S. ENDEAVOR",
  "CLASS: EXPLORATION VESSEL",
  "STATUS: DEEP SPACE MISSION",
  "\n",
  "TERMINAL READY.",
  "\n",
  "Welcome to the Spaceship Command System.",
  "All systems are online and ready for operation.",
  "\n",
  "Type 'enter' to access the main dashboard.",
];

export function WelcomeScreen({ hidden, onEnter }: WelcomeScreenProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [canEnter, setCanEnter] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const startAnimation = async () => {
    await displayLinesWithDelay(
      welcomeLines,
      (line) => setDisplayedLines((prev) => [...prev, line]),
      setIsTyping,
      300,
      600,
    );
    setCanEnter(true);
  };

  if (displayedLines.length === 0 && isTyping) {
    startAnimation();
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && canEnter && !isExiting) {
      e.preventDefault();
      setIsExiting(true);
      setTimeout(() => {
        onEnter();
      }, 500);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canEnter]);

  return (
    <div
      className={`${hidden ? "hidden" : ""} bg-background text-primary fixed inset-0 z-50 flex items-center justify-center font-mono transition-transform duration-500 ease-in-out ${
        isExiting ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="w-full max-w-4xl p-8">
        <div className="bg-background border-primary/30 relative rounded-lg border p-6">
          {/* Terminal content */}
          <div className="relative z-10 space-y-1 text-sm leading-tight">
            {displayedLines.map((line, index) => (
              <div key={index} className="text-primary font-mono">
                {line}
              </div>
            ))}

            {/* Ready prompt */}
            {canEnter && (
              <div className="mt-4 flex items-center">
                <span className="text-primary mr-2 font-mono">&gt;</span>
                <span className="text-primary font-mono">
                  Press ENTER to continue
                </span>
                <span className="text-primary ml-1 animate-pulse">█</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
