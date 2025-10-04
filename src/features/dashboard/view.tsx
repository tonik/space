import { useEffect } from "react";
import { useGame } from "@/state/useGame";
import { SystemCard } from "@/components/ui/system-card";
import {
  Zap,
  Activity,
  Globe,
  Radio,
  Shield,
  Fuel,
  Brain,
  Database,
  Rocket,
} from "lucide-react";
import { SystemAlerts } from "./components/SystemAlerts";
import { MissionStatus } from "./components/MissionStatus";
import { SystemDiagnostics } from "./components/SystemDiagnostics";

export default function DashboardView() {
  const { logs, systems, context, send } = useGame();

  // Auto-update diagnostics every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      send({ type: "UPDATE_DIAGNOSTICS" });
    }, 2000);

    return () => clearInterval(interval);
  }, [send]);

  // Calculate time to Earth return (14.2 hours from game description)
  const timeToEarth = "14.2 HOURS";
  const aiUpdateDue = context.mission.aiUpdateScheduled ? "TOMORROW" : "N/A";
  const missionTime = `${context.mission.daysInSpace} DAYS`;
  const uptime = `${context.mission.daysInSpace} DAYS`;

  const defaultSystemStatus = {
    status: "online" as const,
    integrity: 100,
    critical: false,
    metrics: [],
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <SystemAlerts logs={logs} />

      <MissionStatus
        shiftStatus={context.mission.shiftStatus}
        returnToEarth={timeToEarth}
        aiUpdateDue={aiUpdateDue}
        missionTime={missionTime}
        fleetStatus={context.mission.fleetStatus}
      />

      <SystemDiagnostics
        cpuLoad={context.diagnostics.cpuLoad}
        memoryUsage={context.diagnostics.memoryUsage}
        networkLatency={context.diagnostics.networkLatency}
        uptime={uptime}
        aiResponseTime={context.diagnostics.aiResponseTime}
        systemIntegrity={context.diagnostics.systemIntegrity}
        activeProcesses={context.diagnostics.activeProcesses}
        errorRate={context.diagnostics.errorRate}
      />

      <SystemCard
        title="AI CORE SYSTEM"
        icon={<Brain className="h-4 w-4" />}
        metrics={[
          {
            label: "AI Status",
            value: "OPERATIONAL",
          },
          {
            label: "Processing Load",
            value: "73%",
            progress: 73,
          },
          {
            label: "Neural Network",
            value: "STABLE",
          },
          {
            label: "Last Update",
            value: "24H AGO",
          },
        ]}
        status={{
          status: "online",
          integrity: 100,
          critical: false,
          metrics: [],
        }}
      />

      <SystemCard
        title="COMMUNICATIONS"
        icon={<Radio className="h-4 w-4" />}
        metrics={[
          {
            label: "Earth Uplink",
            value: "ACTIVE",
          },
          {
            label: "Signal Strength",
            value: "92%",
            progress: 92,
          },
          {
            label: "Last Contact",
            value: "2.3 HOURS",
          },
          {
            label: "Encryption",
            value: "AES-512",
          },
        ]}
        status={systems.communications || defaultSystemStatus}
      />

      <SystemCard
        title="WEAPON SYSTEMS"
        icon={<Rocket className="h-4 w-4" />}
        metrics={[
          {
            label: "Nuclear Arsenal",
            value: "READY",
          },
          {
            label: "Launch Status",
            value: "SAFE",
          },
          {
            label: "Auto-Fire",
            value: "DISABLED",
          },
          {
            label: "24H Countdown",
            value: "INACTIVE",
          },
        ]}
        status={systems.weapons || defaultSystemStatus}
      />

      <SystemCard
        title="POWER SYSTEMS"
        icon={<Zap className="h-4 w-4" />}
        metrics={systems.power.metrics}
        status={systems.power}
      />

      <SystemCard
        title="LIFE SUPPORT"
        icon={<Activity className="h-4 w-4" />}
        metrics={systems.lifeSupport.metrics}
        status={systems.lifeSupport}
      />

      <SystemCard
        title="NAVIGATION"
        icon={<Globe className="h-4 w-4" />}
        metrics={systems.navigation.metrics}
        status={systems.navigation}
      />

      <SystemCard
        title="DEFENSIVE SYSTEMS"
        icon={<Shield className="h-4 w-4" />}
        metrics={[
          {
            label: "Shield Status",
            value: "ONLINE",
          },
          {
            label: "Integrity",
            value: "96%",
            progress: 96,
          },
          {
            label: "Counter Measures",
            value: "READY",
          },
        ]}
        status={systems.weapons || "OPERATIONAL"}
      />

      <SystemCard
        title="PROPULSION"
        icon={<Fuel className="h-4 w-4" />}
        metrics={[
          {
            label: "Main Engine",
            value: "NOMINAL",
          },
          {
            label: "Fuel Level",
            value: "84%",
            progress: 84,
          },
          {
            label: "Thrust Output",
            value: "80%",
            progress: 80,
          },
        ]}
        status={defaultSystemStatus}
      />

      <SystemCard
        title="DATA SYSTEMS"
        icon={<Database className="h-4 w-4" />}
        metrics={[
          {
            label: "Core Memory",
            value: "67%",
            progress: 67,
          },
          {
            label: "Log Storage",
            value: "45%",
            progress: 45,
          },
          {
            label: "Backup Status",
            value: "SYNCED",
          },
        ]}
        status={defaultSystemStatus}
      />
    </div>
  );
}
