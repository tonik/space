import { useState, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGame } from "@/state/useGame";

interface FuelSystem {
  id: string;
  name: string;
  fuelType: "hydrogen" | "oxygen" | "nitrogen" | "helium";
  currentFlow: number;
  targetFlow: number;
  isOptimal: boolean;
  pressure: number;
  temperature: number;
}

interface GameState {
  phase: "menu" | "playing" | "gameOver" | "victory";
  timeLeft: number;
  fuelSystems: FuelSystem[];
  totalEfficiency: number;
  isStable: boolean;
}

const createFuelSystems = (): FuelSystem[] => [
  {
    id: "main-engine",
    name: "Main Engine",
    fuelType: "hydrogen",
    currentFlow: 45,
    targetFlow: 75,
    isOptimal: false,
    pressure: 2.3,
    temperature: 180,
  },
  {
    id: "life-support",
    name: "Life Support",
    fuelType: "oxygen",
    currentFlow: 80,
    targetFlow: 85,
    isOptimal: false,
    pressure: 1.8,
    temperature: 22,
  },
  {
    id: "thruster-1",
    name: "Thruster Array 1",
    fuelType: "nitrogen",
    currentFlow: 30,
    targetFlow: 60,
    isOptimal: false,
    pressure: 3.1,
    temperature: 95,
  },
  {
    id: "thruster-2",
    name: "Thruster Array 2",
    fuelType: "helium",
    currentFlow: 90,
    targetFlow: 70,
    isOptimal: false,
    pressure: 2.7,
    temperature: 45,
  },
  {
    id: "backup-power",
    name: "Backup Power",
    fuelType: "hydrogen",
    currentFlow: 20,
    targetFlow: 40,
    isOptimal: false,
    pressure: 1.5,
    temperature: 120,
  },
  {
    id: "cooling-system",
    name: "Cooling System",
    fuelType: "nitrogen",
    currentFlow: 65,
    targetFlow: 55,
    isOptimal: false,
    pressure: 2.1,
    temperature: 15,
  },
];

const GAME_CONFIG = {
  time: 60,
  tolerance: 5, // How close to target for optimal
};

