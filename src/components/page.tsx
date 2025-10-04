import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageSquare,
  Gauge,
  TerminalIcon,
  Globe,
  FileText,
  Radio,
  Zap,
  AlertTriangle,
  Activity,
} from "lucide-react";
import { Terminal } from "@/components/Terminal";
import { SystemLogView } from "@/features/system-log/view";

type View = "messaging" | "dashboard" | "terminal" | "news" | "logs";

export default function SpaceshipOS() {
  const [activeView, setActiveView] = useState<View>("dashboard");
  const [commanderName, setCommanderName] = useState<string>(
    "spaceship-commander",
  );

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
            <Button
              key={item.id}
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
            <TerminalView
              onNameChange={setCommanderName}
              commanderName={commanderName}
            />
          )}
          {activeView === "logs" && <SystemLogView />}
        </div>
      </div>
    </div>
  );
}

function DashboardView() {
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
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs p-2 bg-[#00ff41]/5 border border-[#00ff41]/20">
            <span className="text-[#00ff41]">[INFO]</span>
            <span className="text-[#00ff41]/80">All systems nominal</span>
          </div>
          <div className="flex items-center gap-2 text-xs p-2 bg-[#00ff41]/5 border border-[#00ff41]/20">
            <span className="text-[#00ff41]">[WARN]</span>
            <span className="text-[#00ff41]/80">
              Scheduled maintenance due in 72 hours
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}

function MessagingView() {
  const messages = [
    {
      from: "EARTH COMMAND",
      time: "14:23",
      message: "Status report received. Proceed to waypoint Delta.",
    },
    {
      from: "CARGO VESSEL AURORA",
      time: "13:45",
      message: "Requesting docking clearance at Station Gamma.",
    },
    {
      from: "EARTH COMMAND",
      time: "12:10",
      message: "New mission parameters uploaded to your terminal.",
    },
    {
      from: "SCIENCE STATION 7",
      time: "11:30",
      message: "Anomaly detected in sector 7-G. Advise caution.",
    },
  ];

  return (
    <div className="max-w-4xl">
      <Card className="bg-black border-[#00ff41]/30 p-4 mb-4">
        <h3 className="text-sm font-bold text-[#00ff41] mb-4">
          INCOMING TRANSMISSIONS
        </h3>
        <ScrollArea className="h-[500px]">
          <div className="space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className="border border-[#00ff41]/20 p-3 bg-[#00ff41]/5"
              >
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-bold text-[#00ff41]">
                    {msg.from}
                  </span>
                  <span className="text-xs text-[#00ff41]/60">{msg.time}</span>
                </div>
                <p className="text-sm text-[#00ff41]/80">{msg.message}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type message..."
          className="flex-1 bg-black border border-[#00ff41]/30 px-4 py-2 text-sm text-[#00ff41] placeholder:text-[#00ff41]/40 focus:outline-none focus:border-[#00ff41]"
        />
        <Button className="bg-[#00ff41] text-black hover:bg-[#00ff41]/80">
          SEND
        </Button>
      </div>
    </div>
  );
}

function TerminalView({
  onNameChange,
  commanderName,
}: {
  onNameChange: (name: string) => void;
  commanderName: string;
}) {
  return (
    <Card className="bg-black border-[#00ff41]/30 p-4">
      <Terminal onNameChange={onNameChange} currentName={commanderName} />
    </Card>
  );
}
