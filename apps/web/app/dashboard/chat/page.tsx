"use client";

import { useEffect, useState, useRef } from "react";
import { MessageSquare, Search, User, Send, Loader2, Image as ImageIcon } from "lucide-react";
import { 
  Button, 
  Input, 
  ScrollArea, 
  Avatar, 
  Card,
  Badge,
  cn 
} from "@smart-menu/ui";
import { useChat } from "@/hooks/use-chat";
import { apiClient } from "@/utils/api-client";
import { createClient } from "@/utils/supabase/client";
import { uploadChatImage } from "../../actions/chat-storage";

interface Conversation {
  id: string;
  type: 'ORDER' | 'SUPPORT';
  updatedAt: string;
  order?: { id: string };
  messages?: { content: string }[];
}

export default function AdminChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, isConnected } = useChat(selectedId || undefined);

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setAdminId(user.id);
        const tId = user.user_metadata?.tenant_id;
        if (tId) {
          setTenantId(tId);
          fetchConversations(tId);
        }
      }
    };
    init();
  }, []);

  const fetchConversations = async (tId: string) => {
    try {
      const data = await apiClient.get<Conversation[]>(`/chat/tenant/${tId}/conversations`);
      setConversations(data);
    } catch (err) {
      console.error("Failed to fetch conversations", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !adminId || !selectedId) return;
    try {
      await sendMessage(adminId, 'ADMIN', input);
      setInput("");
      // Refresh list to update last message
      if (tenantId) fetchConversations(tenantId);
    } catch (err) {
      console.error("Send error", err);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !adminId || !selectedId) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const publicUrl = await uploadChatImage(formData);
      
      if (publicUrl) {
        await sendMessage(adminId, 'ADMIN', 'Imagem enviada', { image: publicUrl });
        if (tenantId) fetchConversations(tenantId);
      }
    } catch (error) {
      console.error("Failed to upload image", error);
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const selectedConversation = conversations.find(c => c.id === selectedId);

  if (loading) return (
    <div className="h-[600px] flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Centro de Mensagens</h1>
          <p className="text-muted-foreground text-sm">Gerencie o suporte e comunicação com riders</p>
        </div>
      </header>

      <div className="flex-1 flex gap-4 min-h-0">
        {/* Sidebar */}
        <Card className="w-80 flex flex-col min-h-0 shrink-0 overflow-hidden">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar conversas..." className="pl-9 h-9" />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="divide-y divide-border">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedId(conv.id)}
                  className={cn(
                    "w-full p-4 text-left hover:bg-muted/50 transition-colors flex flex-col gap-1",
                    selectedId === conv.id && "bg-muted shadow-inner"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm truncate">
                      {conv.type === 'ORDER' ? `Pedido #${conv.order?.id.slice(-6).toUpperCase()}` : 'Suporte ao Cliente'}
                    </span>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <p className="text-xs text-muted-foreground truncate flex-1">
                      {conv.messages?.[0]?.content || "Sem mensagens"}
                    </p>
                    {conv.type === 'SUPPORT' && (
                       <Badge variant="secondary" className="text-[9px] h-4 px-1">Suporte</Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Chat Area */}
        <Card className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {selectedId ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <User className="h-4 w-4" />
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold">
                        {selectedConversation?.type === 'ORDER' ? `Pedido #${selectedConversation?.order?.id.slice(-6).toUpperCase()}` : 'Cliente (Suporte)'}
                      </h3>
                      <div 
                        className={cn(
                          "h-2 w-2 rounded-full",
                          isConnected ? "bg-emerald-500 animate-pulse" : "bg-red-500"
                        )} 
                        title={isConnected ? "Conectado" : "Desconectado"}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground">ID da Conversa: {selectedId}</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4 bg-zinc-50/30 dark:bg-zinc-950/30">
                <div className="space-y-4">
                  {messages.map((msg) => {
                    const isMe = msg.senderType === 'ADMIN';
                    return (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex items-end gap-2 max-w-[70%]",
                          isMe ? "ml-auto flex-row-reverse" : "mr-auto"
                        )}
                      >
                        <div
                          className={cn(
                            "p-3 rounded-2xl text-sm shadow-sm",
                            isMe 
                              ? "bg-primary text-primary-foreground rounded-br-none" 
                              : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border rounded-bl-none"
                          )}
                        >
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold opacity-70">
                              {msg.senderType}
                            </span>
                            {Boolean(msg.metadata?.image) && (
                              <div className="mb-2">
                                <img 
                                  src={msg.metadata?.image as string} 
                                  alt="Enviado" 
                                  className="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                                  onClick={() => msg.metadata?.image && window.open(msg.metadata.image as string, '_blank')}
                                />
                              </div>
                            )}
                            {String(msg.content)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              {/* Chat Footer */}
              <div className="p-4 border-t">
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
                    placeholder="Responda ao cliente..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className="flex-1"
                  />
                  <Button onClick={handleSend} size="icon" disabled={!input.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-4">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                 <MessageSquare className="h-10 w-10 opacity-20" />
              </div>
              <p className="text-sm">Selecione uma conversa para começar</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
