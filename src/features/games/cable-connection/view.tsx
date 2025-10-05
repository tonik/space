import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGame } from "@/state/useGame";

interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
  connected: boolean;
  type: "input" | "output";
}

interface GameState {
  phase: "menu" | "playing" | "gameOver" | "victory";
  timeLeft: number;
  nodes: Node[];
  selectedNode: string | null;
  connections: string[][];
  connectionsMade: number;
}

const createNodes = (count: number, prefix: string, type: "input" | "output") =>
  Array.from({ length: count }, (_, i) => ({
    id: `${prefix}${i + 1}`,
    label: `${prefix.toUpperCase()}-${i + 1}`,
    type,
    x: Math.random() * 600 + 50,
    y: Math.random() * 500 + 50,
  }));

const GAME_CONFIG = {
  time: 30,
  nodeCount: 5,
};

export default function CableConnectionView() {
  const [game, setGame] = useState<GameState>({
    phase: "menu",
    timeLeft: 0,
    nodes: [],
    selectedNode: null,
    connections: [],
    connectionsMade: 0,
  });
  const { changeView } = useGame();

  const startGame = () => {
    const nodes = [
      ...createNodes(GAME_CONFIG.nodeCount, "pwr", "input"),
      ...createNodes(GAME_CONFIG.nodeCount, "sys", "output"),
    ].map((n) => ({ ...n, connected: false }));

    setGame({
      phase: "playing",
      timeLeft: GAME_CONFIG.time,
      nodes,
      selectedNode: null,
      connections: [],
      connectionsMade: 0,
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

  const handleNodeClick = useCallback(
    (nodeId: string) => {
      if (game.phase !== "playing") return;

      const node = game.nodes.find((n) => n.id === nodeId);
      if (!node) return;

      if (game.selectedNode === null) {
        setGame((prev) => ({ ...prev, selectedNode: nodeId }));
      } else if (game.selectedNode === nodeId) {
        setGame((prev) => ({ ...prev, selectedNode: null }));
      } else {
        const selectedNode = game.nodes.find((n) => n.id === game.selectedNode);
        if (selectedNode && selectedNode.type !== node.type) {
          const newConnections = [
            ...game.connections,
            [game.selectedNode, nodeId],
          ];
          const newNodes = game.nodes.map((n) =>
            n.id === nodeId || n.id === game.selectedNode
              ? { ...n, connected: true }
              : n,
          );

          setGame((prev) => ({
            ...prev,
            nodes: newNodes,
            connections: newConnections,
            selectedNode: null,
            connectionsMade: prev.connectionsMade + 1,
          }));

          if (newNodes.every((n) => n.connected)) {
            setTimeout(
              () => setGame((prev) => ({ ...prev, phase: "victory" })),
              500,
            );
          }
        } else {
          setGame((prev) => ({ ...prev, selectedNode: null }));
        }
      }
    },
    [game],
  );

  return (
    <div className="flex h-full flex-col">
      <Card className="border-border/30 bg-background flex-1 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-primary text-sm font-bold">CABLE CONNECTION</h3>
          <div className="text-primary flex gap-4 font-mono text-sm">
            <span>TIME: {game.timeLeft}</span>
          </div>
        </div>

        <div className="relative h-[600px] w-full">
          {game.phase === "menu" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <h2 className="text-primary mb-4 font-mono text-2xl font-bold">
                CABLE CONNECTION
              </h2>
              <p className="text-muted-foreground mb-6 font-mono text-sm">
                Connect all 5 input nodes to 5 output nodes to restore ship
                systems
              </p>
              <Button
                onClick={startGame}
                className="bg-primary text-background hover:bg-primary/80"
              >
                START GAME
              </Button>
            </div>
          )}

          {game.phase === "playing" && (
            <div className="relative h-full w-full">
              {/* Draw connections */}
              <svg className="absolute inset-0 h-full w-full">
                {game.connections.map(([fromId, toId], index) => {
                  const fromNode = game.nodes.find((n) => n.id === fromId);
                  const toNode = game.nodes.find((n) => n.id === toId);
                  if (!fromNode || !toNode) return null;

                  return (
                    <line
                      key={index}
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      stroke="var(--chart-1)"
                      strokeWidth="2"
                    />
                  );
                })}
              </svg>
              {/* Draw nodes */}
              {game.nodes.map((node) => (
                <div
                  key={node.id}
                  className={`bg-primary absolute size-10 cursor-pointer rounded-full transition-all ${
                    game.selectedNode === node.id ? "scale-110" : ""
                  }`}
                  style={{
                    left: node.x - 20,
                    top: node.y - 20,
                  }}
                  onClick={() => handleNodeClick(node.id)}
                >
                  <div className="flex h-full items-center justify-center">
                    <span className="text-background text-xs">
                      {node.label}
                    </span>
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
                <p>
                  Connections: {game.connectionsMade}/{GAME_CONFIG.nodeCount}
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
                ALL SYSTEMS RESTORED!
              </h2>
              <div className="text-muted-foreground mb-6 text-center font-mono text-sm">
                <p>
                  Connections: {game.connectionsMade}/{GAME_CONFIG.nodeCount}
                </p>
                <p className="mt-2 text-green-500">
                  All ship systems operational!
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
          Click input nodes, then output nodes to connect them. Random positions
          each game!
        </div>
      </Card>
    </div>
  );
}
