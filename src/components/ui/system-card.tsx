import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Button } from "@/components/ui/button";
import type { GameContext, Repair, System, SystemMetric } from "@/state/types";
import { cn } from "@/lib/utils";
import { Wrench, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Indicator } from "./indicator";

interface SystemCardProps {
  title: string;
  icon: ReactNode;
  metrics: SystemMetric[];
  status: System;
  className?: string;
  systemName?: keyof GameContext["systems"];
  onRepair?: (systemName: keyof GameContext["systems"], repairType: "quick" | "standard" | "thorough") => void;
  repairState?: {
    energy: number;
    materials: number;
    activeRepairs: Record<string, Repair>;
  };
}

export function SystemCard({ 
  title, 
  icon, 
  metrics, 
  status, 
  className = "", 
  systemName,
  onRepair,
  repairState 
}: SystemCardProps) {
  const isRepairing = systemName && repairState?.activeRepairs && 
    Object.values(repairState.activeRepairs).some((repair) => repair.systemName === systemName);
  
  const canRepair = repairState && repairState.energy >= 10 && repairState.materials >= 5;
  const needsRepair = status.integrity < 90 || status.status !== "online";

  const handleQuickRepair = () => {
    if (systemName && onRepair && canRepair) {
      onRepair(systemName, "quick");
    }
  };

  return (
    <Card className={cn(`bg-background flex flex-col p-6 ${className}`)}>
      <div className="mb-1 flex items-center justify-between relative">
        <h3 className="font-bold">{title}</h3>
        {icon}
        {status.status === "critical" && (
          <Indicator className="absolute -top-1 -right-1" />
        )}
      </div>
      <div className="flex flex-1 flex-col">
        <div className="min-h-[90px] space-y-2">
          {metrics.map((metric, index) => (
            <div key={index}>
              <div className="flex justify-between text-xs">
                <span>{metric.label}</span>
                <span>{metric.value}</span>
              </div>
              {metric.progress !== undefined && (
                <ProgressBar value={metric.progress} className="mt-1" />
              )}
            </div>
          ))}
        </div>

        <Separator className="my-4 h-1" />
        <div className="h-8 flex items-center justify-center">
          {systemName && onRepair && isRepairing ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3 animate-spin" />
              <span>Repair in progress...</span>
            </div>
          ) : systemName && onRepair && needsRepair && canRepair ? (
            <Button
              size="sm"
              variant="outline"
              onClick={handleQuickRepair}
              className="w-full text-xs p-1 h-8"
            >
              <Wrench className="h-3 w-3 mr-1" />
              Quick Repair
            </Button>
          ) : systemName && onRepair && !canRepair ? (
            <div className="text-xs text-muted-foreground text-center">
              Insufficient resources.
            </div>
          ) : (
            <div className="text-xs text-center">
              Optimal.
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
