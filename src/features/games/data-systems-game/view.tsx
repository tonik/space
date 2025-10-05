import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGame } from "@/state/useGame";

export default function DataSystemsGameView() {
  const [gameState, setGameState] = useState<"menu" | "playing" | "victory">(
    "menu",
  );
  const [userInput, setUserInput] = useState("");

  const puzzleData = `
Corrupted navigation segments:
0x7FF8A2B4C1D0: 4E 41 56 49 47 41 54 49 4F 4E 5F 50 52 4F 54 4F 43 4F 4C
0x7FF8A2B4C1E0: 5F 45 4D 45 52 47 45 4E 43 59 00 00 00 00 00 00 00 00

Hint: The missing protocol name is: NAVIGATION_PROTOCOL_EMERGENCY`;

  const correctAnswer = "NAVIGATION_PROTOCOL_EMERGENCY";
  const { changeView } = useGame();
  const startGame = () => setGameState("playing");
  const checkAnswer = () => {
    if (userInput.toUpperCase() === correctAnswer) {
      setTimeout(() => setGameState("victory"), 1000);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <Card className="border-border/30 bg-background min-h-[600px] flex-1 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-primary text-sm font-bold">
            USS SENTINEL - SYSTEMS RECOVERY
          </h3>
          <span className="text-primary font-mono text-sm">
            SYSTEM: NAVIGATION CORE
          </span>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="relative min-h-[600px] w-full">
            <div className="flex h-full flex-col items-center justify-center overflow-auto p-6">
              {gameState === "menu" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  <h2 className="text-primary mb-4 font-mono text-2xl font-bold">
                    USS SENTINEL SYSTEMS RECOVERY
                  </h2>
                  <p className="text-muted-foreground mb-2 font-mono text-sm">
                    Critical ship navigation system has been compromised.
                    Restore the navigation core to save the mission.
                  </p>
                  <Button
                    onClick={startGame}
                    className="bg-primary text-background hover:bg-primary/80"
                  >
                    INITIATE RECOVERY PROTOCOL
                  </Button>
                </div>
              )}

              {gameState === "playing" && (
                <div className="w-full space-y-6 overflow-auto text-center">
                  <div className="border-primary/30 /40 border p-6">
                    <h3 className="text-primary mb-3 font-mono text-lg">
                      USS Sentinel Navigation Core Corruption
                    </h3>
                    <p className="text-muted-foreground mb-4 font-mono text-sm">
                      The ship's navigation core has been corrupted by cosmic
                      radiation. Restore the critical navigation protocols.
                    </p>
                  </div>

                  <div className="border-primary/30 /40 border p-3">
                    <h4 className="text-primary mb-2 font-mono text-sm">
                      SHIP NAVIGATION LOGS:
                    </h4>
                    <pre className="text-primary max-h-32 overflow-auto font-mono text-xs leading-relaxed">
                      {puzzleData}
                    </pre>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="text-primary mb-2 block font-mono text-sm">
                        SOLUTION:
                      </label>
                      <input
                        type="text"
                        value={userInput}
                        onChange={(e) =>
                          setUserInput(e.target.value.toUpperCase())
                        }
                        onKeyPress={(e) => e.key === "Enter" && checkAnswer()}
                        className="border-primary/30 text-primary focus:ring-primary/50 /40 w-full border p-3 text-center font-mono text-xl tracking-wider focus:ring-2 focus:outline-none"
                        placeholder="Enter your solution..."
                        autoFocus
                      />
                    </div>
                    <Button
                      onClick={checkAnswer}
                      className="bg-primary text-background hover:bg-primary/80"
                    >
                      SUBMIT
                    </Button>
                  </div>
                </div>
              )}

              {gameState === "victory" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  <h2 className="text-primary mb-2 font-mono text-2xl font-bold">
                    MISSION ACCOMPLISHED
                  </h2>
                  <p className="text-primary mb-2 font-mono text-lg">
                    USS Sentinel: All systems operational!
                  </p>
                  <p className="text-primary mb-4 font-mono text-lg">
                    Navigation System: RESTORED
                  </p>
                  <Button
                    onClick={() => {
                      changeView("dashboard");
                    }}
                    className="bg-primary text-background hover:bg-primary/80"
                  >
                    BACK TO DASHBOARD
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
