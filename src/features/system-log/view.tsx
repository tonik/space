import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSystemLogStore } from "./store";

const messages = [
  "Navigation systems online",
  "Life support systems nominal",
  "Engine temperature rising",
  "Communication array active",
  "Shield generator at 85%",
  "Fuel levels critical",
  "Autopilot engaged",
  "Docking sequence initiated",
  "Warning: Proximity alert",
  "System diagnostic complete",
  "Thruster calibration required",
  "Emergency protocols activated",
];
const levels = ["INFO", "WARN", "ERROR"] as const;

export function SystemLogView() {
  const { logs, addLog } = useSystemLogStore();

  const generateSampleLog = () => {
    const randomLevel =
      levels[Math.floor(Math.random() * levels.length)];
    const randomMessage =
      messages[Math.floor(Math.random() * messages.length)];
    const time = new Date().toLocaleTimeString();

    addLog({
      time,
      level: randomLevel,
      message: randomMessage,
    });
  };

  return (
    <div className="max-w-4xl">
      <Card className="bg-black border-[#00ff41]/30 p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-[#00ff41]">
            SHIP SYSTEM LOGS
          </h3>
          <div className="flex gap-2">
            <button
              onClick={generateSampleLog}
              className="px-3 py-1 text-xs bg-[#00ff41]/20 text-[#00ff41] border border-[#00ff41]/30 hover:bg-[#00ff41]/30 transition-colors"
            >
              Add Log
            </button>
          </div>
        </div>
        <ScrollArea className="h-[500px] font-mono text-xs">
          <div className="space-y-1">
            {logs.length === 0 ? (
              <div className="text-[#00ff41]/40 text-center py-8">
                No system logs available
              </div>
            ) : (
              logs.map((log, i) => (
                <div
                  key={i}
                  className="flex gap-3 py-1 hover:bg-[#00ff41]/5"
                >
                  <span className="text-[#00ff41]/60">
                    [{log.time}]
                  </span>
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
                  <span className="text-[#00ff41]/80">
                    {log.message}
                  </span>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
