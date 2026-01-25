import React, { useState, useEffect } from 'react';
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
import { setOrders } from '../store/slices/ordersSlice';
import { OrdersService } from '../services/ordersService';

interface NotificationItem {
  id: string;
  type: 'order' | 'system' | 'alert';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  orderId?: string;
}

const NotificationCard = ({
  notification,
  onPress,
  onMarkAsRead
}: {
  notification: NotificationItem;
  onPress: () => void;
  onMarkAsRead: () => void;
}) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'order': return '#2563eb';
      case 'system': return '#10b981';
      case 'alert': return '#ef4444';
      default: return '#64748b';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'order': return 'Pedido';
      case 'system': return 'Sistema';
      case 'alert': return 'Alerta';
      default: return 'Notificação';
    }
  };

  return (
    <TouchableOpacity
      style={[styles.notificationCard, !notification.read && styles.unreadCard]}
      onPress={onPress}
    >
      <View style={styles.notificationHeader}>
        <View style={[styles.typeBadge, { backgroundColor: getTypeColor(notification.type) }]}>
          <Text style={styles.typeText}>{getTypeLabel(notification.type)}</Text>
        </View>
        <Text style={styles.timestamp}>{notification.timestamp}</Text>
      </View>

      <Text style={styles.notificationTitle}>{notification.title}</Text>
      <Text style={styles.notificationMessage}>{notification.message}</Text>

      {!notification.read && (
        <TouchableOpacity
          style={styles.markAsReadButton}
          onPress={onMarkAsRead}
        >
          <Text style={styles.markAsReadText}>Marcar como lida</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default function NotificationsScreen() {
  const dispatch = useDispatch();
  const { orders } = useSelector((state: RootState) => state.orders);

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    loadNotifications();
  }, [orders]);

  const loadNotifications = () => {
    // Generate notifications based on orders and system events
    const mockNotifications: NotificationItem[] = [
      {
        id: '1',
        type: 'order',
        title: 'Novo pedido recebido',
        message: 'Pedido #1234 foi criado e está aguardando confirmação',
        timestamp: '2 min atrás',
        read: false,
        orderId: '1234',
      },
      {
        id: '2',
        type: 'alert',
        title: 'Item indisponível',
        message: 'O item "Hambúrguer Clássico" está com estoque baixo',
        timestamp: '15 min atrás',
        read: false,
      },
      {
        id: '3',
        type: 'system',
        title: 'Backup realizado',
        message: 'Backup automático dos dados concluído com sucesso',
        timestamp: '1h atrás',
        read: true,
      },
      {
        id: '4',
        type: 'order',
        title: 'Pedido pronto para entrega',
        message: 'Pedido #1232 está pronto e aguardando retirada',
        timestamp: '2h atrás',
        read: true,
        orderId: '1232',
      },
    ];

    setNotifications(mockNotifications);
  };

  const handleNotificationPress = (notification: NotificationItem) => {
    if (notification.orderId) {
      // Navigate to order details
      Alert.alert('Pedido', `Ver detalhes do pedido ${notification.orderId}`);
    } else {
      Alert.alert(notification.title, notification.message);
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
    Alert.alert('Sucesso', 'Todas as notificações foram marcadas como lidas');
  };

  const filteredNotifications = notifications.filter(notif =>
    filter === 'all' || !notif.read
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notificações</Text>
        {unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{unreadCount}</Text>
          </View>
        )}
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            Todas ({notifications.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'unread' && styles.filterButtonActive]}
          onPress={() => setFilter('unread')}
        >
          <Text style={[styles.filterText, filter === 'unread' && styles.filterTextActive]}>
            Não lidas ({unreadCount})
          </Text>
        </TouchableOpacity>
      </View>

      {unreadCount > 0 && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleMarkAllAsRead}>
            <Text style={styles.actionButtonText}>Marcar todas como lidas</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={filteredNotifications}
        renderItem={({ item }) => (
          <NotificationCard
            notification={item}
            onPress={() => handleNotificationPress(item)}
            onMarkAsRead={() => handleMarkAsRead(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {filter === 'unread' ? 'Nenhuma notificação não lida' : 'Nenhuma notificação'}
            </Text>
          </View>
        }
      />
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
  unreadBadge: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  unreadText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    padding: 4,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  filterButtonActive: {
    backgroundColor: '#2563eb',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  filterTextActive: {
    color: 'white',
  },
  actionsContainer: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  actionButton: {
    backgroundColor: '#10b981',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  list: {
    padding: 20,
  },
  notificationCard: {
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
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 12,
    color: '#64748b',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  markAsReadButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  markAsReadText: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
  },
});