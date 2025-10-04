import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CipherGameState {
  gameState: "menu" | "playing" | "gameOver" | "victory";
  score: number;
  level: number;
  timeRemaining: number;
  currentCipher: string;
  currentPlaintext: string;
  userInput: string;
  shift: number;
  hintsUsed: number;
  maxHints: number;
}

const CIPHER_TEXTS = ["HELLO WORLD", "TONIK"];

const GAME_SETTINGS = {
  timeLimit: 120,
  maxHints: 1,
  shiftRange: [1, 15],
};

export default function CipherGameView() {
  const [gameState, setGameState] = useState<CipherGameState>({
    gameState: "menu",
    score: 0,
    level: 1,
    timeRemaining: 0,
    currentCipher: "",
    currentPlaintext: "",
    userInput: "",
    shift: 0,
    hintsUsed: 0,
    maxHints: 3,
  });

  const [gameTimer, setGameTimer] = useState<number | null>(null);

  // Caesar cipher encoding function
  const encodeCaesar = (text: string, shift: number): string => {
    return text
      .split("")
      .map((char) => {
        if (char === " ") return " ";
        const code = char.charCodeAt(0);
        const shifted = (((code - 65 + shift) % 26) + 26) % 26;
        return String.fromCharCode(shifted + 65);
      })
      .join("");
  };

  // Generate new cipher challenge
  const generateNewCipher = (cipherIndex: number) => {
    const plaintext = CIPHER_TEXTS[cipherIndex];
    const shift =
      Math.floor(
        Math.random() *
          (GAME_SETTINGS.shiftRange[1] - GAME_SETTINGS.shiftRange[0] + 1),
      ) + GAME_SETTINGS.shiftRange[0];
    const cipher = encodeCaesar(plaintext, shift);

    setGameState((prev) => ({
      ...prev,
      currentCipher: cipher,
      currentPlaintext: plaintext,
      shift,
      userInput: "",
      hintsUsed: 0,
      maxHints: GAME_SETTINGS.maxHints,
      timeRemaining: GAME_SETTINGS.timeLimit,
    }));
  };

  // Start new game
  const startGame = () => {
    setGameState((prev) => ({
      ...prev,
      gameState: "playing",
      score: 0,
      level: 1,
    }));

    // Generate first cipher after setting level (start from index 0)
    setTimeout(() => {
      generateNewCipher(0);
    }, 0);

    // Start timer
    const timer = setInterval(() => {
      setGameState((prev) => {
        if (prev.timeRemaining <= 1) {
          clearInterval(timer);
          return { ...prev, gameState: "gameOver" };
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);

    setGameTimer(timer);
  };

  // Check answer
  const checkAnswer = () => {
    if (gameState.userInput.toUpperCase() === gameState.currentPlaintext) {
      const points = Math.max(
        10,
        50 -
          gameState.hintsUsed * 10 -
          Math.floor((GAME_SETTINGS.timeLimit - gameState.timeRemaining) / 5),
      );

      setGameState((prev) => {
        const newLevel = prev.level + 1;

        return {
          ...prev,
          score: prev.score + points,
          level: newLevel,
          userInput: "",
        };
      });

      // Check if we've completed 2 ciphers (after increment, level will be 2)
      if (gameState.level >= 2) {
        // Game completed - show victory
        setTimeout(() => {
          setGameState((prev) => ({ ...prev, gameState: "victory" }));
          if (gameTimer) {
            clearInterval(gameTimer);
          }
        }, 1000);
      } else {
        // Generate next cipher (use current level as index)
        setTimeout(() => {
          generateNewCipher(gameState.level);
        }, 1000);
      }
    }
  };

  // Use hint
  const useHint = () => {
    if (gameState.hintsUsed < gameState.maxHints) {
      const hint = gameState.currentPlaintext.substring(
        0,
        gameState.hintsUsed + 1,
      );
      setGameState((prev) => ({
        ...prev,
        hintsUsed: prev.hintsUsed + 1,
        userInput: hint,
      }));
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGameState((prev) => ({
      ...prev,
      userInput: e.target.value.toUpperCase(),
    }));
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      checkAnswer();
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (gameTimer) {
        clearInterval(gameTimer);
      }
    };
  }, [gameTimer]);

  return (
    <div className="flex h-full flex-col">
      <Card className="border-border/30 bg-background flex-1 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-primary text-sm font-bold">CIPHER BREAKER</h3>
          <div className="text-primary flex gap-4 font-mono text-sm">
            <span>SCORE: {gameState.score}</span>
            <span>TIME: {gameState.timeRemaining}</span>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="border-primary relative h-[600px] w-full max-w-4xl border-2 bg-black">
            <div className="flex h-full flex-col items-center justify-center p-8">
              {gameState.gameState === "menu" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
                  <h2 className="text-primary mb-4 font-mono text-2xl font-bold">
                    CIPHER BREAKER
                  </h2>
                  <p className="text-muted-foreground mb-2 font-mono text-sm">
                    Decode 2 Caesar ciphers to complete the mission
                  </p>
                  <p className="text-muted-foreground mb-6 font-mono text-xs">
                    120 seconds • 1 hint • Shift range 1-15
                  </p>
                  <Button
                    onClick={startGame}
                    className="bg-primary text-background hover:bg-primary/80"
                  >
                    START GAME
                  </Button>
                </div>
              )}

              {gameState.gameState === "playing" && (
                <div className="w-full max-w-2xl space-y-6 text-center">
                  <div className="border-primary/30 border bg-black/40 p-6">
                    <h3 className="text-primary mb-3 font-mono text-lg">
                      ENCRYPTED MESSAGE:
                    </h3>
                    <div className="text-primary font-mono text-3xl font-bold tracking-wider">
                      {gameState.currentCipher}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-primary mb-2 block font-mono text-sm">
                        DECODED MESSAGE:
                      </label>
                      <input
                        type="text"
                        value={gameState.userInput}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        className="border-primary/30 text-primary focus:ring-primary/50 w-full border bg-black/40 p-3 text-center font-mono text-xl tracking-wider focus:ring-2 focus:outline-none"
                        placeholder="Enter decoded text..."
                        autoFocus
                      />
                    </div>

                    <div className="flex justify-center gap-2">
                      <Button
                        onClick={checkAnswer}
                        className="bg-primary text-background hover:bg-primary/80"
                      >
                        SUBMIT
                      </Button>
                      <Button
                        onClick={useHint}
                        disabled={gameState.hintsUsed >= gameState.maxHints}
                        className="bg-primary text-background hover:bg-primary/80 disabled:opacity-50"
                      >
                        HINT ({gameState.maxHints - gameState.hintsUsed})
                      </Button>
                    </div>
                  </div>

                  <div className="text-muted-foreground font-mono text-xs">
                    <p>
                      Hints used: {gameState.hintsUsed}/{gameState.maxHints}
                    </p>
                    <p>Time remaining: {gameState.timeRemaining}s</p>
                  </div>
                </div>
              )}

              {gameState.gameState === "gameOver" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
                  <h2 className="text-primary mb-2 font-mono text-2xl font-bold">
                    GAME OVER
                  </h2>
                  <p className="text-primary mb-2 font-mono text-lg">
                    Final Score: {gameState.score}
                  </p>
                  <p className="text-primary mb-4 font-mono text-lg">
                    Ciphers Solved: {gameState.level - 1}/2
                  </p>
                  <Button
                    onClick={() =>
                      setGameState((prev) => ({ ...prev, gameState: "menu" }))
                    }
                    className="bg-primary text-background hover:bg-primary/80"
                  >
                    PLAY AGAIN
                  </Button>
                </div>
              )}

              {gameState.gameState === "victory" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
                  <h2 className="text-primary mb-2 font-mono text-2xl font-bold">
                    MISSION COMPLETE
                  </h2>
                  <p className="text-primary mb-2 font-mono text-lg">
                    All ciphers decoded successfully!
                  </p>
                  <p className="text-primary mb-2 font-mono text-lg">
                    Final Score: {gameState.score}
                  </p>
                  <p className="text-primary mb-4 font-mono text-lg">
                    Ciphers Solved: 2/2
                  </p>
                  <Button
                    onClick={() =>
                      setGameState((prev) => ({ ...prev, gameState: "menu" }))
                    }
                    className="bg-primary text-background hover:bg-primary/80"
                  >
                    PLAY AGAIN
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-muted-foreground mt-4 text-center font-mono text-xs">
          {gameState.gameState === "menu" &&
            "Decode 2 Caesar ciphers. 120 seconds each, 1 hint only!"}
          {gameState.gameState === "playing" &&
            "Type the decoded message and press Enter or click Submit"}
        </div>
      </Card>
    </div>
  );
}
