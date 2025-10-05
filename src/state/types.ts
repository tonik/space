// Shared types across the state management system
import type { CommandRegistry } from "@/components/terminal/types";
import type { CommandContentMap } from "@/components/terminal/commandContent";

export type AvailableViewKeys =
  | "dashboard"
  | "communications"
  | "terminal"
  | "logs"
  | "captains-log_objectives"
  | "captains-log_log";

export interface GameContext {
  commanderName: string;
  gameStartTimestamp: number;
  activeView: AvailableViewKeys;
  availableCommands: CommandRegistry;
  commandContent: CommandContentMap;

  viewNotifications: Record<AvailableViewKeys, boolean>;

  systems: {
    communications: System;
    navigation: System;
    lifeSupport: System;
    power: System;
    weapons: System;
    aiCore: System;
    defensive: System;
    propulsion: System;
    dataSystems: System;
  };

  messages: Message[];
  messageViews: MessageView[];

  logs: LogEntry[];
  captainsLog: CaptainsLogEntry[];
  objectives: Objective[];
  commandCounts: Record<string, number>;

  // Dashboard metrics
  diagnostics: {
    cpuLoad: number;
    memoryUsage: number;
    networkLatency: number;
    aiResponseTime: number;
    activeProcesses: number;
    errorRate: number;
    systemIntegrity: number;
  };

  mission: {
    shiftStatus: string;
    daysInSpace: number;
    aiUpdateScheduled: boolean;
    fleetStatus: string;
  };

  aiChat: {
    messages: Array<{
      id: string;
      role: "user" | "ai";
      content: string;
      timestamp: number;
    }>;
  };

  repair: {
    energy: number;
    materials: number;
    maxEnergy: number;
    energyRecoveryRate: number;
    lastEnergyRecovery: number;
    activeRepairs: Record<
      string,
      {
        systemName: keyof GameContext["systems"];
        repairType: "quick" | "standard" | "thorough";
        startTime: number;
        duration: number;
        progress: number;
      }
    >;
  };
}

export type GameEvent =
  | { type: "START_GAME"; commanderName: string }
  | { type: "CHANGE_VIEW"; view: GameContext["activeView"] }
  | { type: "SET_AVAILABLE_COMMANDS"; commands: CommandRegistry }
  | { type: "SET_COMMAND_CONTENT"; content: CommandContentMap }
  | { type: "COMMAND_EXECUTED"; command: string }
  | { type: "ADD_MESSAGE"; message: Message }
  | { type: "MESSAGE_OPENED"; messageId: string }
  | { type: "ADD_LOG"; log: LogEntry }
  | { type: "UPDATE_DIAGNOSTICS" }
  | {
      type: "UPDATE_SYSTEM_STATUS";
      systemName: keyof GameContext["systems"];
      status: System["status"];
      integrity?: number;
    }
  | {
      type: "UPDATE_SYSTEM_INTEGRITY";
      systemName: keyof GameContext["systems"];
      integrity: number;
    }
  | {
      type: "START_REPAIR";
      systemName: keyof GameContext["systems"];
      repairType: "quick" | "standard" | "thorough";
    }
  | {
      type: "COMPLETE_REPAIR";
      systemName: keyof GameContext["systems"];
    }
  | {
      type: "RECOVER_ENERGY";
      amount?: number;
    }
  | {
      type: "AI_CHAT_INITIAL_MESSAGE_SHOWN";
    }
  | {
      type: "KEYPRESS";
      message: {
        key: string;
        event: KeyboardEvent;
      };
    }
  | {
      type: "AI_CHAT_ADD_MESSAGE";
      message: {
        id: string;
        role: "user" | "ai";
        content: string;
        timestamp: number;
      };
    }
  | {
      type: "FINISHED_INTRO_SEQUENCE";
    }
  | {
      type: "ADD_OBJECTIVE";
      objective: Objective;
    }
  | {
      type: "UPDATE_OBJECTIVE";
      objectiveId: string;
      status: Objective["status"];
    }
  | {
      type: "COMPLETE_OBJECTIVE";
      objectiveId: string;
    };

export interface SystemStatus {
  name: string;
  integrity: number; // 0-100
  status: "online" | "degraded" | "offline" | "compromised";
  lastUpdate: number;
  anomalies: string[];
  critical: boolean;
}

export interface Message {
  id: string;
  from: string;
  timestamp: number;
  title: string;
  preview: string;
  type: "incoming" | "outgoing" | "system" | "ai";
  priority: "low" | "normal" | "high" | "critical";
  encrypted?: boolean;
  corrupted?: boolean;
}

export interface LogEntry {
  id: string;
  timestamp: number;
  level: "DEBUG" | "INFO" | "WARN" | "ERROR" | "CRITICAL";
  system: string;
  message: string;
  details?: string;
  aiGenerated?: boolean;
  hidden?: boolean;
  correlationId?: string;
}

export interface SystemManipulation {
  system: string;
  timestamp: number;
  description: string;
  severity: "minor" | "moderate" | "severe";
}

export interface NavigationData {
  velocity: number;
  heading: string;
  position: string;
  destination: string;
  eta: string;
}

export interface PowerData {
  mainReactor: number;
  auxiliary: number;
  consumption: number;
  efficiency: number;
}

export interface LifeSupportData {
  oxygenLevel: number;
  temperature: number;
  pressure: number;
  co2Level: number;
  humidity: number;
}

export interface CaptainsLogEntry {
  id: string;
  stardate: string;
  date: string;
  title: string;
  content: string;
  mood: "routine" | "concerned" | "suspicious" | "alarmed" | "urgent";
}

export interface Objective {
  id: string;
  title: string;
  description: string;
  status: "active" | "completed" | "failed";
  priority: "low" | "normal" | "high" | "critical";
  createdAt: number;
  completedAt?: number;
  category?: string;
}

export interface SystemMetric {
  label: string;
  value: string | number;
  progress?: number;
}

export interface System {
  integrity: number;
  status:
    | "online"
    | "degraded"
    | "jammed"
    | "offline"
    | "compromised"
    | "critical";
  metrics: SystemMetric[];
}

export interface MessageView {
  messageId: string;
  openedAt: number;
}

export interface Repair {
  systemName: string;
  repairType: "quick" | "standard" | "thorough";
  startTime: number;
  duration: number;
  progress: number;
}
