import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useLanguage } from "@/hooks/use-language";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Bot, X, Send, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  message: string;
  isFromUser: boolean;
  timestamp: Date;
}

export default function ChatWidget() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      message: t("chatGreeting"),
      isFromUser: false,
      timestamp: new Date(),
    },
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef(Date.now().toString());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/chat", {
        sessionId: sessionId.current,
        message,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          message: data.response,
          isFromUser: false,
          timestamp: new Date(),
        },
      ]);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          message: "Kechirasiz, texnik xatolik yuz berdi. Iltimos, keyinroq urinib ko'ring.",
          isFromUser: false,
          timestamp: new Date(),
        },
      ]);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentMessage.trim() || chatMutation.isPending) return;

    const userMessage = currentMessage.trim();
    setCurrentMessage("");

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        message: userMessage,
        isFromUser: true,
        timestamp: new Date(),
      },
    ]);

    // Send to AI
    chatMutation.mutate(userMessage);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="lg"
        className={cn(
          "rounded-full w-16 h-16 shadow-2xl chat-widget",
          isOpen && "scale-0"
        )}
        data-testid="button-chat-toggle"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      {/* Chat panel */}
      <Card
        className={cn(
          "absolute bottom-20 right-0 w-80 h-96 shadow-2xl transition-all duration-300 origin-bottom-right",
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
        )}
        data-testid="chat-panel"
      >
        <CardHeader className="bg-primary text-white p-4 rounded-t-lg flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5" />
            <span className="font-semibold">{t("chatTitle")}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-blue-700 p-1 h-6 w-6"
            data-testid="button-chat-close"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="p-0 flex flex-col h-full">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" data-testid="chat-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.isFromUser ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] p-3 rounded-lg text-sm",
                    message.isFromUser
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-900"
                  )}
                  data-testid={`chat-message-${message.id}`}
                >
                  {message.message}
                </div>
              </div>
            ))}
            
            {chatMutation.isPending && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 p-3 rounded-lg text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder={t("chatPlaceholder")}
                disabled={chatMutation.isPending}
                className="flex-1"
                data-testid="input-chat"
              />
              <Button
                type="submit"
                disabled={!currentMessage.trim() || chatMutation.isPending}
                size="sm"
                data-testid="button-chat-send"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
