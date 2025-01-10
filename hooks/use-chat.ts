"use client";

import { useState } from "react";
import {
  Message,
  sendConfidentialMessage,
  sendMessage,
} from "@/app/actions/chat";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMessage = async (content: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const userMessage: Message = { role: "user", content };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);

      const response = await sendMessage(newMessages);

      setMessages([...newMessages, response]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  const addEncryptedMessage = async (content: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const userMessage: Message = { role: "user", content };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);

      const response = await sendConfidentialMessage(newMessages);

      setMessages([...newMessages, response]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    error,
    addMessage,
    addEncryptedMessage,
  };
}
