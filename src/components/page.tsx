import { useEffect } from "react";
import { SystemLogView } from "@/features/system-log/view";
import { useGame } from "@/state/useGame";
import { useNavigationState } from "@/components/navigation/selectors";
import { MessagingView } from "@/features/messaging/view";
import Navigation from "@/components/navigation";
import TopNav from "@/components/top-nav";
import DashboardView from "@/features/dashboard/view";
import CaptainsLogView from "@/features/captains-log/view";
import TerminalView from "@/features/terminal/view";
import { RefreshWarningDialog } from "@/components/refresh-warning-dialog";
// import { WelcomeScreen } from "@/components/welcome-screen";

export default function SpaceshipOS() {
  const { changeView } = useGame();
  const { activeView } = useNavigationState();

  // Browser's generic warning for refresh button and tab close
  // (Custom dialog handles keyboard shortcuts)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div>
      <RefreshWarningDialog />
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
            {activeView.includes("captains-log") && (
              <CaptainsLogView activeView={activeView} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
