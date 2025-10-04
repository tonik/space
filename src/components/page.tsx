import { Terminal } from "@/components/Terminal";
import { SystemLogView } from "@/features/system-log/view";
import { useGame } from "@/state/useGame";
import { MessagingView } from "@/features/messaging/view";
import Navigation from "@/components/navigation";
import TopNav from "@/components/top-nav";
import DashboardView from "@/features/dashboard/view";

export type View = "messaging" | "dashboard" | "terminal" | "logs";

export default function SpaceshipOS() {
  const { context, changeView } = useGame();
  const activeView = context.activeView;

  return (
    <div className="text-primary flex h-screen overflow-hidden bg-black font-mono">
      <Navigation activeView={activeView} setActiveView={changeView} />
      <div className="flex flex-1 flex-col">
        <TopNav activeView={activeView} />

        {/* View Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeView === "dashboard" && <DashboardView />}
          {activeView === "messaging" && <MessagingView />}
          {activeView === "terminal" && <Terminal />}
          {activeView === "logs" && <SystemLogView />}
        </div>
      </div>
    </div>
  );
}
