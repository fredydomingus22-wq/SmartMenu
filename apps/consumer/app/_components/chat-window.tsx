import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Bot, Loader2, Image as ImageIcon } from "lucide-react";
import { Button, Input, ScrollArea, Avatar, cn } from "@smart-menu/ui";
import { useChat } from "@/hooks/use-chat";
import { createClient } from "@/utils/supabase/client";
import { uploadChatImage } from "../actions/chat-storage";
import Image from "next/image";

interface ChatWindowProps {
  tenantId: string;
  orderId?: string;
  riderId?: string;
  openByDefault?: boolean;
}

export function ChatWindow({ tenantId, orderId, riderId, openByDefault = false }: ChatWindowProps) {
  const [isOpen, setIsOpen] = useState(openByDefault);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, isLoading, isConnected } = useChat(conversationId || undefined);

  useEffect(() => {
    const initUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    initUser();
  }, []);

  const handleOpen = useCallback(async () => {
    setIsOpen(true);
    if (!conversationId && userId) {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        let endpoint = `${API_URL}/chat/conversations/support`;
        let body: Record<string, unknown> = { tenantId, customerId: userId };

        if (orderId) {
          endpoint = `${API_URL}/chat/conversations/order`;
          body = { tenantId, orderId, customerId: userId, riderId };
        }

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = await response.json();
        setConversationId(data.id);
      } catch (err) {
        console.error("Failed to init chat", err);
      }
    }
  }, [conversationId, userId, tenantId, orderId, riderId]);

  useEffect(() => {
    if (openByDefault && isOpen && !conversationId && userId) {
      handleOpen();
    }
  }, [openByDefault, userId, conversationId, isOpen, handleOpen]);

  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || !userId || !conversationId) {
      if (!conversationId) console.warn("[ChatWindow] Skip sending: no conversationId yet");
      return;
    }
    try {
      await sendMessage(userId, 'CUSTOMER', input);
      setInput("");
    } catch (err) {
      console.error("Failed to send", err);
    }
  }, [input, userId, conversationId, sendMessage]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const publicUrl = await uploadChatImage(formData);
      
      if (publicUrl) {
        await sendMessage(userId, 'CUSTOMER', 'Imagem enviada', { image: publicUrl });
      }
    } catch (error) {
      console.error("Failed to upload image", error);
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [userId, sendMessage]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  if (!isOpen) {
    return (
      <Button
        onClick={handleOpen}
        className="fixed bottom-6 left-6 h-14 w-14 rounded-full shadow-2xl z-50 p-0"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 w-80 sm:w-96 h-[500px] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
      {/* Header */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-primary text-primary-foreground">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 border-2 border-primary-foreground/20">
            <Bot className="h-4 w-4" />
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold leading-none">Suporte SmartMenu</p>
              <div 
                className={cn(
                  "h-2 w-2 rounded-full",
                  isConnected ? "bg-emerald-400 animate-pulse" : "bg-red-400"
                )} 
                title={isConnected ? "Conectado" : "Desconectado"}
              />
            </div>
            <p className="text-[10px] opacity-80 mt-1">
              {isConnected ? "Sempre online para ajudar" : "Tentando conectar..."}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="hover:bg-white/10 text-primary-foreground">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 && !isLoading && (
            <div className="text-center py-10 opacity-40">
              <MessageCircle className="h-10 w-10 mx-auto mb-2" />
              <p className="text-xs">Olá! Como podemos ajudar hoje?</p>
            </div>
          )}
          
          {messages.map((msg) => {
            const isMe = msg.senderId === userId;
            return (
              <div
                key={msg.id}
                className={cn(
                  "flex items-end gap-2 max-w-[85%]",
                  isMe ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                {!isMe && (
                   <Avatar className="h-6 w-6 mb-1">
                      <Bot className="h-3 w-3" />
                   </Avatar>
                )}
                <div
                  className={cn(
                    "p-3 rounded-2xl text-sm shadow-sm",
                    isMe 
                      ? "bg-primary text-primary-foreground rounded-br-none" 
                      : "bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-bl-none"
                  )}
                >
                    {Boolean(msg.metadata?.image) && (
                      <div className="mb-2">
                        <Image 
                          src={msg.metadata?.image as string} 
                          alt="Enviado" 
                          width={400}
                          height={300}
                          className="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => msg.metadata?.image && window.open(msg.metadata.image as string, '_blank')}
                          unoptimized
                        />
                      </div>
                    )}
                  {String(msg.content)}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50">
        <div className="flex gap-2 items-center">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isUploading}
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full h-10 w-10 shrink-0 text-muted-foreground hover:text-primary"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImageIcon className="h-5 w-5" />}
          </Button>
          <Input
            placeholder={!conversationId ? "Conectando..." : "Digite sua mensagem..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 rounded-full h-10 border-zinc-200 dark:border-zinc-800 focus-visible:ring-primary"
            disabled={!conversationId || isUploading}
          />
          <Button 
            onClick={handleSendMessage} 
            size="icon" 
            className="rounded-full h-10 w-10 shrink-0"
            disabled={!input.trim() || !conversationId || isUploading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
