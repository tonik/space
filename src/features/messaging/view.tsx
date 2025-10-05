import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGame } from "@/state/context";
import { useMessagingState } from "@/state/selectors";
import type { Message } from "@/state/types";
import { MessageDetail } from "@/components/message-detail";
import { User } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { DEFAULT_DATETIME_FORMAT } from "@/lib/utils";
import { useGameDateNow } from "@/state/selectors";
import { ScrollArea } from "@/components/ui/scroll-area";

export function MessagingView() {
  const { messages, unreadCount, openedMessageIds, systems } =
    useMessagingState();
  const { addMessage, openMessage } = useGame();
  const [newMessage, setNewMessage] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "message">("list");
  const isCommunicationsOnline = systems.communications.status === "online";

  const gameDateNow = useGameDateNow();

  const handleSendMessage = () => {
    if (!isCommunicationsOnline) {
      toast("Communications are offline", {
        description: "Please check the communications system",
      });
      return;
    }

    if (newMessage.trim()) {
      const messageId = Date.now().toString();
      addMessage({
        id: messageId,
        from: "YOU",
        timestamp: gameDateNow.getTime(),
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
    if (!openedMessageIds.has(message.id)) {
      openMessage(message.id);
    }
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedMessage(null);
  };

  console.log({
    messages,
    sortedMessages: messages.sort((a, b) => a.timestamp - b.timestamp),
  });

  // Message detail view
  if (viewMode === "message" && selectedMessage) {
    return (
      <MessageDetail message={selectedMessage} onBack={handleBackToList} />
    );
  }

  // Message list view
  return (
    <div className="flex h-[calc(100vh-110px)] flex-col gap-6">
      <Card className="border-border/30 bg-background flex min-h-0 flex-1 flex-col overflow-hidden p-6">
        <div className="mb-1 flex items-center justify-between">
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
        <ScrollArea className="flex-1 overflow-auto">
          <div className="flex min-h-full flex-col-reverse">
            <div className="space-y-3">
              {messages.length === 0 ? (
                <div className="text-muted-foreground/60 py-8 text-center">
                  No messages available
                </div>
              ) : (
                messages
                  .sort((a, b) => b.timestamp - a.timestamp)
                  .map((msg) => {
                    const isRead = openedMessageIds.has(msg.id);

                    return (
                      <div
                        key={msg.id}
                        className={`border-border/20 hover:bg-primary/15 cursor-pointer border p-3 transition-colors ${
                          isRead ? "bg-primary/5" : "bg-primary/10"
                        }`}
                        onClick={() => handleMessageClick(msg)}
                      >
                        <div className="mb-2 flex justify-between">
                          <div className="flex items-center gap-1">
                            <User className="text-muted-foreground h-3 w-3" />
                            <span className="text-card-foreground text-xs font-bold">
                              {msg.from}
                            </span>
                          </div>
                          <span className="text-muted-foreground text-xs">
                            {format(msg.timestamp, DEFAULT_DATETIME_FORMAT)}
                          </span>
                        </div>
                        <span className="text-card-foreground/80 line-clamp-1 text-sm">
                          {msg.preview}
                        </span>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        </ScrollArea>
      </Card>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          className="border-border/30 bg-background text-foreground placeholder:text-muted-foreground focus:border-primary flex-1 border px-4 py-2 text-sm focus:outline-none"
        />
        <Button onClick={handleSendMessage}>SEND</Button>
      </div>
    </div>
  );
}
