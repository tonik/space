import { useSelector } from "@xstate/react";
import { gameActor } from "@/state/useGame";
import { useMemo } from "react";
import type { LogEntry } from "@/state/types";

export const useSystemLogState = () => {
  const logs = useSelector(gameActor, (state) => state.context.logs);

  // Get unique systems for filter dropdown
  const availableSystems = useMemo(() => {
    const systems = new Set(logs.map((log: LogEntry) => log.system));
    return Array.from(systems).sort();
  }, [logs]);

  return {
    logs,
    availableSystems,
  };
};
