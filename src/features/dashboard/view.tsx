import { useEffect } from "react";
import { useGame } from "@/state/context";
import { useDashboardState } from "./selectors";
import { SystemCard } from "@/components/ui/system-card";
import {
  Zap,
  Activity,
  Radio,
  Shield,
  Fuel,
  Brain,
  Database,
  Rocket,
  ToolCase,
} from "lucide-react";
import { AIChat } from "./components/AIChat";
import { MissionStatus } from "./components/MissionStatus";
import { SystemDiagnostics } from "./components/SystemDiagnostics";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";

export default function DashboardView() {
  const { systems, diagnostics, mission, repair } = useDashboardState();
  const { startRepair, recoverEnergy, completeRepair, updateDiagnostics } =
    useGame();

  useEffect(() => {
    const interval = setInterval(() => {
      updateDiagnostics();
    }, 2000);

    return () => clearInterval(interval);
  }, [updateDiagnostics]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      Object.entries(repair.activeRepairs).forEach(([, repairData]) => {
        if (now - repairData.startTime >= repairData.duration) {
          completeRepair(repairData.systemName);
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [repair.activeRepairs, completeRepair]);

  useEffect(() => {
    const interval = setInterval(() => {
      recoverEnergy();
    }, 30000);

    return () => clearInterval(interval);
  }, [recoverEnergy]);

  const timeToEarth = "14.2 HOURS";
  const aiUpdateDue = mission.aiUpdateScheduled ? "TOMORROW" : "N/A";
  const missionTime = `${mission.daysInSpace} DAYS`;
  const uptime = `${mission.daysInSpace} DAYS`;

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="grid grid-cols-3 gap-6">
        <div className="flex">
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
        <div className="flex">
          <MissionStatus
            shiftStatus={mission.shiftStatus}
            returnToEarth={timeToEarth}
            aiUpdateDue={aiUpdateDue}
            missionTime={missionTime}
            fleetStatus={mission.fleetStatus}
          />
        </div>
        <div className="flex">
          <Card className="border-border/30 bg-background flex w-full flex-col p-6">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-primary text-sm font-bold">
                REPAIR RESOURCES
              </h3>
              <ToolCase className="text-primary h-4 w-4" />
            </div>
            <div className="space-y-3 font-mono text-xs">
              <div>
                <div className="mb-1 flex justify-between">
                  <span className="text-muted-foreground">Energy</span>
                  <span className="text-primary">
                    {repair.energy}/{repair.maxEnergy}
                  </span>
                </div>
                <ProgressBar
                  value={(repair.energy / repair.maxEnergy) * 100}
                  className="h-2"
                />
                <div className="text-muted-foreground mt-1 text-xs">
                  Recovery: {repair.energyRecoveryRate}/min
                </div>
              </div>
              <div>
                <div className="mb-1 flex justify-between">
                  <span className="text-muted-foreground">Materials</span>
                  <span className="text-primary">{repair.materials}%</span>
                </div>
                <ProgressBar value={repair.materials} className="h-2" />
              </div>
              <div className="border-border/20 border-t pt-2">
                <div className="text-muted-foreground">
                  Active Repairs: {Object.keys(repair.activeRepairs).length}
                </div>
              </div>
            </div>
          </Card>
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
            systemName="aiCore"
            onRepair={startRepair}
            repairState={repair}
          />

          <SystemCard
            title="COMMUNICATIONS"
            icon={<Radio className="h-4 w-4" />}
            metrics={systems.communications.metrics}
            status={systems.communications}
            systemName="communications"
            onRepair={startRepair}
            repairState={repair}
          />

          <SystemCard
            title="WEAPON SYSTEMS"
            icon={<Rocket className="h-4 w-4" />}
            metrics={systems.weapons.metrics}
            status={systems.weapons}
            systemName="weapons"
            onRepair={startRepair}
            repairState={repair}
          />

          <SystemCard
            title="POWER SYSTEMS"
            icon={<Zap className="h-4 w-4" />}
            metrics={systems.power.metrics}
            status={systems.power}
            systemName="power"
            onRepair={startRepair}
            repairState={repair}
          />

          <SystemCard
            title="LIFE SUPPORT"
            icon={<Activity className="h-4 w-4" />}
            metrics={systems.lifeSupport.metrics}
            status={systems.lifeSupport}
            systemName="lifeSupport"
            onRepair={startRepair}
            repairState={repair}
          />

          <SystemCard
            title="DEFENSIVE SYSTEMS"
            icon={<Shield className="h-4 w-4" />}
            metrics={systems.defensive.metrics}
            status={systems.defensive}
            systemName="defensive"
            onRepair={startRepair}
            repairState={repair}
          />

          <SystemCard
            title="PROPULSION"
            icon={<Fuel className="h-4 w-4" />}
            metrics={systems.propulsion.metrics}
            status={systems.propulsion}
            systemName="propulsion"
            onRepair={startRepair}
            repairState={repair}
          />

          <SystemCard
            title="DATA SYSTEMS"
            icon={<Database className="h-4 w-4" />}
            metrics={systems.dataSystems.metrics}
            status={systems.dataSystems}
            systemName="dataSystems"
            onRepair={startRepair}
            repairState={repair}
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
