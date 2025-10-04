import { useNotificationsStore } from "@/features/notifications/store";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useMessagingStore } from "./store";

export function MessagingView() {
  const { notifications, dismiss } = useNotificationsStore();
  const { messages, addMessage, markAllAsRead, getUnreadCount } = useMessagingStore();
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (notifications.messaging) {
      console.log("dismissing notification");
      dismiss("messaging");
    }
  }, [notifications.messaging, dismiss]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      addMessage({
        from: "YOU",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        message: newMessage.trim(),
      });
      setNewMessage("");
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  return (
    <div className="max-w-4xl">
      <Card className="bg-black border-[#00ff41]/30 p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-[#00ff41]">
            INCOMING TRANSMISSIONS
          </h3>
          <div className="flex gap-2">
            {getUnreadCount() > 0 && (
              <span className="text-xs text-[#00ff41]/60">
                {getUnreadCount()} unread
              </span>
            )}
            <button
              onClick={handleMarkAllAsRead}
              className="px-3 py-1 text-xs bg-[#00ff41]/20 text-[#00ff41] border border-[#00ff41]/30 hover:bg-[#00ff41]/30 transition-colors"
            >
              Mark All Read
            </button>
          </div>
        </div>
        <ScrollArea className="h-[500px]">
          <div className="space-y-3">
            {messages.length === 0 ? (
              <div className="text-[#00ff41]/40 text-center py-8">
                No messages available
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`border border-[#00ff41]/20 p-3 ${
                    msg.isRead ? "bg-[#00ff41]/5" : "bg-[#00ff41]/10"
                  }`}
                >
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-bold text-[#00ff41]">
                      {msg.from}
                    </span>
                    <span className="text-xs text-[#00ff41]/60">{msg.time}</span>
                  </div>
                  <p className="text-sm text-[#00ff41]/80">{msg.message}</p>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </Card>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          className="flex-1 bg-black border border-[#00ff41]/30 px-4 py-2 text-sm text-[#00ff41] placeholder:text-[#00ff41]/40 focus:outline-none focus:border-[#00ff41]"
        />
        <Button 
          onClick={handleSendMessage}
          className="bg-[#00ff41] text-black hover:bg-[#00ff41]/80"
        >
          SEND
        </Button>
      </div>
    </div>
  );
}
