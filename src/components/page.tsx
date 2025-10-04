import { SystemLogView } from "@/features/system-log/view";
import { useGame } from "@/state/useGame";
import { useNavigationState } from "@/components/navigation/selectors";
import { MessagingView } from "@/features/messaging/view";
import Navigation from "@/components/navigation";
import TopNav from "@/components/top-nav";
import DashboardView from "@/features/dashboard/view";
import CaptainsLogView from "@/features/captains-log/view";
import TerminalView from "@/features/terminal/view";
// import { WelcomeScreen } from "@/components/welcome-screen";

export default function SpaceshipOS() {
  const { changeView } = useGame();
  const { activeView } = useNavigationState();

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
            {activeView === "terminal" && <TerminalView />}
            {activeView === "logs" && <SystemLogView />}
            {activeView === "captains-log" && <CaptainsLogView />}
          </div>
        </div>
      </div>
    </div>
  );
}
