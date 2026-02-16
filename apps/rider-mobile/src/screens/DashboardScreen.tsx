import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Switch } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useLocationTracking } from '../hooks/useLocationTracking';
import api from '../services/api';

interface Delivery {
  id: string;
  orderId: string;
  status: string;
}

export default function DashboardScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const [isOnline, setIsOnline] = useState(false);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);

  // Enable real-time tracking when online
  useLocationTracking(isOnline);

  useEffect(() => {
    if (isOnline) {
      fetchJobs();
    }
  }, [isOnline]);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/enatega-delivery-integration/rider/my-jobs');
      setDeliveries(response.data);
    } catch (e) {
      console.error('Fetch jobs error', e);
    }
  };

  const toggleOnline = async () => {
    const newStatus = isOnline ? 'OFFLINE' : 'AVAILABLE';
    try {
        // Update status in backend
        await api.patch(`/enatega-delivery-integration/rider/${user.id}`, { status: newStatus });
        setIsOnline(!isOnline);
    } catch (e) {
        console.error("Status update error", e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome, {user?.fullName}</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statusCard}>
        <Text style={styles.statusLabel}>Availability</Text>
        <View style={styles.row}>
          <Text style={isOnline ? styles.online : styles.offline}>
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </Text>
          <Switch value={isOnline} onValueChange={toggleOnline} />
        </View>
      </View>

      <TouchableOpacity 
        style={styles.manageButton}
        onPress={() => navigation.navigate('HomeDetails')}
      >
        <Text style={styles.manageText}>Manage Account & Settings</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Active Deliveries</Text>
      <FlatList
        data={deliveries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.deliveryCard}>
            <Text style={styles.orderId}>Order #{item.orderId.slice(0, 8)}</Text>
            <Text>Status: {item.status}</Text>
            <TouchableOpacity 
                style={styles.detailButton}
                onPress={() => navigation.navigate('ActiveDelivery', { deliveryId: item.id })}
            >
              <Text style={styles.detailText}>View Details</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No active deliveries found.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: 20,
  },
  welcome: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  logout: {
    color: '#E91E63',
  },
  statusCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 3,
  },
  statusLabel: {
    fontSize: 16,
    color: '#666',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  online: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  offline: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F44336',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  deliveryCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  orderId: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  detailButton: {
    backgroundColor: '#E91E63',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  detailText: {
    color: '#fff',
  },
  manageButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
    alignItems: 'center'
  },
  manageText: {
    color: '#333',
    fontWeight: '600'
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
  },
});
