import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

interface MissionStatusProps {
  shiftStatus: string;
  returnToEarth: string;
  aiUpdateDue: string;
  missionTime: string;
  fleetStatus: string;
}

export function MissionStatus({
  shiftStatus,
  returnToEarth,
  aiUpdateDue,
  missionTime,
}: MissionStatusProps) {
  return (
    <Card className="border-border/30 bg-background col-span-full p-4 md:col-span-1">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-primary text-sm font-bold">MISSION STATUS</h3>
        <MessageSquare className="text-primary h-4 w-4" />
      </div>
      <div className="space-y-2 font-mono text-xs">
        <div className="flex justify-between py-1">
          <span className="text-muted-foreground">Shift Status:</span>
          <span className="text-primary">{shiftStatus}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-muted-foreground">Return to Earth:</span>
          <span className="text-primary">{returnToEarth}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-muted-foreground">AI Update Due:</span>
          <span className="text-primary">{aiUpdateDue}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-muted-foreground">Mission Time:</span>
          <span className="text-primary">{missionTime}</span>
        </div>
      </div>
    </Card>
  );
}
