import type { ReactNode } from "react";
import { Card } from "./card";
import { ProgressBar } from "./progress-bar";
import type { System, SystemMetric } from "@/state/game";
import { cn } from "@/lib/utils";

interface SystemCardProps {
  title: string;
  icon: ReactNode;
  metrics: SystemMetric[];
  status: System;
  className?: string;
}

export function SystemCard({ title, icon, metrics, className = "" }: SystemCardProps) {
  return (
    <Card className={cn(`bg-background p-4 ${className}`)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold">{title}</h3>
        {icon}
      </div>
      <div className="space-y-2">
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
    </Card>
  );
}
