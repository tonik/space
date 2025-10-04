import { Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { View } from "./page";
import { navItems } from "@/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Navigation({
  activeView,
  setActiveView,
}: {
  activeView: string;
  setActiveView: (view: View) => void;
}) {
  return (
    <div className="border-border/30 bg-background flex w-20 flex-col items-center gap-6 border-r py-6">
      <div className="border-primary mb-4 flex h-10 w-10 items-center justify-center border-2">
        <Radio className="h-5 w-5" />
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
                  onClick={() => setActiveView(item.id as View)}
                  className={`hover:bg-primary/10 hover:text-primary h-12 w-12 transition-colors ${
                    activeView === item.id
                      ? "border-primary bg-primary/20 text-primary border"
                      : "text-muted-foreground border border-transparent"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="border-destructive bg-destructive shadow-destructive absolute top-1 right-1 h-2 w-2 animate-pulse rounded-full border" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        );
      })}
    </div>
  );
}
