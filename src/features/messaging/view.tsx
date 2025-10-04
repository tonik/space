import { useNotificationsStore } from "@/features/notifications/store";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export default function MessagingView() {
  const { notifications, dismiss } = useNotificationsStore();

  useEffect(() => {
    if (notifications.messaging) {
      console.log("dismissing notification");
      dismiss("messaging");
    }
  }, [notifications.messaging, dismiss]);
  const messages = [
    {
      from: "EARTH COMMAND",
      time: "14:23",
      message: "Status report received. Proceed to waypoint Delta.",
    },
    {
      from: "CARGO VESSEL AURORA",
      time: "13:45",
      message: "Requesting docking clearance at Station Gamma.",
    },
    {
      from: "EARTH COMMAND",
      time: "12:10",
      message: "New mission parameters uploaded to your terminal.",
    },
    {
      from: "SCIENCE STATION 7",
      time: "11:30",
      message: "Anomaly detected in sector 7-G. Advise caution.",
    },
  ];

  return (
    <div className="max-w-4xl">
      <Card className="bg-black border-[#00ff41]/30 p-4 mb-4">
        <h3 className="text-sm font-bold text-[#00ff41] mb-4">
          INCOMING TRANSMISSIONS
        </h3>
        <ScrollArea className="h-[500px]">
          <div className="space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className="border border-[#00ff41]/20 p-3 bg-[#00ff41]/5"
              >
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-bold text-[#00ff41]">
                    {msg.from}
                  </span>
                  <span className="text-xs text-[#00ff41]/60">{msg.time}</span>
                </div>
                <p className="text-sm text-[#00ff41]/80">{msg.message}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type message..."
          className="flex-1 bg-black border border-[#00ff41]/30 px-4 py-2 text-sm text-[#00ff41] placeholder:text-[#00ff41]/40 focus:outline-none focus:border-[#00ff41]"
        />
        <Button className="bg-[#00ff41] text-black hover:bg-[#00ff41]/80">
          SEND
        </Button>
      </div>
    </div>
  );
}
