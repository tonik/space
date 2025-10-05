import { useState, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGame } from "@/state/context";
import {
  Rocket,
  Satellite,
  Star,
  Zap,
  Shield,
  Target,
  Cpu,
  Wifi,
} from "lucide-react";

interface MemoryCard {
  id: string;
  symbol: React.ComponentType<{ className?: string }>;
  symbolId: number;
  isFlipped: boolean;
  isMatched: boolean;
}

type GamePhase = "menu" | "playing" | "gameOver" | "victory";

interface GameState {
  phase: GamePhase;
  timeLeft: number;
  cards: MemoryCard[];
  flippedCards: string[];
  moves: number;
  matches: number;
}

const SYMBOLS = [Rocket, Satellite, Star, Zap, Shield, Target, Cpu, Wifi];
const GAME_CONFIG = { time: 60, cardPairs: 8 };

const createCards = (): MemoryCard[] => {
  const cards: MemoryCard[] = [];

  // Create pairs of cards with the same symbol
  for (let i = 0; i < GAME_CONFIG.cardPairs; i++) {
    const symbol = SYMBOLS[i];
    // Add two cards with the same symbol
    cards.push({
      id: `card-${i}-1`,
      symbol,
      symbolId: i,
      isFlipped: false,
      isMatched: false,
    });
    cards.push({
      id: `card-${i}-2`,
      symbol,
      symbolId: i,
      isFlipped: false,
      isMatched: false,
    });
  }

  // Shuffle the cards
  return cards.sort(() => Math.random() - 0.5);
};

const initialGameState: GameState = {
  phase: "menu",
  timeLeft: 0,
  cards: [],
  flippedCards: [],
  moves: 0,
  matches: 0,
};

