import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { useSelector } from 'react-redux';
import { apiClient } from '@smart-menu/api';
import { supabase } from '../services/supabase';

interface Order {
  id: string;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';
  total: number;
  createdAt: string;
  items: any[];
}

export default function OrderHistoryScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { id: userId, tenantId } = useSelector((state: any) => state.user);

  const fetchOrders = async () => {
    try {
      const data = await apiClient.get<Order[]>('/orders');
      setOrders(data);
    } catch (error) {
      console.error('[OrderHistory] Failed to fetch orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Real-time tracking subscription
    if (tenantId) {
      const channel = supabase
        .channel(`orders:${tenantId}`)
        .on('broadcast', { event: 'STATUS_UPDATED' }, (payload) => {
          const updatedOrder = payload.payload;
          setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [tenantId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return '#f59e0b';
      case 'CONFIRMED': return '#3b82f6';
      case 'PREPARING': return '#8b5cf6';
      case 'READY': return '#10b981';
      case 'DELIVERED': return '#059669';
      case 'CANCELLED': return '#ef4444';
      default: return '#64748b';
    }
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Pedido #{item.id.slice(-6).toUpperCase()}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
        </View>
      </View>
      <View style={styles.orderFooter}>
        <Text style={styles.orderDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
        <Text style={styles.orderTotal}>AOA {Number(item.total).toLocaleString()}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Pedidos</Text>
      </View>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Você ainda não fez nenhum pedido.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { padding: 20, paddingTop: 60, backgroundColor: 'white' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1e293b' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16 },
  orderCard: { backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  orderId: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 12 },
  orderDate: { fontSize: 14, color: '#64748b' },
  orderTotal: { fontSize: 16, fontWeight: 'bold', color: '#2563eb' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100 },
  emptyText: { color: '#64748b', fontSize: 16 },
});
