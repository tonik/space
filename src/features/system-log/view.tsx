import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGame } from "@/state/useGame";
import { useSystemLogState } from "./selectors";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { DEFAULT_DATE_FORMAT } from "@/lib/utils";

export function SystemLogView() {
  const { logs } = useSystemLogState();
  const { addLog: addLogToState } = useGame();

  function formatTimestamp(timestamp: number) {
    return format(timestamp, DEFAULT_DATE_FORMAT);
  }

  const handleAddLog = () => {
    addLogToState({
      timestamp: Date.now(),
      level: "INFO",
      message: "Sample log",
      id: Date.now().toString(),
      system: "SYSTEM",
    });
  };

  return (
    <Card className="border-border/30 bg-card h-full p-6">
      <ScrollArea className="h-full font-mono text-xs">
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

      <div className="flex gap-2">
        <Button onClick={handleAddLog} variant="outline" size="sm">
          Add Log
        </Button>
      </div>
    </Card>
  );
}