export default function MemoryGameView() {
  const [game, setGame] = useState<GameState>(initialGameState);
  const { changeView } = useGame();

  const startGame = () => {
    setGame({
      ...initialGameState,
      phase: "playing",
      timeLeft: GAME_CONFIG.time,
      cards: createCards(),
    });
  };

  const handleCardClick = useCallback(
    (cardId: string) => {
      if (game.phase !== "playing" || game.flippedCards.length >= 2) return;

      const card = game.cards.find((c) => c.id === cardId);
      if (!card || card.isFlipped || card.isMatched) return;

      const newFlippedCards = [...game.flippedCards, cardId];
      const newCards = game.cards.map((c) =>
        c.id === cardId ? { ...c, isFlipped: true } : c,
      );

      setGame((prev) => ({
        ...prev,
        cards: newCards,
        flippedCards: newFlippedCards,
        moves: prev.moves + 1,
      }));

      if (newFlippedCards.length === 2) {
        const [firstId, secondId] = newFlippedCards;
        const [firstCard, secondCard] = [
          newCards.find((c) => c.id === firstId),
          newCards.find((c) => c.id === secondId),
        ];
        const isMatch = firstCard?.symbolId === secondCard?.symbolId;
        const delay = isMatch ? 500 : 1000;

        setTimeout(() => {
          setGame((prev) => {
            const updatedCards = prev.cards.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, isMatched: isMatch, isFlipped: isMatch }
                : c,
            );

            const newMatches = isMatch ? prev.matches + 1 : prev.matches;
            const isComplete = newMatches === GAME_CONFIG.cardPairs;

            return {
              ...prev,
              cards: updatedCards,
              flippedCards: [],
              matches: newMatches,
              phase: isComplete ? "victory" : prev.phase,
            };
          });
        }, delay);
      }
    },
    [game],
  );

  useEffect(() => {
    if (game.phase === "playing" && game.timeLeft > 0) {
      const timer = setTimeout(() => {
        setGame((prev) => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
          phase: prev.timeLeft <= 1 ? "gameOver" : prev.phase,
        }));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [game.phase, game.timeLeft]);

  const getCardDisplay = (card: MemoryCard) => {
    const IconComponent = card.symbol;
    return (
      <div className="flex h-full items-center justify-center">
        {card.isMatched || card.isFlipped ? (
          <IconComponent className="text-primary h-6 w-6" />
        ) : (
          <span className="text-2xl">?</span>
        )}
      </div>
    );
  };

  const getCardClassName = (card: MemoryCard) => {
    const baseClasses =
      "bg-primary/20 border cursor-pointer transition-all duration-300 w-16 h-16 rounded-lg flex items-center justify-center";
    const stateClasses = card.isMatched
      ? "border-green-500 bg-green-500/20"
      : card.isFlipped
        ? "border-primary bg-primary/40"
        : "border-border hover:border-primary/50";
    const scaleClasses =
      card.isFlipped || card.isMatched ? "scale-105" : "hover:scale-105";
    return `${baseClasses} ${stateClasses} ${scaleClasses}`;
  };

  const renderMenu = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <h2 className="text-primary mb-4 font-mono text-2xl font-bold">
        MEMORY MATRIX
      </h2>
      <p className="text-muted-foreground mb-6 max-w-md text-center font-mono text-sm">
        Match all 8 pairs of system icons to restore ship memory banks. Complete
        in under 60 seconds!
      </p>
      <Button
        onClick={startGame}
        className="bg-primary text-background hover:bg-primary/80"
      >
        START GAME
      </Button>
    </div>
  );

  const renderGame = () => (
    <div className="flex h-full items-center justify-center">
      <div className="grid w-fit grid-cols-4 gap-3">
        {game.cards.map((card) => (
          <div
            key={card.id}
            className={getCardClassName(card)}
            onClick={() => handleCardClick(card.id)}
          >
            {getCardDisplay(card)}
          </div>
        ))}
      </div>
    </div>
  );

  const renderGameOver = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <h2 className="text-primary mb-4 font-mono text-2xl font-bold">
        TIME'S UP!
      </h2>
      <div className="text-muted-foreground mb-6 text-center font-mono text-sm">
        <p>
          Matches: {game.matches}/{GAME_CONFIG.cardPairs}
        </p>
        <p>Moves: {game.moves}</p>
        {game.matches === GAME_CONFIG.cardPairs && (
          <p className="mt-2 text-green-500">All memory banks restored!</p>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          onClick={startGame}
          className="bg-primary text-background hover:bg-primary/80"
        >
          PLAY AGAIN
        </Button>
        <Button
          onClick={() => changeView("dashboard")}
          className="bg-primary text-background hover:bg-primary/80"
        >
          BACK TO DASHBOARD
        </Button>
      </div>
    </div>
  );

  const renderVictory = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <h2 className="text-primary mb-4 font-mono text-2xl font-bold">
        MEMORY RESTORED!
      </h2>
      <div className="text-muted-foreground mb-6 text-center font-mono text-sm">
        <p>
          Matches: {game.matches}/{GAME_CONFIG.cardPairs}
        </p>
        <p>Moves: {game.moves}</p>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={() => changeView("dashboard")}
          className="bg-primary text-background hover:bg-primary/80"
        >
          BACK TO DASHBOARD
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-full flex-col">
      <Card className="border-border/30 bg-background flex-1 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-primary text-sm font-bold">MEMORY MATRIX</h3>
          <div className="text-primary flex gap-4 font-mono text-sm">
            <span>TIME: {game.timeLeft}</span>
            <span>MOVES: {game.moves}</span>
          </div>
        </div>

        <div className="relative h-[600px] w-full">
          {game.phase === "menu" && renderMenu()}
          {game.phase === "playing" && renderGame()}
          {game.phase === "gameOver" && renderGameOver()}
          {game.phase === "victory" && renderVictory()}
        </div>

        <div className="text-muted-foreground mt-4 text-center font-mono text-xs">
          Click cards to flip them. Match icon pairs to restore ship memory
          systems!
        </div>
      </Card>
    </div>
  );
}
