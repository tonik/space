"use client";

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect } from "react";
import { create } from "zustand";

interface Log {
  time: string;
  level: string;
  message: string;
}

interface SystemLogState {
  logs: Log[];
  addLog: (log: Log) => void;
}

const useSystemLogStore = create<SystemLogState>((set) => ({
  logs: [],
  addLog: (log) =>
    set((state) => ({ logs: [...state.logs, log] })),
}));

export function SystemLogView() {
  const { logs, addLog } = useSystemLogStore();

  useEffect(() => {
    addLog(logs[0]);
  }, [addLog, logs]);

  return (
    <div className="max-w-4xl">
      <Card className="bg-black border-[#00ff41]/30 p-4">
        <h3 className="text-sm font-bold text-[#00ff41] mb-4">
          SHIP SYSTEM LOGS
        </h3>
        <ScrollArea className="h-[500px] font-mono text-xs">
          <div className="space-y-1">
            {logs.map((log, i) => (
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
                      : "text-[#00ff41]"
                  }
                >
                  {log.level}
                </span>
                <span className="text-[#00ff41]/80">
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
