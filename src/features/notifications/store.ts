import type { View } from "@/components/page";
import { create } from "zustand";
import { toast } from "sonner";

export interface INotificationStore {
  notifications: Record<View, boolean>;
  trigger: (msg: string, view?: View) => void;
  dismiss: (view: View) => void;
}

export const useNotificationsStore = create<INotificationStore>((set) => ({
  notifications: {
    dashboard: false,
    messaging: true,
    terminal: false,
    logs: false,
  },
  trigger: (msg: string, view?: View) => {
    if (view) {
      set((state) => ({
        notifications: {
          ...state.notifications,
          [view]: true,
        },
      }));
    }
    toast(msg, {
      description: "Sunday, December 03, 2023 at 9:00 AM",
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
      style: {
        backgroundColor: "var(--foreground)",
        color: "var(--background)",
        border: "1px solid #00ff41",
      },
      duration: 10000,
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
