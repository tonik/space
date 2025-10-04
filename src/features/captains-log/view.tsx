import { useState } from "react";
import { useCaptainsLogState } from "./selectors";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight } from "lucide-react";

export default function CaptainsLogView() {
  const { captainsLog } = useCaptainsLogState();
  const [activeTab, setActiveTab] = useState<"log" | "objectives">("log");
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

  return (
    <div className="flex h-full flex-col">
      <Card className="border-border/30 bg-background flex-1 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-primary text-sm font-bold">ENTRIES</h3>
        </div>

        {/* Tabs */}
        <div className="border-border/30 mb-6 flex gap-1 border-b">
          <button
            onClick={() => setActiveTab("log")}
            className={`text-primary px-4 py-2 font-mono text-sm transition-colors ${
              activeTab === "log"
                ? "border-primary border-b-2 font-bold"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            LOG
          </button>
          <button
            onClick={() => setActiveTab("objectives")}
            className={`text-primary px-4 py-2 font-mono text-sm transition-colors ${
              activeTab === "objectives"
                ? "border-primary border-b-2 font-bold"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            OBJECTIVES
          </button>
        </div>

        {/* Log Tab */}
        {activeTab === "log" && (
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
        {activeTab === "objectives" && (
          <ScrollArea className="h-[calc(100vh-250px)]">
            <div className="space-y-3">
              <div className="text-muted-foreground/40 py-8 text-center font-mono text-sm">
                No active objectives
              </div>
              {/* TODO: Add objectives/quests here */}
            </div>
          </ScrollArea>
        )}
      </Card>
    </div>
  );
}
