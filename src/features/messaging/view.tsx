import { useNotificationsStore } from "@/features/notifications/store";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useGame } from "@/state/useGame";

export function MessagingView() {
  const { notifications, dismiss } = useNotificationsStore();
  const game = useGame();
  const { messages, unreadCount, addMessage, openMessage } = game;
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
        id: Date.now().toString(),
        from: "YOU",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        title: "Outgoing Message",
        preview: newMessage.trim(),
        type: "outgoing",
        priority: "normal",
      });
      setNewMessage("");
    }
  };

  const handleMarkAllAsRead = () => {
    messages.forEach((msg) => {
      if (!game.openedMessageIds.has(msg.id)) {
        openMessage(msg.id);
      }
    });
  };

  return (
    <div className="max-w-4xl">
      <Card className="mb-4 border-[#00ff41]/30 bg-black p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#00ff41]">
            INCOMING TRANSMISSIONS
          </h3>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <span className="text-xs text-[#00ff41]/60">
                {unreadCount} unread
              </span>
            )}
            <button
              onClick={handleMarkAllAsRead}
              className="border border-[#00ff41]/30 bg-[#00ff41]/20 px-3 py-1 text-xs text-[#00ff41] transition-colors hover:bg-[#00ff41]/30"
            >
              Mark All Read
            </button>
          </div>
        </div>
        <ScrollArea className="h-[500px]">
          <div className="space-y-3">
            {messages.length === 0 ? (
              <div className="py-8 text-center text-[#00ff41]/40">
                No messages available
              </div>
            ) : (
              messages.map((msg) => {
                const isRead = game.openedMessageIds.has(msg.id);
                
                return (
                  <div
                    key={msg.id}
                    className={`border border-[#00ff41]/20 p-3 ${
                      isRead ? "bg-[#00ff41]/5" : "bg-[#00ff41]/10"
                    }`}
                    onClick={() => !isRead && openMessage(msg.id)}
                  >
                    <div className="mb-2 flex justify-between">
                      <span className="text-xs font-bold text-[#00ff41]">
                        {msg.from}
                      </span>
                      <span className="text-xs text-[#00ff41]/60">
                        {msg.time}
                      </span>
                    </div>
                    <p className="text-sm text-[#00ff41]/80">{msg.preview}</p>
                  </div>
                );
              })
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
          className="flex-1 border border-[#00ff41]/30 bg-black px-4 py-2 text-sm text-[#00ff41] placeholder:text-[#00ff41]/40 focus:border-[#00ff41] focus:outline-none"
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
