import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Gauge,
  TerminalIcon,
  FileText,
  Radio,
  Zap,
  AlertTriangle,
  Activity,
  Globe,
} from "lucide-react";
import { Terminal } from "@/components/Terminal";
import { SystemLogView } from "@/features/system-log/view";
import { useSystemLogStore } from "@/features/system-log/store";
import { useGame } from "@/state/useGame";

import { useNotificationsStore } from "@/features/notifications/store";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessagingView } from "@/features/messaging/view";

export type View = "messaging" | "dashboard" | "terminal" | "logs";

export default function SpaceshipOS() {
  useGame();
  const [activeView, setActiveView] = useState<View>("dashboard");
  const [commanderName, setCommanderName] = useState<string>(
    "spaceship-commander",
  );

  const { notifications } = useNotificationsStore();

  const navItems = [
    {
      id: "dashboard" as View,
      label: "Control",
      icon: Gauge,
    },
    {
      id: "messaging" as View,
      label: "Comms",
      icon: MessageSquare,
    },
    {
      id: "terminal" as View,
      label: "Terminal",
      icon: TerminalIcon,
    },
    {
      id: "logs" as View,
      label: "Ship Logs",
      icon: FileText,
    },
  ];

  const hasNotification = (id: View) => notifications[id];

  return (
    <div className="flex h-screen overflow-hidden bg-black font-mono text-[#00ff41]">
      {/* Left Navigation */}
      <div className="flex w-20 flex-col items-center gap-6 border-r border-[#00ff41]/30 bg-black py-6">
        <div className="mb-4 flex h-10 w-10 items-center justify-center border-2 border-[#00ff41]">
          <Radio className="h-5 w-5" />
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveView(item.id)}
                className={`h-12 w-12 transition-colors hover:bg-[#00ff41]/10 hover:text-[#00ff41] ${
                  activeView === item.id
                    ? "border border-[#00ff41] bg-[#00ff41]/20 text-[#00ff41]"
                    : "border border-transparent text-[#00ff41]/60"
                }`}
              >
                <Icon className="h-5 w-5" />
              </Button>
              {hasNotification(item.id) && (
                <span className="absolute top-1 right-1 h-2 w-2 animate-pulse rounded-full border border-red-400 bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]" />
              )}
            </div>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-[#00ff41]/30 bg-black/50 px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold tracking-wider">
              {navItems
                .find((item) => item.id === activeView)
                ?.label.toUpperCase()}
            </h1>
            <Badge
              variant="outline"
              className="border-[#00ff41] bg-[#00ff41]/10 text-[#00ff41]"
            >
              ONLINE
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-[#00ff41]/60">STARDATE: 2425.10.04</span>
            <span className="text-[#00ff41]/60">|</span>
            <span className="text-[#00ff41]/60">SECTOR: ALPHA-7</span>
          </div>
        </div>

        {/* View Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeView === "dashboard" && <DashboardView />}
          {activeView === "messaging" && <MessagingView />}
          {activeView === "terminal" && (
            <Terminal
              onNameChange={setCommanderName}
              currentName={commanderName}
            />
          )}
          {activeView === "logs" && <SystemLogView />}
        </div>
      </div>
    </div>
  );
}

function DashboardView() {
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
            trigger({
              title: "New message received!",
            })
          }
        >
          Trigger simple notification
        </Button>
        <Button
          onClick={() =>
            trigger({
              title: "New message received!",
              description: "This is a description of the notification.",
            })
          }
        >
          Trigger notification with description
        </Button>
        <Button
          onClick={() =>
            trigger({
              title: "New message received!",
              description: "This is a description of the notification.",
              action: {
                label: "Click me!",
                onClick: () => console.log("View message"),
              },
            })
          }
        >
          Trigger notification with action
        </Button>
      </Card>
    </div>
  );
}
