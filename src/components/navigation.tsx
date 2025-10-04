import { Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotificationsStore } from "@/features/notifications/store";
import type { View } from "./page";
import { navItems } from "@/utils";

export default function Navigation({
  activeView,
  setActiveView,
}: {
  activeView: string;
  setActiveView: (view: View) => void;
}) {
  const { notifications } = useNotificationsStore();

  const hasNotification = (id: View) => notifications[id];

  return (
    <div className="flex w-20 flex-col items-center gap-6 border-r border-[#00ff41]/30 bg-black py-6">
      <div className="mb-4 flex h-10 w-10 items-center justify-center border-2 border-[#00ff41]">
        <Radio className="h-5 w-5" />
      </div>

      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.id} className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setActiveView(item.id as View)}
              className={`h-12 w-12 transition-colors hover:bg-[#00ff41]/10 hover:text-[#00ff41] ${
                activeView === item.id
                  ? "border border-[#00ff41] bg-[#00ff41]/20 text-[#00ff41]"
                  : "border border-transparent text-[#00ff41]/60"
              }`}
            >
              <Icon className="h-5 w-5" />
            </Button>
            {hasNotification(item.id as View) && (
              <span className="absolute top-1 right-1 h-2 w-2 animate-pulse rounded-full border border-red-400 bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]" />
            )}
          </div>
        );
      })}
    </div>
  );
}
