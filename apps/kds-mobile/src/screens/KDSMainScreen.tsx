import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { updateOrderStatus, clearCompletedOrders } from '../store/slices/kdsSlice';
import { Order, OrderStatus } from '../types';
import { KDSService } from '../services/kdsService';

const { width, height } = Dimensions.get('window');
const ORDER_CARD_WIDTH = width / 3 - 20; // 3 columns

const OrderCard = ({ order, onStatusUpdate }: {
  order: Order;
  onStatusUpdate: (orderId: string, status: OrderStatus) => void;
}) => {
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING': return '#fbbf24'; // yellow
      case 'PREPARING': return '#3b82f6'; // blue
      case 'READY': return '#10b981'; // green
      case 'DELIVERED': return '#6b7280'; // gray
      case 'CANCELLED': return '#ef4444'; // red
      default: return '#6b7280';
    }
  };

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    switch (currentStatus) {
      case 'PENDING': return 'PREPARING';
      case 'PREPARING': return 'READY';
      case 'READY': return 'DELIVERED';
      default: return null;
    }
  };

  const nextStatus = getNextStatus(order.status);

  return (
    <View style={[styles.orderCard, { borderLeftColor: getStatusColor(order.status) }]}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>#{order.orderNumber}</Text>
        <Text style={styles.tableNumber}>Mesa {order.tableNumber}</Text>
      </View>

      <Text style={styles.customerName}>{order.customerName}</Text>

      <View style={styles.itemsList}>
        {order.items.map((item, index) => (
          <Text key={index} style={styles.itemText}>
            {item.quantity}x {item.name}
            {item.notes && <Text style={styles.itemNotes}> ({item.notes})</Text>}
          </Text>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.timeText}>
          {new Date(order.createdAt).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>

        {nextStatus && (
          <TouchableOpacity
            style={[styles.statusButton, { backgroundColor: getStatusColor(nextStatus) }]}
            onPress={() => onStatusUpdate(order.id, nextStatus)}
          >
            <Text style={styles.statusButtonText}>
              {nextStatus === 'PREPARING' && 'INICIAR'}
              {nextStatus === 'READY' && 'PRONTO'}
              {nextStatus === 'DELIVERED' && 'ENTREGAR'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const StatusFilter = ({ activeFilter, onFilterChange }: {
  activeFilter: OrderStatus | 'ALL';
  onFilterChange: (filter: OrderStatus | 'ALL') => void;
}) => {
  const filters: (OrderStatus | 'ALL')[] = ['ALL', 'PENDING', 'PREPARING', 'READY'];

  return (
    <View style={styles.filterContainer}>
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter}
          style={[styles.filterButton, activeFilter === filter && styles.filterButtonActive]}
          onPress={() => onFilterChange(filter)}
        >
          <Text style={[styles.filterButtonText, activeFilter === filter && styles.filterButtonTextActive]}>
            {filter === 'ALL' ? 'TODOS' : filter}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default function KDSMainScreen() {
  const dispatch = useDispatch();
  const { orders, isConnected, stats, settings } = useSelector((state: RootState) => state.kds);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');

  const filteredOrders = orders.filter(order => {
    if (statusFilter === 'ALL') return true;
    return order.status === statusFilter;
  });

  useEffect(() => {
    // Auto-refresh if enabled
    if (settings.autoRefresh) {
      const interval = setInterval(() => {
        // In a real app, this would refresh from server
        console.log('Auto-refreshing orders...');
      }, settings.refreshInterval * 1000);

      return () => clearInterval(interval);
    } else {
      // No cleanup needed when auto-refresh is disabled
      return;
    }
  }, [settings.autoRefresh, settings.refreshInterval]);

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    const success = await KDSService.updateOrderStatus(orderId, newStatus);
    if (success) {
      dispatch(updateOrderStatus({ orderId, status: newStatus }));
    } else {
      Alert.alert('Erro', 'Falha ao atualizar status do pedido');
    }
  };

  const handleClearCompleted = () => {
    Alert.alert(
      'Limpar Pedidos',
      'Remover pedidos finalizados da tela?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Limpar', onPress: () => dispatch(clearCompletedOrders()) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1f2937" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>KDS - Cozinha</Text>
          <View style={[styles.connectionIndicator, { backgroundColor: isConnected ? '#10b981' : '#ef4444' }]} />
          <Text style={styles.connectionText}>
            {isConnected ? 'Conectado' : 'Desconectado'}
          </Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.clearButton} onPress={handleClearCompleted}>
            <Text style={styles.clearButtonText}>LIMPAR</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.pendingOrders}</Text>
          <Text style={styles.statLabel}>PENDENTES</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.preparingOrders}</Text>
          <Text style={styles.statLabel}>PREPARANDO</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.readyOrders}</Text>
          <Text style={styles.statLabel}>PRONTOS</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.totalOrders}</Text>
          <Text style={styles.statLabel}>TOTAL</Text>
        </View>
      </View>

      {/* Filters */}
      <StatusFilter activeFilter={statusFilter} onFilterChange={setStatusFilter} />

      {/* Orders Grid */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.ordersContainer}
        renderItem={({ item }) => (
          <OrderCard order={item} onStatusUpdate={handleStatusUpdate} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum pedido encontrado</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 50, // Account for status bar
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 10,
  },
  connectionIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  connectionText: {
    color: 'white',
    fontSize: 14,
  },
  clearButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#374151',
    paddingVertical: 10,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#1f2937',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 6,
    backgroundColor: '#374151',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#3b82f6',
  },
  filterButtonText: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: 'bold',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  ordersContainer: {
    padding: 10,
  },
  orderCard: {
    width: ORDER_CARD_WIDTH,
    backgroundColor: '#1f2937',
    margin: 5,
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  tableNumber: {
    fontSize: 14,
    color: '#9ca3af',
  },
  customerName: {
    fontSize: 14,
    color: '#d1d5db',
    marginBottom: 8,
  },
  itemsList: {
    marginBottom: 8,
  },
  itemText: {
    fontSize: 13,
    color: 'white',
    marginBottom: 2,
  },
  itemNotes: {
    color: '#fbbf24',
    fontStyle: 'italic',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  statusButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#9ca3af',
  },
});