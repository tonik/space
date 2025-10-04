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
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "high":
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case "normal":
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case "low":
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: Message["priority"]) => {
    switch (priority) {
      case "critical":
        return "destructive";
      case "high":
        return "secondary";
      case "normal":
        return "default";
      case "low":
        return "outline";
      default:
        return "default";
    }
  };

  const getTypeColor = (type: Message["type"]) => {
    switch (type) {
      case "incoming":
        return "bg-green-500/10 text-green-700 border-green-500/20";
      case "outgoing":
        return "bg-blue-500/10 text-blue-700 border-blue-500/20";
      case "system":
        return "bg-purple-500/10 text-purple-700 border-purple-500/20";
      case "ai":
        return "bg-orange-500/10 text-orange-700 border-orange-500/20";
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-500/20";
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
                <Badge className={getTypeColor(message.type)}>
                  {message.type.toUpperCase()}
                </Badge>
              </div>
            </Card>

            <Card className="p-3">
              <div className="space-y-2">
                <h4 className="text-muted-foreground text-sm font-medium">
                  Priority
                </h4>
                <Badge variant={getPriorityColor(message.priority)}>
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
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Encrypted
                  </Badge>
                )}
                {message.corrupted && (
                  <Badge
                    variant="destructive"
                    className="flex items-center gap-1"
                  >
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
