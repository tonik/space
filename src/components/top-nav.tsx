import { Badge } from "@/components/ui/badge";
import { useDashboardState } from "@/features/dashboard/selectors";
import type { AvailableViewKeys } from "@/state/types";
import { navItems } from "@/lib/utils";
import { useGameActor } from "@/state/context";
import { Button } from "./ui/button";

export default function TopNav({
  activeView,
}: {
  activeView: AvailableViewKeys;
}) {
  const { loadGameState, saveGameState } = useGameActor();
  const { systems } = useDashboardState();
  const communicationsStatus = systems.communications.status;

  const tab = activeView.split("_")[0];

  return (
    <div className="border-border/30 bg-background/50 flex h-16 items-center justify-between border-b px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold tracking-wider">
          {navItems.find((item) => item.id.includes(tab))?.label.toUpperCase()}
        </h1>
        <Badge
          variant="outline"
          className="border-primary bg-primary/10 text-primary uppercase"
        >
          {communicationsStatus}
        </Badge>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <Button onClick={() => saveGameState()}>Save</Button>
        <Button onClick={() => loadGameState()}>Load</Button>
        <span className="text-muted-foreground">STARDATE: 2425.10.04</span>
        <span className="text-muted-foreground">|</span>
        <span className="text-muted-foreground">SECTOR: ALPHA-7</span>
      </div>
    </div>
  );
}
