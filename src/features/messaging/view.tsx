import { useNotificationsStore } from "@/features/notifications/store";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useGame } from "@/state/useGame";
import type { Message } from "@/state/types";
import { MessageDetail } from "@/components/message-detail";

export function MessagingView() {
  const { notifications, dismiss } = useNotificationsStore();
  const game = useGame();
  const { messages, unreadCount, addMessage, openMessage } = game;
  const [newMessage, setNewMessage] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "message">("list");

  useEffect(() => {
    if (notifications.messaging) {
      console.log("dismissing notification");
      dismiss("messaging");
    }
  }, [notifications.messaging, dismiss]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const messageId = Date.now().toString();
      addMessage({
        id: messageId,
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
      openMessage(messageId);
      setNewMessage("");
    }
  };

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    setViewMode("message");
    // Also mark as read if it's unread
    if (!game.openedMessageIds.has(message.id)) {
      openMessage(message.id);
    }
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedMessage(null);
  };

  // Message detail view
  if (viewMode === "message" && selectedMessage) {
    return (
      <MessageDetail message={selectedMessage} onBack={handleBackToList} />
    );
  }

  // Message list view
  return (
    <div className="max-w-4xl">
      <Card className="border-border/30 bg-card mb-4 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-card-foreground text-sm font-bold">
            INCOMING TRANSMISSIONS
          </h3>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <span className="text-muted-foreground text-xs">
                {unreadCount} unread
              </span>
            )}
          </div>
        </div>
        <ScrollArea className="h-[500px]">
          <div className="space-y-3">
            {messages.length === 0 ? (
              <div className="text-muted-foreground/60 py-8 text-center">
                No messages available
              </div>
            ) : (
              messages.map((msg) => {
                const isRead = game.openedMessageIds.has(msg.id);

                return (
                  <div
                    key={msg.id}
                    className={`border-border/20 hover:bg-primary/15 cursor-pointer border p-3 transition-colors ${
                      isRead ? "bg-primary/5" : "bg-primary/10"
                    }`}
                    onClick={() => handleMessageClick(msg)}
                  >
                    <div className="mb-2 flex justify-between">
                      <span className="text-card-foreground text-xs font-bold">
                        {msg.from}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {msg.time}
                      </span>
                    </div>
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
          className="border-border/30 bg-background text-foreground placeholder:text-muted-foreground focus:border-primary flex-1 border px-4 py-2 text-sm focus:outline-none"
        />
        <Button onClick={handleSendMessage}>SEND</Button>
      </div>
    </div>
  );
}
