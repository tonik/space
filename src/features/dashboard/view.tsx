import { useGame } from "@/state/useGame";
import { useNotificationsStore } from "@/features/notifications/store";
import { Card } from "@/components/ui/card";
import { Zap, Activity, Globe, AlertTriangle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export default function DashboardView() {
  const { logs } = useGame();

  const recentAlerts = logs.filter(
    (log) => log.level === "WARN" || log.level === "ERROR",
  );

  const { trigger } = useNotificationsStore();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="border-border/30 bg-background p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-primary text-sm font-bold">POWER SYSTEMS</h3>
          <Zap className="text-primary h-4 w-4" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Main Reactor</span>
            <span className="text-primary">98%</span>
          </div>
          <div className="bg-primary/10 h-2 overflow-hidden rounded-full">
            <div className="bg-primary h-full w-[98%]" />
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Auxiliary</span>
            <span className="text-primary">87%</span>
          </div>
          <div className="bg-primary/10 h-2 overflow-hidden rounded-full">
            <div className="bg-primary h-full w-[87%]" />
          </div>
        </div>
      </Card>

      <Card className="border-border/30 bg-background p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-primary text-sm font-bold">LIFE SUPPORT</h3>
          <Activity className="text-primary h-4 w-4" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Oxygen Level</span>
            <span className="text-primary">OPTIMAL</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Temperature</span>
            <span className="text-primary">21.5°C</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Pressure</span>
            <span className="text-primary">101.3 kPa</span>
          </div>
        </div>
      </Card>

      <Card className="border-border/30 bg-background p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-primary text-sm font-bold">NAVIGATION</h3>
          <Globe className="text-primary h-4 w-4" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Velocity</span>
            <span className="text-primary">0.8c</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Heading</span>
            <span className="text-primary">045° MARK 12</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">ETA to Destination</span>
            <span className="text-primary">14.2 HOURS</span>
          </div>
        </div>
      </Card>

      <Card className="border-border/30 bg-background col-span-full p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-primary text-sm font-bold">SYSTEM ALERTS</h3>
          <AlertTriangle className="text-primary h-4 w-4" />
        </div>
        <ScrollArea className="h-[200px] font-mono text-xs">
          <div className="space-y-1">
            {recentAlerts.length === 0 ? (
              <div className="text-muted-foreground/40 py-8 text-center">
                No system logs available
              </div>
            ) : (
              recentAlerts.map((log, i) => (
                <div key={i} className="hover:bg-primary/5 flex gap-3 py-1">
                  <span className="text-muted-foreground">[{log.time}]</span>
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
                  <span className="text-muted-foreground/80">
                    {log.message}
                  </span>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </Card>
      <Card className="border-border/30 bg-background flex flex-col gap-2 p-4">
        <Button
          onClick={() =>
            trigger(
              {
                title: "New message received!",
              },
              "messaging",
            )
          }
        >
          Trigger simple notification
        </Button>
        <Button
          onClick={() =>
            trigger(
              {
                title: "New message received!",
                description: "This is a description of the notification.",
              },
              "messaging",
            )
          }
        >
          Trigger notification with description
        </Button>
        <Button
          onClick={() =>
            trigger(
              {
                title: "New message received!",
                description: "This is a description of the notification.",
                action: {
                  label: "Click me!",
                  onClick: () => console.log("View message"),
                },
              },
              "messaging",
            )
          }
        >
          Trigger notification with action
        </Button>
      </Card>
    </div>
  );
}
