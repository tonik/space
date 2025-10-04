import type { Message } from "@/state/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Lock, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { DEFAULT_DATETIME_FORMAT } from "@/lib/utils";

interface MessageDetailProps {
  message: Message;
  onBack: () => void;
}

export function MessageDetail({ message, onBack }: MessageDetailProps) {
  function formatTime(timestamp: number) {
    return format(timestamp, DEFAULT_DATETIME_FORMAT);
  }

  return (
    <div className="mb-4">
      {/* Main message container */}
      <Card className="border-border/30 bg-card/50 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground -ml-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-foreground text-xl font-bold">{message.title}</h2>
        </div>

        {/* Metadata grid */}
        <div className="text-muted-foreground grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-medium">From:</span>
            <span className="text-foreground font-medium">{message.from}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Time:</span>
            <span className="text-foreground">
              {formatTime(message.timestamp)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Type:</span>
            <Badge className="bg-primary/10 text-primary border-border/30">
              {message.type.toUpperCase()}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Priority:</span>
            <Badge variant="outline" className="text-primary border-border/30">
              {message.priority.toUpperCase()}
            </Badge>
          </div>
          {(message.encrypted || message.corrupted) && (
            <div className="col-span-2 flex items-center gap-2">
              <span className="font-medium">Security:</span>
              <div className="flex gap-2">
                {message.encrypted && (
                  <Badge className="bg-primary/10 text-primary border-border/30 flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Encrypted
                  </Badge>
                )}
                {message.corrupted && (
                  <Badge className="bg-primary/10 text-primary border-border/30 flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Corrupted
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-border/30 border-t"></div>

        {/* Message content - the star of the show */}
        <div>
          <p className="text-foreground text-base leading-relaxed">
            {message.preview}
          </p>
        </div>

        {/* Message ID - subtle and at the bottom */}
        <div className="text-muted-foreground border-border/30 border-t pt-4 text-xs">
          <span className="font-medium">Message ID:</span>{" "}
          <code className="font-mono">{message.id}</code>
        </div>
      </Card>
    </div>
  );
}
