import type { Message } from "@/state/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Shield,
  AlertTriangle,
  Clock,
  User,
  MessageSquare,
  Lock,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

interface MessageDetailProps {
  message: Message;
  onBack: () => void;
}

export function MessageDetail({ message, onBack }: MessageDetailProps) {
  const getPriorityIcon = (priority: Message["priority"]) => {
    switch (priority) {
      case "critical":
        return <AlertTriangle className="text-primary h-4 w-4" />;
      case "high":
        return <AlertCircle className="text-primary h-4 w-4" />;
      default:
        return <MessageSquare className="text-primary h-4 w-4" />;
    }
  };

  return (
    <Card className="bg-card mb-4 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-card-foreground text-sm font-bold">
            MESSAGE DETAILS
          </h3>
        </div>
      </div>

      <div className="space-y-4">
        {/* Message Header */}
        <div className="flex items-center gap-2">
          {getPriorityIcon(message.priority)}
          <h2 className="text-card-foreground text-lg font-bold">
            {message.title}
          </h2>
        </div>

        {/* Message Content */}
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="text-muted-foreground h-4 w-4" />
                <span className="font-medium">{message.from}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="text-muted-foreground h-4 w-4" />
                <span className="text-muted-foreground text-sm">
                  {format(message.timestamp, "hh:mm aa")}
                </span>
              </div>
            </div>

            <div className="border-border/30 border-l-2 pl-4">
              <p className="text-sm leading-relaxed">{message.preview}</p>
            </div>
          </div>
        </Card>

        {/* Message Metadata */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-3">
            <div className="space-y-2">
              <h4 className="text-muted-foreground text-sm font-medium">
                Type
              </h4>
              <Badge className="bg-primary/10 text-primary border-border/30">
                {message.type.toUpperCase()}
              </Badge>
            </div>
          </Card>

          <Card className="p-3">
            <div className="space-y-2">
              <h4 className="text-muted-foreground text-sm font-medium">
                Priority
              </h4>
              <Badge
                variant="outline"
                className="text-primary border-border/30"
              >
                {message.priority.toUpperCase()}
              </Badge>
            </div>
          </Card>
        </div>

        {/* Security Flags */}
        {(message.encrypted || message.corrupted) && (
          <Card className="p-3">
            <h4 className="text-muted-foreground mb-2 text-sm font-medium">
              Security Status
            </h4>
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
          </Card>
        )}

        {/* Message ID for debugging */}
        <Card className="bg-muted/30 p-3">
          <div className="space-y-1">
            <h4 className="text-muted-foreground text-xs font-medium">
              Message ID
            </h4>
            <code className="text-muted-foreground font-mono text-xs">
              {message.id}
            </code>
          </div>
        </Card>
      </div>
    </Card>
  );
}
