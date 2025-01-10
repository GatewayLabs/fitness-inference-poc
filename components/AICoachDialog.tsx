'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, Send, Lock, Download } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AICoachDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AICoachDialog({ open, onOpenChange }: AICoachDialogProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm your AI Fitness Coach. I can help you analyze your fitness data and provide personalized recommendations. How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        role: 'assistant',
        content: 'Based on your recent sleep patterns and activity levels, I recommend focusing on recovery today. Your deep sleep has been below optimal levels, suggesting you might benefit from an earlier bedtime and reduced evening screen time.',
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Fitness Coach
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col">
          <div className="bg-secondary/30 p-2 rounded-lg mb-4 flex items-center gap-2 text-sm">
            <Lock className="h-4 w-4" />
            Your conversation is end-to-end encrypted
          </div>

          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3 animate-pulse">
                    Thinking...
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="shrink-0"
              onClick={() => {
                // Implement export functionality
                console.log('Exporting conversation...');
              }}
            >
              <Download className="h-4 w-4" />
            </Button>
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Ask your AI coach..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSend();
                  }
                }}
              />
              <Button onClick={handleSend} disabled={!input.trim() || isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}