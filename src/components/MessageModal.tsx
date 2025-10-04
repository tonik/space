import type { Message } from "@/state/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  SimpleDialog,
  SimpleDialogContent,
  SimpleDialogDescription,
  SimpleDialogHeader,
  SimpleDialogTitle,
} from "@/components/ui/simple-dialog";
import {
  Shield,
  AlertTriangle,
  Clock,
  User,
  MessageSquare,
  Lock,
  AlertCircle,
} from "lucide-react";

interface MessageModalProps {
  message: Message | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MessageModal({ message, isOpen, onClose }: MessageModalProps) {
  if (!message) return null;

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
    <SimpleDialog open={isOpen} onOpenChange={onClose}>
      <SimpleDialogContent className="max-w-2xl" onClose={onClose}>
        <SimpleDialogHeader>
          <div className="flex items-center gap-2">
            {getPriorityIcon(message.priority)}
            <SimpleDialogTitle className="text-left">
              {message.title}
            </SimpleDialogTitle>
          </div>
          <SimpleDialogDescription className="text-left">
            Message details and metadata
          </SimpleDialogDescription>
        </SimpleDialogHeader>

        <div className="space-y-4">
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
                    {message.time}
                  </span>
                </div>
              </div>

              <div className="border-primary/20 border-l-2 pl-4">
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
                <Badge className="bg-primary/10 text-primary border-primary/20">
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
                  className="text-primary border-primary"
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
                  <Badge className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Encrypted
                  </Badge>
                )}
                {message.corrupted && (
                  <Badge className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1">
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
      </SimpleDialogContent>
    </SimpleDialog>
  );
}
