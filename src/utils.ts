import {
  FileText,
  Gauge,
  MessageSquare,
  TerminalIcon,
  BookOpen,
  Gamepad2,
  Lock,
} from "lucide-react";
import type { AvailableViewKeys } from "./state";

export const navItems: {
  id: AvailableViewKeys;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: "dashboard",
    label: "Control",
    icon: Gauge,
  },
  {
    id: "messaging",
    label: "Comms",
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
  {
    id: "arcade",
    label: "Arcade",
    icon: Gamepad2,
  },
  {
    id: "cipher-game",
    label: "Cipher",
    icon: Lock,
  },
];
