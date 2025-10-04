import { useCallback, useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useResizeObserver } from "@/lib/useResizeObserver";

interface Position {
  x: number;
  y: number;
}

interface Alien extends Position {
  alive: boolean;
}

interface Bullet extends Position {
  active: boolean;
}

const DEFAULT_CANVAS_WIDTH = 1200;
const DEFAULT_CANVAS_HEIGHT = 800;
const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 30;
const ALIEN_WIDTH = 30;
const ALIEN_HEIGHT = 30;
const BULLET_WIDTH = 4;
const BULLET_HEIGHT = 15;
const ALIEN_ROWS = 4;
const ALIEN_COLS = 8;
const ALIEN_SPEED = 1;
const BULLET_SPEED = 8;
const PLAYER_SPEED = 5;

export default function ArcadeView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { width: containerWidth, height: containerHeight } = useResizeObserver({
    ref: containerRef,
  });

  const [gameState, setGameState] = useState<"menu" | "playing" | "gameOver">(
    "menu",
  );
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Calculate canvas dimensions - use container size if available, otherwise use defaults
  const canvasWidth =
    containerWidth > 0 ? containerWidth : DEFAULT_CANVAS_WIDTH;
  const canvasHeight = Math.max(
    containerHeight > 0 ? containerHeight : DEFAULT_CANVAS_HEIGHT,
    400,
  );

  const gameStateRef = useRef({
    player: { x: canvasWidth / 2, y: canvasHeight - 60 },
    aliens: [] as Alien[],
    bullets: [] as Bullet[],
    alienDirection: 1,
    keys: {} as Record<string, boolean>,
    animationId: null as number | null,
    lastShotTime: 0,
  });

  const initGame = () => {
    const aliens: Alien[] = [];
    for (let row = 0; row < ALIEN_ROWS; row++) {
      for (let col = 0; col < ALIEN_COLS; col++) {
        aliens.push({
          x: col * (ALIEN_WIDTH + 20) + 100,
          y: row * (ALIEN_HEIGHT + 20) + 50,
          alive: true,
        });
      }
    }

    gameStateRef.current = {
      player: { x: canvasWidth / 2, y: canvasHeight - 60 },
      aliens,
      bullets: [],
      alienDirection: 1,
      keys: {},
      animationId: null,
      lastShotTime: 0,
    };

    setScore(0);
    setGameState("playing");
  };

  const checkCollision = (
    rect1: { x: number; y: number; width: number; height: number },
    rect2: { x: number; y: number; width: number; height: number },
  ) => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  };

  const gameLoop = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const state = gameStateRef.current;

    // Clear canvas
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Move player
    if (state.keys["ArrowLeft"] && state.player.x > 0) {
      state.player.x -= PLAYER_SPEED;
    }
    if (
      state.keys["ArrowRight"] &&
      state.player.x < canvasWidth - PLAYER_WIDTH
    ) {
      state.player.x += PLAYER_SPEED;
    }

    // Shoot
    if (state.keys[" "] && Date.now() - state.lastShotTime > 300) {
      state.bullets.push({
        x: state.player.x + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2,
        y: state.player.y,
        active: true,
      });
      state.lastShotTime = Date.now();
    }

    // Draw player
    ctx.fillStyle = "#00ff00";
    ctx.fillRect(state.player.x, state.player.y, PLAYER_WIDTH, PLAYER_HEIGHT);

    // Move and draw bullets
    state.bullets.forEach((bullet) => {
      if (bullet.active) {
        bullet.y -= BULLET_SPEED;
        if (bullet.y < 0) bullet.active = false;

        ctx.fillStyle = "#00ff00";
        ctx.fillRect(bullet.x, bullet.y, BULLET_WIDTH, BULLET_HEIGHT);
      }
    });

    // Check if need to move aliens down
    let moveDown = false;
    state.aliens.forEach((alien) => {
      if (alien.alive) {
        if (
          (state.alienDirection > 0 &&
            alien.x > canvasWidth - ALIEN_WIDTH - 10) ||
          (state.alienDirection < 0 && alien.x < 10)
        ) {
          moveDown = true;
        }
      }
    });

    if (moveDown) {
      state.alienDirection *= -1;
      state.aliens.forEach((alien) => {
        if (alien.alive) alien.y += ALIEN_HEIGHT;
      });
    }

    // Move and draw aliens
    let aliensAlive = 0;
    state.aliens.forEach((alien) => {
      if (alien.alive) {
        aliensAlive++;
        alien.x += state.alienDirection * ALIEN_SPEED;

        // Check collision with bullets
        state.bullets.forEach((bullet) => {
          if (
            bullet.active &&
            checkCollision(
              {
                x: bullet.x,
                y: bullet.y,
                width: BULLET_WIDTH,
                height: BULLET_HEIGHT,
              },
              {
                x: alien.x,
                y: alien.y,
                width: ALIEN_WIDTH,
                height: ALIEN_HEIGHT,
              },
            )
          ) {
            alien.alive = false;
            bullet.active = false;
            setScore((s) => s + 10);
          }
        });

        // Draw alien
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(alien.x, alien.y, ALIEN_WIDTH, ALIEN_HEIGHT);

        // Check game over
        if (alien.y > canvasHeight - 100) {
          setGameState("gameOver");
          if (gameStateRef.current.animationId) {
            cancelAnimationFrame(gameStateRef.current.animationId);
          }
        }
      }
    });

    // Check win condition
    if (aliensAlive === 0) {
      setGameState("gameOver");
      setHighScore((prev) => Math.max(prev, score));
      if (gameStateRef.current.animationId) {
        cancelAnimationFrame(gameStateRef.current.animationId);
      }
    }

    // Clean up inactive bullets
    state.bullets = state.bullets.filter((b) => b.active);

    if (gameState === "playing") {
      state.animationId = requestAnimationFrame(gameLoop);
    }
  }, [gameState, canvasWidth, canvasHeight, score]);

  useEffect(() => {
    if (gameState === "playing") {
      const handleKeyDown = (e: KeyboardEvent) => {
        gameStateRef.current.keys[e.key] = true;
      };

      const handleKeyUp = (e: KeyboardEvent) => {
        gameStateRef.current.keys[e.key] = false;
      };

      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);

      gameStateRef.current.animationId = requestAnimationFrame(gameLoop);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
        if (gameStateRef.current.animationId) {
          cancelAnimationFrame(gameStateRef.current.animationId);
        }
      };
    }
  }, [gameLoop, gameState]);

  useEffect(() => {
    if (gameState === "gameOver") {
      setHighScore((prev) => Math.max(prev, score));
    }
  }, [gameState, score]);

  // Reinitialize game when canvas dimensions change
  useEffect(() => {
    if (gameState === "playing" && canvasWidth > 0 && canvasHeight > 0) {
      // Update player position to center of new canvas
      gameStateRef.current.player.x = canvasWidth / 2;
      gameStateRef.current.player.y = canvasHeight - 60;
    }
  }, [canvasWidth, canvasHeight, gameState]);

  return (
    <div className="flex h-full flex-col">
      <Card className="border-border/30 bg-background flex-1 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-primary text-sm font-bold">SPACE INVADERS</h3>
          <div className="text-primary flex gap-4 font-mono text-sm">
            <span>SCORE: {score}</span>
            <span>HIGH: {highScore}</span>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div
            ref={containerRef}
            className="border-primary relative min-h-64 w-full max-w-4xl border-2"
          >
            <canvas
              ref={canvasRef}
              width={canvasWidth}
              height={canvasHeight}
              className="block h-full w-full"
            />

            {gameState === "menu" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
                <h2 className="text-primary mb-4 font-mono text-2xl font-bold">
                  SPACE INVADERS
                </h2>
                <p className="text-muted-foreground mb-6 font-mono text-sm">
                  Arrow Keys to Move • Space to Shoot
                </p>
                <Button
                  onClick={initGame}
                  className="bg-primary text-background hover:bg-primary/80"
                >
                  START GAME
                </Button>
              </div>
            )}

            {gameState === "gameOver" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
                <h2 className="text-primary mb-2 font-mono text-2xl font-bold">
                  GAME OVER
                </h2>
                <p className="text-primary mb-4 font-mono text-lg">
                  Final Score: {score}
                </p>
                <Button
                  onClick={initGame}
                  className="bg-primary text-background hover:bg-primary/80"
                >
                  PLAY AGAIN
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="text-muted-foreground mt-4 text-center font-mono text-xs">
          Use Arrow Keys to move, Space to shoot. Destroy all aliens to win!
        </div>
      </Card>
    </div>
  );
}
