import { Button } from "@/components/ui/button";
import { navItems } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Tonik from "/tonik.svg";
import { useNavigationState } from "./navigation/selectors";
import type { AvailableViewKeys } from "@/state";

export default function Navigation({
  activeView,
  setActiveView,
}: {
  activeView: string;
  setActiveView: (view: AvailableViewKeys) => void;
}) {
  const { viewNotifications } = useNavigationState();

  return (
    <div className="border-border/30 bg-background flex w-20 flex-col items-center gap-3 border-r py-6">
      <div className="mb-4 flex h-10 w-10 items-center justify-center">
        <img src={Tonik} alt="Tonik" className="color-primary" />
      </div>

      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.id} className="relative">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setActiveView(item.id)}
                  className={`hover:bg-primary/10 hover:text-primary h-12 w-12 transition-colors ${
                    activeView === item.id
                      ? "border-primary bg-primary/20 text-primary border"
                      : "text-muted-foreground border border-transparent"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {viewNotifications[item.id].length > 0 && (
                    <span className="border-destructive bg-destructive shadow-destructive absolute top-1 right-1 h-2 w-2 animate-pulse rounded-full border" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        );
      })}
    </div>
  );
}
