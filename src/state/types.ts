// Shared types across the state management system

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
  to?: string;
  content: string;
  timestamp: number;
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

export interface GameNotification {
  id: string;
  type: "info" | "warning" | "critical";
  message: string;
  timestamp: number;
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
