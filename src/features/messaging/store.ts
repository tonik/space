import { create } from "zustand";

interface Message {
  id: string;
  from: string;
  time: string;
  message: string;
  isRead: boolean;
}

interface MessagingState {
  messages: Message[];
  addMessage: (message: Omit<Message, "id" | "isRead">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearMessages: () => void;
  getUnreadCount: () => number;
}

export const useMessagingStore = create<MessagingState>((set, get) => ({
  messages: [
    {
      id: "1",
      from: "EARTH COMMAND",
      time: "14:23",
      message: "Status report received. Proceed to waypoint Delta.",
      isRead: false,
    },
    {
      id: "2",
      from: "CARGO VESSEL AURORA",
      time: "13:45",
      message: "Requesting docking clearance at Station Gamma.",
      isRead: false,
    },
    {
      id: "3",
      from: "EARTH COMMAND",
      time: "12:10",
      message: "New mission parameters uploaded to your terminal.",
      isRead: false,
    },
    {
      id: "4",
      from: "SCIENCE STATION 7",
      time: "11:30",
      message: "Anomaly detected in sector 7-G. Advise caution.",
      isRead: false,
    },
  ],
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: Date.now().toString(),
          isRead: false,
        },
      ],
    })),
  markAsRead: (id) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, isRead: true } : msg
      ),
    })),
  markAllAsRead: () =>
    set((state) => ({
      messages: state.messages.map((msg) => ({ ...msg, isRead: true })),
    })),
  clearMessages: () => set({ messages: [] }),
  getUnreadCount: () => {
    const state = get();
    return state.messages.filter((msg) => !msg.isRead).length;
  },
}));
