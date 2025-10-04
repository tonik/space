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
import MessagingView from "@/features/messaging/view";

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
    <div className="h-screen bg-black text-[#00ff41] font-mono flex overflow-hidden">
      {/* Left Navigation */}
      <div className="w-20 bg-black border-r border-[#00ff41]/30 flex flex-col items-center py-6 gap-6">
        <div className="w-10 h-10 border-2 border-[#00ff41] flex items-center justify-center mb-4">
          <Radio className="w-5 h-5" />
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveView(item.id)}
                className={`w-12 h-12 hover:bg-[#00ff41]/10 hover:text-[#00ff41] transition-colors ${
                  activeView === item.id
                    ? "bg-[#00ff41]/20 text-[#00ff41] border border-[#00ff41]"
                    : "text-[#00ff41]/60 border border-transparent"
                }`}
              >
                <Icon className="w-5 h-5" />
              </Button>
              {hasNotification(item.id) && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-red-400 shadow-[0_0_6px_rgba(239,68,68,0.6)] animate-pulse" />
              )}
            </div>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 border-b border-[#00ff41]/30 flex items-center justify-between px-6 bg-black/50">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold tracking-wider">
              {navItems
                .find((item) => item.id === activeView)
                ?.label.toUpperCase()}
            </h1>
            <Badge
              variant="outline"
              className="border-[#00ff41] text-[#00ff41] bg-[#00ff41]/10"
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
        <div className="flex-1 p-6 overflow-auto">
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="bg-black border-[#00ff41]/30 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[#00ff41]">POWER SYSTEMS</h3>
          <Zap className="w-4 h-4 text-[#00ff41]" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-[#00ff41]/60">Main Reactor</span>
            <span className="text-[#00ff41]">98%</span>
          </div>
          <div className="h-2 bg-[#00ff41]/10 rounded-full overflow-hidden">
            <div className="h-full bg-[#00ff41] w-[98%]" />
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[#00ff41]/60">Auxiliary</span>
            <span className="text-[#00ff41]">87%</span>
          </div>
          <div className="h-2 bg-[#00ff41]/10 rounded-full overflow-hidden">
            <div className="h-full bg-[#00ff41] w-[87%]" />
          </div>
        </div>
      </Card>

      <Card className="bg-black border-[#00ff41]/30 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[#00ff41]">LIFE SUPPORT</h3>
          <Activity className="w-4 h-4 text-[#00ff41]" />
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

      <Card className="bg-black border-[#00ff41]/30 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[#00ff41]">NAVIGATION</h3>
          <Globe className="w-4 h-4 text-[#00ff41]" />
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

      <Card className="bg-black border-[#00ff41]/30 p-4 col-span-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[#00ff41]">SYSTEM ALERTS</h3>
          <AlertTriangle className="w-4 h-4 text-[#00ff41]" />
        </div>
        <ScrollArea className="h-[200px] font-mono text-xs">
          <div className="space-y-1">
            {recentAlerts.length === 0 ? (
              <div className="text-[#00ff41]/40 text-center py-8">
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
      <Button onClick={() => trigger("You have new message!.", "messaging")}>
        Trigger Notification
      </Button>
    </div>
  );
}
