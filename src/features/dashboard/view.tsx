import { useSystemLogStore } from "@/features/system-log/store";
import { useNotificationsStore } from "@/features/notifications/store";
import { Card } from "@/components/ui/card";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity } from "lucide-react";
import { Globe } from "lucide-react";
import { AlertTriangle } from "lucide-react";

export default function DashboardView() {
  const { logs } = useSystemLogStore();

  const recentAlerts = logs.filter(
    (log) => log.level === "WARN" || log.level === "ERROR",
  );

  const { trigger } = useNotificationsStore();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="border-[#00ff41]/30 bg-black p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#00ff41]">POWER SYSTEMS</h3>
          <Zap className="h-4 w-4 text-[#00ff41]" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-[#00ff41]/60">Main Reactor</span>
            <span className="text-[#00ff41]">98%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#00ff41]/10">
            <div className="h-full w-[98%] bg-[#00ff41]" />
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[#00ff41]/60">Auxiliary</span>
            <span className="text-[#00ff41]">87%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#00ff41]/10">
            <div className="h-full w-[87%] bg-[#00ff41]" />
          </div>
        </div>
      </Card>

      <Card className="border-[#00ff41]/30 bg-black p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#00ff41]">LIFE SUPPORT</h3>
          <Activity className="h-4 w-4 text-[#00ff41]" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-[#00ff41]/60">Oxygen Level</span>
            <span className="text-[#00ff41]">OPTIMAL</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[#00ff41]/60">Temperature</span>
            <span className="text-[#00ff41]">21.5°C</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[#00ff41]/60">Pressure</span>
            <span className="text-[#00ff41]">101.3 kPa</span>
          </div>
        </div>
      </Card>

      <Card className="border-[#00ff41]/30 bg-black p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#00ff41]">NAVIGATION</h3>
          <Globe className="h-4 w-4 text-[#00ff41]" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-[#00ff41]/60">Velocity</span>
            <span className="text-[#00ff41]">0.8c</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[#00ff41]/60">Heading</span>
            <span className="text-[#00ff41]">045° MARK 12</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[#00ff41]/60">ETA to Destination</span>
            <span className="text-[#00ff41]">14.2 HOURS</span>
          </div>
        </div>
      </Card>

      <Card className="col-span-full border-[#00ff41]/30 bg-black p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#00ff41]">SYSTEM ALERTS</h3>
          <AlertTriangle className="h-4 w-4 text-[#00ff41]" />
        </div>
        <ScrollArea className="h-[200px] font-mono text-xs">
          <div className="space-y-1">
            {recentAlerts.length === 0 ? (
              <div className="py-8 text-center text-[#00ff41]/40">
                No system logs available
              </div>
            ) : (
              recentAlerts.map((log, i) => (
                <div key={i} className="flex gap-3 py-1 hover:bg-[#00ff41]/5">
                  <span className="text-[#00ff41]/60">[{log.time}]</span>
                  <span
                    className={
                      log.level === "WARN"
                        ? "text-yellow-500"
                        : log.level === "ERROR"
                          ? "text-red-400"
                          : "text-[#00ff41]"
                    }
                  >
                    [{log.level}]
                  </span>
                  <span className="text-[#00ff41]/80">{log.message}</span>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </Card>
      <Card className="flex flex-col gap-2 border-[#00ff41]/30 bg-black p-4">
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
