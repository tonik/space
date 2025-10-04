import type { ReactNode } from "react";
import { Card } from "./card";
import { ProgressBar } from "./progress-bar";
import type { System, SystemMetric } from "@/state/types";
import { cn } from "@/lib/utils";

interface SystemCardProps {
  title: string;
  icon: ReactNode;
  metrics: SystemMetric[];
  status: System;
  className?: string;
}

export function SystemCard({ title, icon, metrics, status, className = "" }: SystemCardProps) {
  return (
    <Card className={cn(`bg-background p-4 ${className}`)}>
      <div className="mb-1 flex items-center justify-between relative">
        <h3 className="font-bold">{title}</h3>
        {icon}
        {status.critical && (
          <span className="border-destructive bg-destructive shadow-destructive absolute -top-1 -right-1 h-2 w-2 animate-pulse rounded-full border" />
        )}
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
