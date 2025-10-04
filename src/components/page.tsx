import { Terminal } from "@/components/terminal";
import { SystemLogView } from "@/features/system-log/view";
import { useGame } from "@/state/useGame";
import { MessagingView } from "@/features/messaging/view";
import Navigation from "@/components/navigation";
import TopNav from "@/components/top-nav";
import DashboardView from "@/features/dashboard/view";
import CaptainsLogView from "@/features/captains-log/view";
// import { WelcomeScreen } from "@/components/welcome-screen";
import ArcadeView from "@/features/arcade/view";

export type View =
  | "messaging"
  | "dashboard"
  | "terminal"
  | "logs"
  | "captains-log"
  | "arcade";

export default function SpaceshipOS() {
  // const { context, changeView, enterMainApp } = useGame();
  const { context, changeView } = useGame();
  const activeView = context.activeView;

  return (
    <div>
      {/* <WelcomeScreen
        hidden={!context.showWelcomeScreen}
        onEnter={enterMainApp}
      /> */}
      <div className="text-primary bg-background flex h-screen overflow-hidden font-mono">
        <Navigation activeView={activeView} setActiveView={changeView} />
        <div className="flex flex-1 flex-col">
          <TopNav activeView={activeView} />
          {/* View Content */}
          <div className="flex-1 overflow-auto p-6">
            {activeView === "dashboard" && <DashboardView />}
            {activeView === "messaging" && <MessagingView />}
            {activeView === "terminal" && <Terminal />}
            {activeView === "logs" && <SystemLogView />}
            {activeView === "captains-log" && <CaptainsLogView />}
            {activeView === "arcade" && <ArcadeView />}
          </div>
        </div>
      </div>
    </div>
  );
}
