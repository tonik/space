import { useEffect } from "react";
import { useGame } from "@/state/useGame";
import { useDashboardState } from "./selectors";
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
import { AIChat } from "./components/AIChat";
import { MissionStatus } from "./components/MissionStatus";
import { SystemDiagnostics } from "./components/SystemDiagnostics";

export default function DashboardView() {
  const { systems, diagnostics, mission } = useDashboardState();
  const { send } = useGame();

  // Auto-update diagnostics every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      send({ type: "UPDATE_DIAGNOSTICS" });
    }, 2000);

    return () => clearInterval(interval);
  }, [send]);

  // Calculate time to Earth return (14.2 hours from game description)
  const timeToEarth = "14.2 HOURS";
  const aiUpdateDue = mission.aiUpdateScheduled ? "TOMORROW" : "N/A";
  const missionTime = `${mission.daysInSpace} DAYS`;
  const uptime = `${mission.daysInSpace} DAYS`;

  return (
    <div className="flex h-full flex-col gap-6">
      {/* Top row - Mainframe Diagnostics and Mission Status */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <SystemDiagnostics
            cpuLoad={diagnostics.cpuLoad}
            memoryUsage={diagnostics.memoryUsage}
            networkLatency={diagnostics.networkLatency}
            uptime={uptime}
            aiResponseTime={diagnostics.aiResponseTime}
            systemIntegrity={diagnostics.systemIntegrity}
            activeProcesses={diagnostics.activeProcesses}
            errorRate={diagnostics.errorRate}
          />
        </div>
        <div className="col-span-1">
          <MissionStatus
            shiftStatus={mission.shiftStatus}
            returnToEarth={timeToEarth}
            aiUpdateDue={aiUpdateDue}
            missionTime={missionTime}
            fleetStatus={mission.fleetStatus}
          />
        </div>
      </div>

      {/* Bottom section - System cards and AI Chat */}
      <div className="grid flex-1 grid-cols-3 gap-6">
        <div className="col-span-2 grid grid-cols-2 gap-6">
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

        {/* AI Chat - Right column */}
        <div className="col-span-1">
          <AIChat />
        </div>
      </div>
    </div>
  );
}
