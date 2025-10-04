import {
  FileText,
  Gauge,
  MessageSquare,
  TerminalIcon,
  BookOpen,
  Gamepad2,
} from "lucide-react";
import type { View } from "./components/page";

export const navItems = [
  {
    id: "dashboard" as View,
    label: "Control",
    icon: Gauge,
  },
  {
    id: "messaging" as View,
    label: "Comms",
    icon: MessageSquare,
  },
  {
    id: "terminal" as View,
    label: "Terminal",
    icon: TerminalIcon,
  },
  {
    id: "logs" as View,
    label: "Ship Logs",
    icon: FileText,
  },
  {
    id: "captains-log" as View,
    label: "Captain's Log",
    icon: BookOpen,
  },
  {
    id: "arcade" as View,
    label: "Arcade",
    icon: Gamepad2,
  },
];
