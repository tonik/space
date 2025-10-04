import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: number;
}

export function AIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "ai",
      content:
        "Hello, Captain. I am ARIA, your AI assistant. How may I help you today?",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isThinking) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content:
          "I'm processing your request, Captain. This feature is currently being configured.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsThinking(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="border-border/30 bg-background flex h-full flex-col p-6">
      <div className="mb-4 flex items-center gap-2">
        <Bot className="text-primary h-4 w-4" />
        <h3 className="text-primary font-mono text-sm font-bold">
          AI ASSISTANT
        </h3>
        <div className="bg-primary/20 ml-auto rounded px-2 py-0.5">
          <span className="text-primary font-mono text-xs">ONLINE</span>
        </div>
      </div>

      <ScrollArea className="mb-4 flex-1 pr-2" ref={scrollRef}>
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded px-3 py-2 ${
                  msg.role === "user"
                    ? "bg-primary/20 text-primary"
                    : "border-border/30 bg-card/50 text-foreground border"
                }`}
              >
                <p className="font-mono text-xs leading-relaxed">
                  {msg.content}
                </p>
              </div>
            </div>
          ))}
          {isThinking && (
            <div className="flex justify-start">
              <div className="border-border/30 bg-card/50 rounded border px-3 py-2">
                <p className="text-muted-foreground font-mono text-xs">
                  Thinking...
                </p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask AI assistant..."
          disabled={isThinking}
          className="text-primary border-border/30 placeholder:text-muted-foreground/50 focus:border-primary/50 flex-1 rounded border bg-transparent px-3 py-2 font-mono text-xs outline-none"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isThinking}
          className="bg-primary/20 text-primary hover:bg-primary/30 rounded p-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </Card>
  );
}
