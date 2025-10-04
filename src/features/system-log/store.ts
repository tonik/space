import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Log {
  time: string;
  level: "INFO" | "WARN" | "ERROR";
  message: string;
}

interface SystemLogState {
  logs: Log[];
  addLog: (log: Log) => void;
  clearLogs: () => void;
}

export const useSystemLogStore = create<SystemLogState>()(
  persist(
    (set) => ({
      logs: [],
      addLog: (log) =>
        set((state) => ({ logs: [...state.logs, log] })),
      clearLogs: () => set({ logs: [] }),
    }),
    {
      name: "system-log-storage",
      partialize: (state) => ({
        logs: state.logs.slice(-1000),
      }),
    }
  )
);
