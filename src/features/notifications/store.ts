import type { View } from "@/components/page";
import { create } from "zustand";
import { toast } from "sonner";

export interface INotificationStore {
  notifications: Record<View, boolean>;
  trigger: (msg: IMessage, view?: View) => void;
  dismiss: (view: View) => void;
}

export interface IMessage {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const useNotificationsStore = create<INotificationStore>((set) => ({
  notifications: {
    dashboard: false,
    messaging: true,
    terminal: false,
    logs: false,
  },
  trigger: (msg: IMessage, view?: View) => {
    if (view) {
      set((state) => ({
        notifications: {
          ...state.notifications,
          [view]: true,
        },
      }));
    }
    toast(msg.title, {
      ...(msg.description && { description: msg.description }),
      ...(msg.action && { action: msg.action }),
      style: {
        backgroundColor: "var(--foreground)",
        color: "#00ff41",
        border: "1px solid #00ff41",
      },
      duration: 4000,
    });
  },
  dismiss: (view: View) => {
    set((state) => ({
      notifications: {
        ...state.notifications,
        [view]: false,
      },
    }));
  },
}));
