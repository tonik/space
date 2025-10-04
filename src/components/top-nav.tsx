import { Badge } from "@/components/ui/badge";
import type { AvailableViewKeys } from "@/state";
import { navItems } from "@/utils";

export default function TopNav({
  activeView,
}: {
  activeView: AvailableViewKeys;
}) {
  return (
    <div className="border-border/30 bg-background/50 flex h-16 items-center justify-between border-b px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold tracking-wider">
          {navItems.find((item) => item.id === activeView)?.label.toUpperCase()}
        </h1>
        <Badge
          variant="outline"
          className="border-primary bg-primary/10 text-primary"
        >
          ONLINE
        </Badge>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <span className="text-muted-foreground">STARDATE: 2425.10.04</span>
        <span className="text-muted-foreground">|</span>
        <span className="text-muted-foreground">SECTOR: ALPHA-7</span>
      </div>
    </div>
  );
}
