"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: 'CUSTOMER' | 'RIDER' | 'ADMIN';
  content: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export function useChat(conversationId?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;
    setIsLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/chat/conversations/${conversationId}/messages`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      setMessages(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!conversationId) return;

    fetchMessages();

    const supabase = createClient();
    const channel = supabase.channel(`chat:${conversationId}`);

    channel
      .on("broadcast", { event: "NEW_MESSAGE" }, ({ payload }) => {
        console.log("[useChat] Received NEW_MESSAGE", payload);
        setMessages((prev) => {
          if (prev.some(m => m.id === payload.id)) return prev;
          return [...prev, payload];
        });
      })
      .subscribe((status) => {
        console.log(`[useChat] Channel status: ${status}`);
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
      setIsConnected(false);
    };
  }, [conversationId, fetchMessages]);

  const sendMessage = async (senderId: string, senderType: Message['senderType'], content: string, metadata?: Record<string, unknown>) => {
    if (!conversationId) {
        console.error("[useChat] No conversationId provided for sendMessage");
        return;
    }

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      console.log(`[useChat] Sending message to ${API_URL}/chat/conversations/${conversationId}/messages`);
      
      const response = await fetch(`${API_URL}/chat/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ senderId, senderType, content, metadata }),
      });

      if (!response.ok) {
          const errorText = await response.text();
          console.error(`[useChat] Failed to send message: ${response.status} ${response.statusText}`, errorText);
          throw new Error(`Failed to send message: ${errorText}`);
      }
      
      const newMessage = await response.json();
      
      setMessages((prev) => {
        if (prev.some(m => m.id === newMessage.id)) return prev;
        return [...prev, newMessage];
      });

      return newMessage;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      console.error("[useChat] Error sending message:", msg);
      setError(msg);
      throw err;
    }
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    refresh: fetchMessages,
    isConnected
  };
}
