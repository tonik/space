import {
  FileText,
  Gauge,
  MessageSquare,
  TerminalIcon,
  BookOpen,
} from "lucide-react";
import type { AvailableViewKeys } from "./state";

export const navItems: {
  id: AvailableViewKeys;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: "dashboard",
    label: "Control Dashboard",
    icon: Gauge,
  },
  {
    id: "messaging",
    label: "Communication Center",
    icon: MessageSquare,
  },
  {
    id: "terminal",
    label: "Terminal",
    icon: TerminalIcon,
  },
  {
    id: "logs",
    label: "Ship Logs",
    icon: FileText,
  },
  {
    id: "captains-log",
    label: "Captain's Log",
    icon: BookOpen,
  },
];

export const DEFAULT_DATE_FORMAT = "MM/dd/yy";
export const DEFAULT_DATETIME_FORMAT = "MM/dd/yy HH:mm aa";
