import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Send, User } from 'lucide-react-native';
import { supabase } from '../services/supabase';
import api from '../services/api';

export default function ChatScreen({ route, navigation }: any) {
  const { tenantId, orderId, riderId } = route.params;
  const [messages, setMessages] = useState<any[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    initChat();
  }, []);

  const initChat = async () => {
    try {
      // Find or create conversation
      const response = await api.post('/chat/conversations/order', {
        tenantId,
        orderId,
        riderId,
        customerId: '' // The backend should find the customer linked to the order
      });
      const conv = response.data;
      setConversationId(conv.id);

      // Load initial messages
      const msgRes = await api.get(`/chat/conversations/${conv.id}/messages`);
      setMessages(msgRes.data);
      setLoading(false);

      // Subscribe to real-time
      const channel = supabase.channel(`chat:${conv.id}`);
      channel
        .on('broadcast', { event: 'NEW_MESSAGE' }, ({ payload }) => {
          setMessages((prev) => {
             if (prev.some(m => m.id === payload.id)) return prev;
             return [...prev, payload];
          });
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (e) {
      console.error('Failed to init chat', e);
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !conversationId) return;

    const content = input;
    setInput('');

    try {
      await api.post(`/chat/conversations/${conversationId}/messages`, {
        senderId: riderId,
        senderType: 'RIDER',
        content,
      });
      // Optimistic update or wait for broadcast
    } catch (e) {
      console.error('Failed to send message', e);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const isMe = item.senderType === 'RIDER';
    return (
      <View style={[styles.messageContainer, isMe ? styles.myMessage : styles.theirMessage]}>
        <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.theirMessageText]}>
          {item.content}
        </Text>
        <Text style={styles.timestamp}>
          {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  if (loading) return <ActivityIndicator style={styles.centered} size="large" />;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={input}
          onChangeText={setInput}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={!input.trim()}>
          <Send color="#fff" size={20} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  messageList: { padding: 15 },
  messageContainer: {
    padding: 12,
    borderRadius: 20,
    marginBottom: 10,
    maxWidth: '80%',
  },
  myMessage: {
    backgroundColor: '#E91E63',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: { fontSize: 16 },
  myMessageText: { color: '#fff' },
  theirMessageText: { color: '#000' },
  timestamp: { fontSize: 10, color: 'rgba(0,0,0,0.4)', marginTop: 4, alignSelf: 'flex-end' },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#E91E63',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
