import { Card } from "@/components/ui/card";
import { Terminal } from "@/components/terminal/view";

export default function TerminalView() {
  return (
    <div className="flex h-full flex-col">
      <Card className="border-border/30 bg-card h-full p-6">
        <Terminal />
      </Card>
    </div>
  );
}
