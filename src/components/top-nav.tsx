import { Badge } from "@/components/ui/badge";
import { navItems } from "@/utils";
import type { View } from "./page";

export default function TopNav({ activeView }: { activeView: string }) {
  return (
    <div className="flex h-16 items-center justify-between border-b border-[#00ff41]/30 bg-black/50 px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold tracking-wider">
          {navItems
            .find((item) => item.id === (activeView as View))
            ?.label.toUpperCase()}
        </h1>
        <Badge
          variant="outline"
          className="border-[#00ff41] bg-[#00ff41]/10 text-[#00ff41]"
        >
          ONLINE
        </Badge>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <span className="text-[#00ff41]/60">STARDATE: 2425.10.04</span>
        <span className="text-[#00ff41]/60">|</span>
        <span className="text-[#00ff41]/60">SECTOR: ALPHA-7</span>
      </div>
    </div>
  );
}
