import { Card } from "@/components/ui/card";
import { Cpu } from "lucide-react";

interface SystemDiagnosticsProps {
  cpuLoad: number;
  memoryUsage: number;
  networkLatency: number;
  uptime: string;
  aiResponseTime: number;
  systemIntegrity: number;
  activeProcesses: number;
  errorRate: number;
}

export function SystemDiagnostics({
  cpuLoad,
  memoryUsage,
  networkLatency,
  uptime,
  aiResponseTime,
  systemIntegrity,
  activeProcesses,
  errorRate,
}: SystemDiagnosticsProps) {
  return (
    <Card className="border-border/30 bg-background col-span-full p-4 md:col-span-2">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-primary text-sm font-bold">SYSTEM DIAGNOSTICS</h3>
        <Cpu className="text-primary h-4 w-4" />
      </div>
      <div className="grid grid-cols-2 gap-4 font-mono text-xs md:grid-cols-4">
        <div>
          <div className="text-muted-foreground mb-1">CPU Load</div>
          <div className="text-primary">{Math.round(cpuLoad)}%</div>
        </div>
        <div>
          <div className="text-muted-foreground mb-1">Memory Usage</div>
          <div className="text-primary">{Math.round(memoryUsage)}%</div>
        </div>
        <div>
          <div className="text-muted-foreground mb-1">Network Latency</div>
          <div className="text-primary">{networkLatency.toFixed(1)}s</div>
        </div>
        <div>
          <div className="text-muted-foreground mb-1">Uptime</div>
          <div className="text-primary">{uptime}</div>
        </div>
        <div>
          <div className="text-muted-foreground mb-1">AI Response Time</div>
          <div className="text-primary">{aiResponseTime.toFixed(2)}s</div>
        </div>
        <div>
          <div className="text-muted-foreground mb-1">System Integrity</div>
          <div className="text-primary">{systemIntegrity.toFixed(1)}%</div>
        </div>
        <div>
          <div className="text-muted-foreground mb-1">Active Processes</div>
          <div className="text-primary">{Math.round(activeProcesses)}</div>
        </div>
        <div>
          <div className="text-muted-foreground mb-1">Error Rate</div>
          <div className="text-primary">{errorRate.toFixed(3)}%</div>
        </div>
      </div>
    </Card>
  );
}
