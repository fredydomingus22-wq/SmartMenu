import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setOrders, updateOrderStatus, setLoading } from '../store/slices/ordersSlice';
import { OrdersService } from '../services/ordersService';
import { Order } from '../types';

const statusColors = {
  PENDING: '#f59e0b',
  PREPARING: '#3b82f6',
  READY: '#10b981',
  DELIVERED: '#6b7280',
};

const statusLabels = {
  PENDING: 'Pendente',
  PREPARING: 'Preparando',
  READY: 'Pronto',
  DELIVERED: 'Entregue',
};

export default function OrdersScreen() {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    dispatch(setLoading(true));
    try {
      const ordersData = await OrdersService.getOrders();
      dispatch(setOrders(ordersData));
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os pedidos');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleStatusChange = async (order: Order) => {
    const nextStatus = getNextStatus(order.status);
    if (!nextStatus) return;

    try {
      await OrdersService.updateOrderStatus(order.id, nextStatus);
      dispatch(updateOrderStatus({ id: order.id, status: nextStatus }));
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o status');
    }
  };

  const getNextStatus = (currentStatus: Order['status']): Order['status'] | null => {
    switch (currentStatus) {
      case 'PENDING': return 'PREPARING';
      case 'PREPARING': return 'READY';
      case 'READY': return 'DELIVERED';
      default: return null;
    }
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.customerName}>{item.customerName}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColors[item.status] }]}>
          <Text style={styles.statusText}>{statusLabels[item.status]}</Text>
        </View>
      </View>

      <View style={styles.orderItems}>
        {item.items.map((orderItem) => (
          <Text key={orderItem.id} style={styles.itemText}>
            {orderItem.quantity}x {orderItem.name}
          </Text>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.totalText}>R$ {item.total.toFixed(2)}</Text>
        {item.estimatedTime && (
          <Text style={styles.timeText}>{item.estimatedTime}min</Text>
        )}
      </View>

      {getNextStatus(item.status) && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleStatusChange(item)}
        >
          <Text style={styles.actionButtonText}>
            Mover para {statusLabels[getNextStatus(item.status)!]}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pedidos</Text>
        <TouchableOpacity onPress={loadOrders} disabled={isLoading}>
          <Text style={styles.refreshText}>Atualizar</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loading}>
          <Text>Carregando pedidos...</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  refreshText: {
    color: '#2563eb',
    fontSize: 16,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 20,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  orderItems: {
    marginBottom: 12,
  },
  itemText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  timeText: {
    fontSize: 14,
    color: '#64748b',
  },
  actionButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});