export default function FuelFlowControlView() {
  const [game, setGame] = useState<GameState>({
    phase: "menu",
    timeLeft: 0,
    fuelSystems: [],
    totalEfficiency: 0,
    isStable: false,
  });
  const { changeView } = useGame();

  const startGame = () => {
    const fuelSystems = createFuelSystems();

    // Calculate initial efficiency
    const initialEfficiency =
      fuelSystems.reduce((acc, system) => {
        const efficiency = Math.max(
          0,
          100 - Math.abs(system.currentFlow - system.targetFlow) * 2,
        );
        return acc + efficiency;
      }, 0) / fuelSystems.length;

    setGame({
      phase: "playing",
      timeLeft: GAME_CONFIG.time,
      fuelSystems,
      totalEfficiency: initialEfficiency,
      isStable: false,
    });

    const timer = setInterval(() => {
      setGame((prev) => {
        if (prev.timeLeft <= 1) {
          clearInterval(timer);
          return { ...prev, phase: "gameOver" };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
  };

  const updateFuelFlow = useCallback((systemId: string, newFlow: number) => {
    setGame((prev) => {
      const updatedSystems = prev.fuelSystems.map((system) => {
        if (system.id === systemId) {
          const isOptimal =
            Math.abs(newFlow - system.targetFlow) <= GAME_CONFIG.tolerance;
          return { ...system, currentFlow: newFlow, isOptimal };
        }
        return system;
      });

      const totalEfficiency =
        updatedSystems.reduce((acc, system) => {
          const efficiency = Math.max(
            0,
            100 - Math.abs(system.currentFlow - system.targetFlow) * 2,
          );
          return acc + efficiency;
        }, 0) / updatedSystems.length;

      const isStable = updatedSystems.every((system) => system.isOptimal);

      return {
        ...prev,
        fuelSystems: updatedSystems,
        totalEfficiency,
        isStable,
      };
    });
  }, []);

  // Check for win condition
  useEffect(() => {
    if (game.phase === "playing" && game.isStable) {
      setTimeout(() => {
        setGame((prev) => ({ ...prev, phase: "victory" }));
      }, 1000);
    }
  }, [game.isStable, game.phase]);

  return (
    <div className="flex h-full flex-col">
      <Card className="border-border/30 bg-background flex-1 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-primary text-sm font-bold">FUEL FLOW CONTROL</h3>
          <div className="text-primary flex gap-4 font-mono text-sm">
            <span>TIME: {game.timeLeft}</span>
            <span>EFFICIENCY: {Math.round(game.totalEfficiency)}%</span>
            {game.isStable && <span className="text-primary">STABLE</span>}
          </div>
        </div>

        <div className="relative min-h-[600px] w-full">
          {game.phase === "menu" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <h2 className="text-primary mb-4 font-mono text-2xl font-bold">
                FUEL FLOW CONTROL
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md text-center font-mono text-sm">
                Adjust fuel flow rates to match target values for optimal ship
                performance. Keep all systems within ±5% of target for maximum
                efficiency.
              </p>
              <div className="mb-6 grid grid-cols-2 gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="bg-primary size-4 rounded-full"></div>
                  <span className="text-muted-foreground font-mono">
                    HYDROGEN
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-primary size-4 rounded-full"></div>
                  <span className="text-muted-foreground font-mono">
                    OXYGEN
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-primary size-4 rounded-full"></div>
                  <span className="text-muted-foreground font-mono">
                    NITROGEN
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-primary size-4 rounded-full"></div>
                  <span className="text-muted-foreground font-mono">
                    HELIUM
                  </span>
                </div>
              </div>
              <Button
                onClick={startGame}
                className="bg-primary text-background hover:bg-primary/80"
              >
                START GAME
              </Button>
            </div>
          )}

          {game.phase === "playing" && (
            <div className="space-y-4">
              {game.fuelSystems.map((system) => (
                <div
                  key={system.id}
                  className="bg-muted/20 border-border/30 rounded-lg border p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary size-3 rounded-full" />
                      <h4 className="font-mono text-sm font-bold">
                        {system.name}
                      </h4>
                      <span className="text-muted-foreground text-xs">
                        {system.fuelType.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span>Pressure: {system.pressure} bar</span>
                      <span>Temp: {system.temperature}°C</span>
                      {system.isOptimal && (
                        <span className="text-primary font-bold">OPTIMAL</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Current Flow: {system.currentFlow}%</span>
                    </div>

                    {/* Flow Bar */}
                    <div className="bg-muted relative h-2 overflow-hidden">
                      <div
                        className="bg-primary absolute top-0 left-0 h-full transition-all duration-300"
                        style={{
                          width: `${system.currentFlow}%`,
                        }}
                      />
                    </div>

                    {/* Number Input */}
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={system.currentFlow}
                      onChange={(e) =>
                        updateFuelFlow(system.id, parseInt(e.target.value) || 0)
                      }
                      className="bg-background border-border/30 focus:ring-primary w-full appearance-none rounded-md border px-3 py-2 font-mono text-sm focus:border-transparent focus:ring-1 focus:outline-none"
                      placeholder="0-100"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {game.phase === "gameOver" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <h2 className="text-primary mb-4 font-mono text-2xl font-bold">
                TIME'S UP!
              </h2>
              <div className="text-muted-foreground mb-6 text-center font-mono text-sm">
                <p>Efficiency: {Math.round(game.totalEfficiency)}%</p>
                <p>
                  Systems Optimized:{" "}
                  {game.fuelSystems.filter((s) => s.isOptimal).length}/
                  {game.fuelSystems.length}
                </p>
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
          )}

          {game.phase === "victory" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <h2 className="text-primary mb-4 font-mono text-2xl font-bold">
                ALL SYSTEMS OPTIMIZED!
              </h2>
              <div className="text-muted-foreground mb-6 text-center font-mono text-sm">
                <p>Efficiency: {Math.round(game.totalEfficiency)}%</p>
                <p>
                  Systems Optimized:{" "}
                  {game.fuelSystems.filter((s) => s.isOptimal).length}/
                  {game.fuelSystems.length}
                </p>
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
          )}
        </div>

        <div className="text-muted-foreground mt-4 text-center font-mono text-xs">
          Use number inputs to adjust fuel flow rates. Target values are shown
          as white lines on the bars.
        </div>
      </Card>
    </div>
  );
}
