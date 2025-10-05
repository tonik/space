import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export function RefreshWarningDialog() {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Detect refresh shortcuts: Ctrl+R, Cmd+R, F5
      if ((e.key === "r" && (e.ctrlKey || e.metaKey)) || e.key === "F5") {
        e.preventDefault();
        setShowWarning(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowWarning(false);
      }
      if (e.key === "Enter") {
        handleConfirmRefresh();
      }
    };
    if (showWarning) {
      window.addEventListener("keydown", handleKeyDown);
    } else {
      window.removeEventListener("keydown", handleKeyDown);
    }
  }, [showWarning]);
  const handleConfirmRefresh = () => {
    window.location.reload();
  };

  const handleCancel = () => {
    setShowWarning(false);
  };

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <Card className="border-primary/50 bg-background w-full max-w-md border-2 p-6">
        <div className="mb-4 flex items-center gap-3">
          <AlertTriangle className="text-primary h-6 w-6" />
          <h2 className="text-primary font-mono text-lg font-bold">
            WARNING: REFRESH DETECTED
          </h2>
        </div>

        <div className="text-muted-foreground mb-6 space-y-2 font-mono text-sm">
          <p>All progress will be lost if you refresh the page.</p>
          <p className="text-primary font-bold">
            The game will start from scratch.
          </p>
          <p>Are you sure you want to continue?</p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleCancel}
            variant="outline"
            className="bg-primary/20 text-primary hover:bg-primary/30 flex-1"
          >
            CANCEL
          </Button>
          <Button
            onClick={handleConfirmRefresh}
            className="border-primary/50 bg-destructive/20 text-destructive hover:bg-destructive/30 flex-1 border"
          >
            REFRESH ANYWAY
          </Button>
        </div>
      </Card>
    </div>
  );
}
