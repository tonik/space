import { create } from "zustand";

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

export const useSystemLogStore = create<SystemLogState>((set) => ({
  logs: [],
  addLog: (log) =>
    set((state) => ({ logs: [...state.logs, log] })),
  clearLogs: () => set({ logs: [] }),
}));
