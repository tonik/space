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

export interface CaptainsLogEntry {
  id: string;
  stardate: string;
  date: string;
  title: string;
  content: string;
  mood: "routine" | "concerned" | "suspicious" | "alarmed" | "urgent";
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
