import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGame } from "@/state/useGame";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export function SystemLogView() {
  const game = useGame();
  const logs = game.logs;

  function formatTimestamp(timestamp: number) {
    return format(timestamp, "MM/dd/yy");
  }

  const addLog = () => {
    game.addLog({
      timestamp: new Date().getTime(),
      level: "INFO",
      message: "Sample log",
      id: "",
      system: "",
    });
  };

  return (
    <Card className="border-border/30 bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-card-foreground text-sm font-bold">
          SHIP SYSTEM LOGS
        </h3>
        <div className="flex gap-2">
          <Button onClick={addLog} variant="outline" size="sm">
            Add Log
          </Button>
        </div>
      </div>
      <ScrollArea className="h-[500px] font-mono text-xs">
        <div className="space-y-1">
          {logs.length === 0 ? (
            <div className="text-muted-foreground/60 py-8 text-center">
              No system logs available
            </div>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="hover:bg-primary/5 flex gap-3 py-1">
                <span className="text-muted-foreground">
                  [{formatTimestamp(log.timestamp)}]
                </span>
                <span
                  className={
                    log.level === "WARN"
                      ? "text-yellow-500"
                      : log.level === "ERROR"
                        ? "text-red-400"
                        : "text-card-foreground"
                  }
                >
                  [{log.level}]
                </span>
                <span className="text-card-foreground/80">{log.message}</span>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
