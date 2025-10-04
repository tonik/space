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
        metrics={systems.aiCore.metrics}
        status={systems.aiCore}
      />

      <SystemCard
        title="COMMUNICATIONS"
        icon={<Radio className="h-4 w-4" />}
        metrics={systems.communications.metrics}
        status={systems.communications}
      />

      <SystemCard
        title="WEAPON SYSTEMS"
        icon={<Rocket className="h-4 w-4" />}
        metrics={systems.weapons.metrics}
        status={systems.weapons}
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
        metrics={systems.defensive.metrics}
        status={systems.defensive}
      />

      <SystemCard
        title="PROPULSION"
        icon={<Fuel className="h-4 w-4" />}
        metrics={systems.propulsion.metrics}
        status={systems.propulsion}
      />

      <SystemCard
        title="DATA SYSTEMS"
        icon={<Database className="h-4 w-4" />}
        metrics={systems.dataSystems.metrics}
        status={systems.dataSystems}
      />
    </div>
  );
}
