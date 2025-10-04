import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGame } from "@/state/useGame";

export function SystemLogView() {
  const game = useGame();
  const logs = game.logs;

  const addLog = () => {
    game.addLog({
      time: new Date().toLocaleTimeString(),
      level: "INFO",
      message: "Sample log",
      id: "",
      system: "",
    });
  };

  return (
    <div className="max-w-4xl">
      <Card className="border-[#00ff41]/30 bg-black p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#00ff41]">SHIP SYSTEM LOGS</h3>
          <div className="flex gap-2">
            <button
              onClick={addLog}
              className="border border-[#00ff41]/30 bg-[#00ff41]/20 px-3 py-1 text-xs text-[#00ff41] transition-colors hover:bg-[#00ff41]/30"
            >
              Add Log
            </button>
          </div>
        </div>
        <ScrollArea className="h-[500px] font-mono text-xs">
          <div className="space-y-1">
            {logs.length === 0 ? (
              <div className="py-8 text-center text-[#00ff41]/40">
                No system logs available
              </div>
            ) : (
              logs.map((log, i) => (
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
    </div>
  );
}
