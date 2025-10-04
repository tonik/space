import type { ReactNode } from "react";
import { Card } from "./card";
import { ProgressBar } from "./progress-bar";
import type { SystemStatus } from "@/state/game";
import { cn } from "@/lib/utils";

interface SystemMetric {
  label: string;
  value: string | number;
  showProgress?: boolean;
  progressValue?: number;
}

interface SystemCardProps {
  title: string;
  icon: ReactNode;
  metrics: SystemMetric[];
  status: SystemStatus;
  className?: string;
}

export function SystemCard({ title, icon, metrics, status, className = "" }: SystemCardProps) {
  return (
    <Card className={cn(`bg-background p-4 ${className}`, {
      "border-red-500 text-red-500": status.status === "critical",
      "border-border/30 text-primary": status.status !== "critical",
    })}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold">
        {title}</h3>
        {icon}
      </div>
      <div className="space-y-2">
        {metrics.map((metric, index) => (
          <div key={index}>
            <div className="flex justify-between text-xs">
              <span>{metric.label}</span>
{metric.value}
            </div>
            {metric.showProgress && metric.progressValue !== undefined && (
              <ProgressBar value={metric.progressValue} className="mt-1" />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
