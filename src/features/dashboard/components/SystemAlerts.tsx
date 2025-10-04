import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle } from "lucide-react";
import type { LogEntry } from "@/state/types";
import { format } from "date-fns";
import { DEFAULT_DATE_FORMAT } from "@/lib/utils";

interface SystemAlertsProps {
  logs: LogEntry[];
}

function formatTimestamp(timestamp: number) {
  return format(timestamp, DEFAULT_DATE_FORMAT);
}

export function SystemAlerts({ logs }: SystemAlertsProps) {
  const recentAlerts = logs.filter(
    (log) => log.level === "WARN" || log.level === "ERROR",
  );

  return (
    <Card className="border-border/30 bg-background col-span-full p-6">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-primary text-sm font-bold">SYSTEM ALERTS</h3>
        <AlertTriangle className="text-primary h-4 w-4" />
      </div>
      <ScrollArea className="h-[65px] font-mono text-xs">
        <div className="space-y-1">
          {recentAlerts.length === 0 ? (
            <div className="text-muted-foreground/40 py-8 text-center">
              No system logs available
            </div>
          ) : (
            recentAlerts.map((log, i) => (
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
                        : "text-primary"
                  }
                >
                  [{log.level}]
                </span>
                <span className="text-muted-foreground/80">{log.message}</span>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
