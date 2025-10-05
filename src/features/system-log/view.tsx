import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSystemLogState } from "./selectors";
import { Button } from "@/components/ui/button";
import { formatToDateFormat } from "@/lib/utils";
import { useState, useMemo } from "react";
import type { LogEntry } from "@/state/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const logLevels = ["ALL", "DEBUG", "INFO", "WARN", "ERROR", "CRITICAL"];

interface LogFilters {
  level: string;
  system: string;
  search: string;
}

export function SystemLogView() {
  const { logs, availableSystems } = useSystemLogState();
  const [filters, setFilters] = useState<LogFilters>({
    level: "ALL",
    system: "ALL",
    search: "",
  });

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      level: "ALL",
      system: "ALL",
      search: "",
    });
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((log: LogEntry) => {
      if (filters.level !== "ALL" && log.level !== filters.level) {
        return false;
      }

      if (filters.system !== "ALL" && log.system !== filters.system) {
        return false;
      }

      if (
        filters.search &&
        !log.message.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [logs, filters]);

  return (
    <Card className="border-border/30 bg-card flex h-full flex-col p-6">
      {/* Filter Controls */}
      <div className="mb-4 space-y-3">
        <h3 className="text-card-foreground text-sm font-medium">
          System Logs
        </h3>

        <div className="bg-muted/30 grid grid-cols-1 gap-3 rounded-md p-3">
          <Input
            type="text"
            placeholder="Search logs…"
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />

          <Select
            value={filters.level}
            onValueChange={(value) => handleFilterChange("level", value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a level" />
            </SelectTrigger>
            <SelectContent>
              {logLevels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.system}
            onValueChange={(value) => handleFilterChange("system", value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a system" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Systems</SelectItem>
              {availableSystems.map((system) => (
                <SelectItem key={system} value={system}>
                  {system}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex justify-end md:col-span-3">
            <Button
              onClick={clearFilters}
              variant="ghost"
              size="sm"
              className="text-xs"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Logs Display */}
      <ScrollArea className="flex-1 font-mono text-xs">
        <div className="space-y-1">
          {filteredLogs.length === 0 ? (
            <div className="text-muted-foreground/60 py-8 text-center">
              {filters.level !== "ALL" ||
              filters.system !== "ALL" ||
              filters.search
                ? "No logs match the current filters"
                : "No system logs available"}
            </div>
          ) : (
            <div className="grid grid-cols-[auto_auto_auto_1fr] gap-3">
              {filteredLogs.map((log, i) => (
                <div key={i} className="hover:bg-primary/5 contents py-1">
                  <span className="text-muted-foreground">
                    [{formatToDateFormat(log.timestamp)}]
                  </span>
                  <span
                    className={
                      log.level === "WARN"
                        ? "text-yellow-500"
                        : log.level === "ERROR"
                          ? "text-red-400"
                          : log.level === "CRITICAL"
                            ? "text-red-600"
                            : log.level === "DEBUG"
                              ? "text-blue-400"
                              : "text-card-foreground"
                    }
                  >
                    [{log.level}]
                  </span>
                  <span className="text-muted-foreground text-xs">
                    [{log.system}]
                  </span>
                  <span className="text-card-foreground/80">{log.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
