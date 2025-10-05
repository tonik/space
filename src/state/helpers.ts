import { INITIAL_CURRENT_DATE } from "@/lib";
import type { System, SystemMetric } from "./types";

export function getStatusMultiplier(status: System["status"]): number {
  switch (status) {
    case "online":
      return 1.0;
    case "degraded":
      return 0.7;
    case "jammed":
      return 0.5;
    case "offline":
      return 0.0;
    case "compromised":
      return 0.3;
    case "critical":
      return 0.2;
    default:
      return 1.0;
  }
}

export function generateSystemMetrics(
  systemName: string,
  status: System["status"],
  integrity: number,
): SystemMetric[] {
  const baseIntegrity = Math.max(0, Math.min(100, integrity));
  const statusMultiplier = getStatusMultiplier(status);
  const adjustedIntegrity = Math.round(baseIntegrity * statusMultiplier);

  switch (systemName) {
    case "communications":
      return [
        {
          label: "Earth Uplink",
          value:
            status === "critical" || status === "offline"
              ? "INACTIVE"
              : "ACTIVE",
        },
        {
          label: "Signal Strength",
          value: `${adjustedIntegrity}%`,
          progress: adjustedIntegrity,
        },
        {
          label: "Last Contact",
          value: new Date(
            INITIAL_CURRENT_DATE.getTime() - 15 * 60 * 1000,
          ).toLocaleString(),
        },
        {
          label: "Encryption",
          value: status === "compromised" ? "COMPROMISED" : "AES-512",
        },
      ];

    case "navigation":
      return [
        {
          label: "Velocity",
          value:
            status === "offline"
              ? "0c"
              : status === "degraded"
                ? "0.4c"
                : "0.8c",
        },
        {
          label: "Heading",
          value: status === "offline" ? "UNKNOWN" : "045° MARK 12",
        },
        {
          label: "ETA to Destination",
          value:
            status === "offline"
              ? "UNKNOWN"
              : status === "degraded"
                ? "28.4 HOURS"
                : "14.2 HOURS",
        },
      ];

    case "lifeSupport": {
      const oxygenStatus =
        status === "critical"
          ? "CRITICAL"
          : status === "degraded"
            ? "LOW"
            : "OPTIMAL";
      const tempValue =
        status === "critical"
          ? "35.2°C"
          : status === "degraded"
            ? "28.1°C"
            : "21.5°C";
      const pressureValue =
        status === "critical"
          ? "87.2 kPa"
          : status === "degraded"
            ? "94.8 kPa"
            : "101.3 kPa";

      return [
        {
          label: "Oxygen Level",
          value: oxygenStatus,
        },
        {
          label: "Temperature",
          value: tempValue,
        },
        {
          label: "Pressure",
          value: pressureValue,
        },
      ];
    }

    case "power": {
      const mainReactor =
        status === "offline"
          ? 0
          : status === "degraded"
            ? Math.round(adjustedIntegrity * 0.7)
            : Math.round(adjustedIntegrity * 0.98);
      const auxiliary =
        status === "offline"
          ? 0
          : status === "degraded"
            ? Math.round(adjustedIntegrity * 0.6)
            : Math.round(adjustedIntegrity * 0.87);

      return [
        {
          label: "Main Reactor",
          value: `${mainReactor}%`,
          progress: mainReactor,
        },
        {
          label: "Auxiliary",
          value: `${auxiliary}%`,
          progress: auxiliary,
        },
      ];
    }

    case "weapons":
      return [
        {
          label: "Nuclear Arsenal",
          value:
            status === "offline"
              ? "OFFLINE"
              : status === "compromised"
                ? "COMPROMISED"
                : "READY",
        },
        {
          label: "Launch Status",
          value:
            status === "offline" || status === "compromised"
              ? "DISABLED"
              : "SAFE",
        },
        {
          label: "Auto-Fire",
          value: "DISABLED",
        },
        {
          label: "24H Countdown",
          value: status === "compromised" ? "ACTIVE" : "INACTIVE",
        },
      ];

    case "aiCore": {
      const processingLoad =
        status === "offline"
          ? 0
          : status === "degraded"
            ? Math.round(adjustedIntegrity * 0.5)
            : Math.round(adjustedIntegrity * 0.73);
      const aiStatus =
        status === "offline"
          ? "OFFLINE"
          : status === "compromised"
            ? "COMPROMISED"
            : status === "degraded"
              ? "DEGRADED"
              : "OPERATIONAL";

      return [
        {
          label: "AI Status",
          value: aiStatus,
        },
        {
          label: "Processing Load",
          value: `${processingLoad}%`,
          progress: processingLoad,
        },
        {
          label: "Neural Network",
          value:
            status === "compromised"
              ? "COMPROMISED"
              : status === "degraded"
                ? "UNSTABLE"
                : "STABLE",
        },
        {
          label: "Last Update",
          value: status === "offline" ? "OFFLINE" : "24H AGO",
        },
      ];
    }

    case "defensive": {
      const shieldStatus =
        status === "offline"
          ? "DISABLED"
          : status === "degraded"
            ? "WEAK"
            : status === "critical"
              ? "FAILING"
              : status === "compromised"
                ? "COMPROMISED"
                : "NOMINAL";
      const shieldIntegrity =
        status === "offline"
          ? 0
          : status === "degraded"
            ? Math.round(adjustedIntegrity * 0.6)
            : status === "critical"
              ? Math.round(adjustedIntegrity * 0.3)
              : status === "compromised"
                ? Math.round(adjustedIntegrity * 0.4)
                : adjustedIntegrity;

      return [
        {
          label: "Shield Status",
          value: shieldStatus,
        },
        {
          label: "Integrity",
          value: `${shieldIntegrity}%`,
          progress: shieldIntegrity,
        },
        {
          label: "Counter Measures",
          value: status === "offline" ? "OFFLINE" : "READY",
        },
      ];
    }

    case "propulsion": {
      const fuelLevel =
        status === "offline"
          ? 0
          : status === "degraded"
            ? Math.round(adjustedIntegrity * 0.6)
            : adjustedIntegrity;
      const thrustOutput =
        status === "offline"
          ? 0
          : status === "degraded"
            ? Math.round(adjustedIntegrity * 0.4)
            : Math.round(adjustedIntegrity * 0.8);

      return [
        {
          label: "Main Engine",
          value:
            status === "offline"
              ? "OFFLINE"
              : status === "degraded"
                ? "DEGRADED"
                : "NOMINAL",
        },
        {
          label: "Fuel Level",
          value: `${fuelLevel}%`,
          progress: fuelLevel,
        },
        {
          label: "Thrust Output",
          value: `${thrustOutput}%`,
          progress: thrustOutput,
        },
      ];
    }

    case "dataSystems": {
      const coreMemory =
        status === "offline"
          ? 0
          : status === "degraded"
            ? Math.round(adjustedIntegrity * 0.4)
            : Math.round(adjustedIntegrity * 0.67);
      const logStorage =
        status === "offline"
          ? 0
          : status === "degraded"
            ? Math.round(adjustedIntegrity * 0.3)
            : Math.round(adjustedIntegrity * 0.45);

      return [
        {
          label: "Core Memory",
          value: `${coreMemory}%`,
          progress: coreMemory,
        },
        {
          label: "Log Storage",
          value: `${logStorage}%`,
          progress: logStorage,
        },
        {
          label: "Backup Status",
          value:
            status === "offline"
              ? "OFFLINE"
              : status === "compromised"
                ? "COMPROMISED"
                : "SYNCED",
        },
      ];
    }

    default:
      return [];
  }
}
