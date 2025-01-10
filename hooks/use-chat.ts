"use client";

import { useState } from "react";
import {
  Message,
  sendConfidentialMessage,
  sendMessage,
} from "@/app/actions/chat";
import { useWhoop } from "@/hooks/use-whoop";
import { Workout } from "@/lib/types";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { profile, recentWorkouts } = useWhoop();

  const addMessage = async (content: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const userMessage: Message = { role: "user", content };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);

      const response = await sendMessage(newMessages, {
        firstName: profile.firstName,
        lastName: profile.lastName,
        workouts: recentWorkouts as Workout[],
      });

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
    messages: messages.length
      ? messages
      : [
          {
            role: "assistant",
            content:
              "Hey sport. I'm your fitness coach for the day! I've got my virtual eyes on your workouts and recovery stats, and I'm here to help you reach those goals. Let's kick some butt, keep it safe, and make sure we're resting up when we need it!",
          },
        ],
    isLoading,
    error,
    addMessage,
    addEncryptedMessage,
  };
}
