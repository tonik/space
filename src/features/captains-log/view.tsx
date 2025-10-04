import { useCaptainsLogState } from "./selectors";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen } from "lucide-react";

const moodColors = {
  routine: "text-primary",
  concerned: "text-yellow-500",
  suspicious: "text-orange-500",
  alarmed: "text-red-400",
  urgent: "text-red-600",
};

export default function CaptainsLogView() {
  const { captainsLog } = useCaptainsLogState();

  // Show entries in reverse chronological order (most recent first)
  const sortedEntries = [...captainsLog].reverse();

  return (
    <div className="flex h-full flex-col">
      <Card className="border-border/30 bg-background flex-1 p-6">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-primary text-sm font-bold">CAPTAIN'S LOG</h3>
          <BookOpen className="text-primary h-4 w-4" />
        </div>
        <ScrollArea className="h-[calc(100vh-200px)] font-mono text-xs">
          <div className="space-y-4">
            {sortedEntries.length === 0 ? (
              <div className="text-muted-foreground/40 py-8 text-center">
                No log entries available
              </div>
            ) : (
              sortedEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="border-border/30 hover:border-primary/30 rounded border p-6 transition-colors"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <div className={`font-bold ${moodColors[entry.mood]}`}>
                        {entry.title}
                      </div>
                      <div className="text-muted-foreground text-[10px]">
                        Stardate {entry.stardate} • {entry.date}
                      </div>
                    </div>
                  </div>
                  <div className="text-muted-foreground/90 leading-relaxed">
                    {entry.content}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
