"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useChat } from "@/hooks/use-chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Brain } from "lucide-react";

export function Chat() {
  const { messages, isLoading, error, addMessage } = useChat();
  const [input, setInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    try {
      await addMessage(input);
      setInput("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <Card className="p-6 border-none bg-gray-50 flex flex-col flex-grow overflow-hidden min-h-fit">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-5 w-5" />
        <h2 className="text-xl font-semibold">AI Fitness Coach</h2>
      </div>

      <ScrollArea className="mb-4 pr-4 flex-grow">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-black text-white"
                    : "bg-white prose prose-sm max-w-none"
                }`}
              >
                {message.role === "user" ? (
                  <p className="m-0">{message.content}</p>
                ) : (
                  <ReactMarkdown
                    className="m-0"
                    components={{
                      p: ({ children }) => (
                        <p className="mb-2 last:mb-0">{children}</p>
                      ),
                      ul: ({ children }) => (
                        <ul className="mb-2 last:mb-0 pl-4">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="mb-2 last:mb-0 pl-4">{children}</ol>
                      ),
                      li: ({ children }) => (
                        <li className="mb-1 last:mb-0">{children}</li>
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white max-w-[80%] rounded-lg p-3">
                Thinking...
              </div>
            </div>
          )}
          {error && (
            <div className="flex justify-center">
              <div className="bg-red-50 text-red-500 max-w-[80%] rounded-lg p-3">
                {error}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your AI coach..."
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-black text-white hover:bg-gray-800"
        >
          Send
        </Button>
      </form>
    </Card>
  );
}
