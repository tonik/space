import { useGame } from "@/state/useGame";
import { useNotificationsStore } from "@/features/notifications/store";
import { Card } from "@/components/ui/card";
import { SystemCard } from "@/components/ui/system-card";
import { Zap, Activity, Globe, AlertTriangle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export default function DashboardView() {
  const { logs, systems } = useGame();

  const recentAlerts = logs.filter(
    (log) => log.level === "WARN" || log.level === "ERROR",
  );

  const { trigger } = useNotificationsStore();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <SystemCard
        title="POWER SYSTEMS"
        icon={<Zap className="h-4 w-4" />}
        metrics={[
          {
            label: "Main Reactor",
            value: "98%",
            showProgress: true,
            progressValue: 98,
          },
          {
            label: "Auxiliary",
            value: "87%",
            showProgress: true,
            progressValue: 87,
          },
        ]}
        status={systems.power}
      />

      <SystemCard
        title="LIFE SUPPORT"
        icon={<Activity className="h-4 w-4" />}
        metrics={[
          {
            label: "Oxygen Level",
            value: "OPTIMAL",
          },
          {
            label: "Temperature",
            value: "21.5°C",
          },
          {
            label: "Pressure",
            value: "101.3 kPa",
          },
        ]}
        status={systems.lifeSupport}
      />

      <SystemCard
        title="NAVIGATION"
        icon={<Globe className="h-4 w-4" />}
        metrics={[
          {
            label: "Velocity",
            value: "0.8c",
          },
          {
            label: "Heading",
            value: "045° MARK 12",
          },
          {
            label: "ETA to Destination",
            value: "14.2 HOURS",
          },
        ]}
        status={systems.navigation}
      />

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
