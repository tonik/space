import { useSelector } from "@xstate/react";
import { useGameActor } from "@/state/context";
import { useMemo } from "react";
import type { LogEntry } from "@/state/types";

export const useSystemLogState = () => {
  const { actor: gameActor } = useGameActor();
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
