import { useState } from "react";
import { useCaptainsLogState } from "./selectors";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Square, CheckSquare, XSquare } from "lucide-react";
import type { AvailableViewKeys } from "@/state/types";
import { useNavigationState } from "@/components/navigation/selectors";

export default function CaptainsLogView() {
  const { activeView, changeView } = useNavigationState();

  const tab =
    (activeView.split("_")[1] as "log" | "objectives") || ("log" as const);
  const { captainsLog, objectives } = useCaptainsLogState();
  const [openDays, setOpenDays] = useState<Set<number>>(new Set([])); // Day 1 open by default

  // Group entries by day
  const groupedByDay = captainsLog.reduce(
    (acc, entry) => {
      const dayMatch = entry.date.match(/Day (\d+)/);
      const day = dayMatch ? parseInt(dayMatch[1]) : 0;
      if (!acc[day]) acc[day] = [];
      acc[day].push(entry);
      return acc;
    },
    {} as Record<number, typeof captainsLog>,
  );

  const sortedDays = Object.keys(groupedByDay)
    .map(Number)
    .sort((a, b) => b - a); // Reverse chronological

  const toggleDay = (day: number) => {
    setOpenDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) {
        next.delete(day);
      } else {
        next.add(day);
      }
      return next;
    });
  };

  const { viewNotifications } = useNavigationState();

  const hasNotifications = (id: AvailableViewKeys) => {
    return viewNotifications[id];
  };

  return (
    <div className="flex h-full flex-col">
      <Card className="border-border/30 bg-background flex-1 p-6">
        {/* Tabs */}
        <div className="border-border/30 mb-6 flex gap-1 border-b">
          <button
            onClick={() => changeView("captains-log_log")}
            className={`text-primary relative cursor-pointer px-4 py-2 font-mono text-sm transition-colors ${
              tab === "log"
                ? "border-primary border-b-2 font-bold"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            LOG
            {hasNotifications("captains-log_log") && (
              <span className="border-destructive bg-destructive shadow-destructive absolute top-1 right-1 h-2 w-2 animate-pulse rounded-full border" />
            )}
          </button>
          <button
            onClick={() => changeView("captains-log_objectives")}
            className={`text-primary relative cursor-pointer px-4 py-2 font-mono text-sm transition-colors ${
              tab === "objectives"
                ? "border-primary border-b-2 font-bold"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            OBJECTIVES
            {hasNotifications("captains-log_objectives") && (
              <span className="border-destructive bg-destructive shadow-destructive absolute top-1 right-1 h-2 w-2 animate-pulse rounded-full border" />
            )}
          </button>
        </div>

        {/* Log Tab */}
        {tab === "log" && (
          <ScrollArea className="h-[calc(100vh-250px)]">
            <div className="space-y-2">
              {sortedDays.length === 0 ? (
                <div className="text-muted-foreground/40 py-8 text-center font-mono text-sm">
                  No log entries available
                </div>
              ) : (
                sortedDays.map((day) => (
                  <div key={day} className="border-border/20 border-b pb-2">
                    {/* Accordion Header */}
                    <button
                      onClick={() => toggleDay(day)}
                      className="text-primary hover:text-primary/80 flex w-full items-center gap-2 py-2 font-mono text-sm transition-colors"
                    >
                      <ChevronRight
                        className={`h-4 w-4 transition-transform ${
                          openDays.has(day) ? "rotate-90" : ""
                        }`}
                      />
                      <span className="font-bold">DAY {day}</span>
                      <span className="text-muted-foreground">
                        — {groupedByDay[day][0]?.title}
                      </span>
                    </button>

                    {/* Accordion Content */}
                    {openDays.has(day) && (
                      <div className="mt-2 ml-6 space-y-4 pb-3">
                        {groupedByDay[day].map((entry) => (
                          <div key={entry.id} className="space-y-2">
                            <div className="text-muted-foreground font-mono text-xs">
                              Stardate {entry.stardate}
                            </div>
                            <p className="text-foreground/90 font-mono text-sm leading-relaxed">
                              {entry.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        )}

        {/* Objectives Tab */}
        {tab === "objectives" && (
          <ScrollArea className="h-[calc(100vh-250px)]">
            <div className="space-y-1">
              {objectives.length === 0 ? (
                <div className="text-muted-foreground/40 py-8 text-center font-mono text-sm">
                  No active objectives
                </div>
              ) : (
                <>
                  {objectives
                    .sort((a, b) => {
                      // Sort by status first (active, completed, failed)
                      const statusOrder = {
                        active: 0,
                        completed: 1,
                        failed: 2,
                      };
                      if (statusOrder[a.status] !== statusOrder[b.status]) {
                        return statusOrder[a.status] - statusOrder[b.status];
                      }
                      // Then by priority
                      const priorityOrder = {
                        critical: 0,
                        high: 1,
                        normal: 2,
                        low: 3,
                      };
                      return (
                        priorityOrder[a.priority] - priorityOrder[b.priority]
                      );
                    })
                    .map((objective) => {
                      const isCompleted = objective.status === "completed";
                      const isFailed = objective.status === "failed";
                      const isActive = objective.status === "active";

                      return (
                        <div
                          key={objective.id}
                          className={`hover:bg-card/20 border-border/20 flex items-start gap-3 border-b px-2 py-3 transition-colors ${
                            isCompleted || isFailed ? "opacity-50" : ""
                          }`}
                        >
                          {/* Checkbox */}
                          <div className="mt-0.5">
                            {isCompleted && (
                              <CheckSquare className="text-primary h-4 w-4" />
                            )}
                            {isFailed && (
                              <XSquare className="text-destructive h-4 w-4" />
                            )}
                            {isActive && (
                              <Square className="text-muted-foreground h-4 w-4" />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 space-y-1">
                            <div className="flex items-start justify-between gap-2">
                              <h4
                                className={`text-foreground font-mono text-sm ${
                                  isCompleted || isFailed
                                    ? "line-through"
                                    : "font-bold"
                                }`}
                              >
                                {objective.title}
                              </h4>
                              <Badge
                                variant="outline"
                                className={`text-primary border-border/30 whitespace-nowrap ${
                                  objective.priority === "critical"
                                    ? "border-destructive/50 text-destructive"
                                    : objective.priority === "high"
                                      ? "border-primary/50 text-primary"
                                      : ""
                                }`}
                              >
                                {objective.priority.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground font-mono text-xs leading-relaxed">
                              {objective.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </>
              )}
            </div>
          </ScrollArea>
        )}
      </Card>
    </div>
  );
}
