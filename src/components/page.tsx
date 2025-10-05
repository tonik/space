import { useEffect } from "react";
import { SystemLogView } from "@/features/system-log/view";
import { gameActor, useGame } from "@/state/useGame";
import { useNavigationState } from "@/components/navigation/selectors";
import { MessagingView } from "@/features/messaging/view";
import Navigation from "@/components/navigation";
import TopNav from "@/components/top-nav";
import DashboardView from "@/features/dashboard/view";
import CaptainsLogView from "@/features/captains-log/view";
import TerminalView from "@/features/terminal/view";
import { RefreshWarningDialog } from "@/components/refresh-warning-dialog";
import { ScrollArea } from "./ui/scroll-area";
import { WelcomeScreen } from "./welcome-screen";
import { useSelector } from "@xstate/react";
// import { WelcomeScreen } from "@/components/welcome-screen";

export default function SpaceshipOS() {
  const { changeView, send } = useGame();
  const { activeView } = useNavigationState();
  const showWelcomeState = useSelector(
    gameActor,
    (s) => s.value.gameProgressState === "intro0",
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      send({ type: "KEYPRESS", message: { key: e.key, event: e } });
    };

    window.addEventListener("keypress", handleKeyDown);
    return () => window.removeEventListener("keypress", handleKeyDown);
  }, [send]);

  return (
    <div>
      <RefreshWarningDialog />
      <WelcomeScreen hidden={!showWelcomeState} />
      <div className="text-primary bg-background flex h-screen overflow-hidden font-mono">
        <Navigation activeView={activeView} setActiveView={changeView} />
        <div className="flex flex-1 flex-col">
          <TopNav activeView={activeView} />
          {/* View Content */}
          <ScrollArea className="flex-1 overflow-auto">
            <div className="p-6">
              {activeView === "dashboard" && <DashboardView />}
              {activeView === "communications" && <MessagingView />}
              {activeView === "terminal" && <TerminalView />}
              {activeView === "logs" && <SystemLogView />}
              {activeView.includes("captains-log") && <CaptainsLogView />}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
