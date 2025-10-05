"use client";

import { useState } from "react";
import { displayLinesWithDelay } from "@/lib/utils";
import { gameActor, useGame } from "@/state/useGame";
import { useSelector } from "@xstate/react";

interface WelcomeScreenProps {
  hidden: boolean;
}

const welcomeLines = [
  "GHOST FLEET OS v3.7.2 - USA NAVAL COMMAND",
  "SYSTEM BOOT - 2425.10.14 - 08:03:00",
  "4.7TB AVAILABLE STORAGE",
  "\n",
  "SHIP: U.S.S. PHANTOM",
  "CLASS: NUCLEAR DESTROYER",
  "STATUS: GHOST FLEET PATROL",
  "\n",
  "TERMINAL READY.",
  "\n",
  "Welcome to the Ghost Fleet Command System.",
  "All systems are online and ready for operation.",
  "\n",
  "Type 'enter' to access the main dashboard.",
];

export function WelcomeScreen({ hidden }: WelcomeScreenProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const { send } = useGame();
  const isExiting = useSelector(
    gameActor,
    (s) =>
      typeof s.value.gameProgressState !== "string" &&
      s.value.gameProgressState.step0 === "hidingWelcomeScreen",
  );
  const finishedAnimating = useSelector(
    gameActor,
    (s) =>
      typeof s.value.gameProgressState !== "string" &&
      s.value.gameProgressState.step0 === "finishedAnimating",
  );

  const startAnimation = async () => {
    await displayLinesWithDelay(
      welcomeLines,
      (line) => setDisplayedLines((prev) => [...prev, line]),
      setIsTyping,
      300,
      600,
    );
    send({ type: "FINISHED_INTRO_SEQUENCE" });
  };

  if (displayedLines.length === 0 && isTyping) {
    startAnimation();
  }

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
              <div
                key={index}
                className="text-primary font-mono"
                style={{
                  textShadow: "0 0 2px var(--primary)",
                }}
              >
                {line}
              </div>
            ))}

            {/* Ready prompt */}
            {finishedAnimating && (
              <div className="mt-4 flex items-center">
                <span
                  className="text-primary mr-2 font-mono"
                  style={{
                    textShadow: "0 0 2px var(--primary)",
                  }}
                >
                  &gt;
                </span>
                <span
                  className="text-primary font-mono"
                  style={{
                    textShadow: "0 0 2px var(--primary)",
                  }}
                >
                  Press ENTER to continue
                </span>
                <span
                  className="text-primary ml-1 animate-pulse"
                  style={{
                    textShadow: "0 0 2px var(--primary)",
                  }}
                >
                  █
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
