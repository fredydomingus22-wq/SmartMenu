import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView, Linking, Platform } from 'react-native';
import * as Location from 'expo-location';
import api from '../services/api';
import { DeliveryMap } from '../components/DeliveryMap';

export default function ActiveDeliveryScreen({ route, navigation }: any) {
  const { deliveryId } = route.params;
  const [delivery, setDelivery] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [riderLocation, setRiderLocation] = useState<{latitude: number; longitude: number} | null>(null);

  useEffect(() => {
    fetchDeliveryDetails();
  }, [deliveryId]);

  // Track location locally for the map UI
  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          subscription = await Location.watchPositionAsync(
            { accuracy: Location.Accuracy.High, distanceInterval: 10 },
            (loc) => setRiderLocation(loc.coords)
          );
        }
      } catch (e) {
        console.warn(e);
      }
    })();
    return () => {
      subscription?.remove();
    };
  }, []);

  const fetchDeliveryDetails = async () => {
    try {
      const response = await api.get(`/enatega-delivery-integration/delivery/${deliveryId}`);
      setDelivery(response.data);
    } catch (e) {
      Alert.alert('Error', 'Failed to load delivery details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      await api.patch(`/enatega-delivery-integration/delivery/${deliveryId}/status`, {
        status: newStatus
      });
      fetchDeliveryDetails();
      Alert.alert('Success', `Status updated to ${newStatus}`);
    } catch (e) {
      Alert.alert('Error', 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const openNavigation = () => {
    if (!delivery?.order?.deliveryAddress?.location) {
      // Fallback if no coordinates (assume address string)
      const address = encodeURIComponent(delivery?.order?.deliveryAddress || '');
      if (!address) return Alert.alert('Error', 'No address to navigate to');
      
      const url = Platform.select({
        ios: `maps:0,0?q=${address}`,
        android: `geo:0,0?q=${address}`
      });
      Linking.openURL(url as string);
      return;
    }

    // If we have coordinates
    const { lat, lng } = delivery.order.deliveryAddress.location;
    const label = encodeURIComponent(delivery.order.customerName || 'Customer');
    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${lat},${lng}`,
      android: `geo:0,0?q=${lat},${lng}(${label})`
    });
    Linking.openURL(url as string);
  };

  if (loading) return <ActivityIndicator style={styles.centered} size="large" />;

  // Mock coordinates if missing (for demo purposes) - remove in production
  const destination = delivery?.order?.deliveryAddress?.location 
    ? { latitude: delivery.order.deliveryAddress.location.lat, longitude: delivery.order.deliveryAddress.location.lng, label: 'Customer' }
    : null; // If null, map won't show marker but will show rider

  return (
    <View style={styles.container}>
      {/* Map Section (Top Half) */}
      <View style={styles.mapContainer}>
        <DeliveryMap 
          riderLocation={riderLocation} 
          destination={destination}
        />
        {/* Floating Navigation Button */}
        <TouchableOpacity style={styles.fab} onPress={openNavigation}>
          <Text style={styles.fabText}>📍 Navigate</Text>
        </TouchableOpacity>
      </View>

      {/* Details Section (Bottom Half) */}
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.label}>Order ID</Text>
          <Text style={styles.value}>#{delivery.orderId.slice(0, 8)}</Text>
          
          <Text style={styles.label}>Status</Text>
          <Text style={styles.statusValue}>{delivery.status}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Customer Details</Text>
          <Text style={styles.customerName}>{delivery.order?.customerName || 'N/A'}</Text>
          <Text style={styles.address}>{delivery.order?.deliveryAddress || 'No address provided'}</Text>
        </View>

        <View style={styles.actions}>
          {delivery.status === 'ASSIGNED' && (
            <TouchableOpacity 
              style={styles.primaryButton} 
              onPress={() => updateStatus('PICKED_UP')}
              disabled={updating}
            >
              <Text style={styles.buttonText}>Pick Up Order</Text>
            </TouchableOpacity>
          )}

          {(delivery.status === 'PICKED_UP' || delivery.status === 'IN_TRANSIT') && (
            <>
              <TouchableOpacity 
                style={[styles.primaryButton, { backgroundColor: '#4CAF50', marginBottom: 10 }]} 
                onPress={() => updateStatus('DELIVERED')}
                disabled={updating}
              >
                <Text style={styles.buttonText}>Mark as Delivered</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.secondaryButton, { borderColor: '#E91E63', borderWidth: 1 }]} 
                onPress={() => navigation.navigate('Chat', { 
                  tenantId: delivery.tenantId,
                  orderId: delivery.orderId,
                  riderId: delivery.riderId || delivery.userId 
                })}
              >
                <Text style={[styles.buttonText, { color: '#E91E63' }]}>Chat with Customer</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  mapContainer: { height: '45%', width: '100%', position: 'relative' },
  scrollContainer: { flex: 1, padding: 20 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

  card: { backgroundColor: '#fff', padding: 20, borderRadius: 15, marginBottom: 15, elevation: 2 },
  label: { fontSize: 14, color: '#666', marginBottom: 5 },
  value: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  statusValue: { fontSize: 18, fontWeight: 'bold', color: '#E91E63' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  customerName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  address: { fontSize: 14, color: '#444' },
  
  actions: { marginTop: 10, paddingBottom: 40 },
  primaryButton: { backgroundColor: '#E91E63', padding: 18, borderRadius: 10, alignItems: 'center' },
  secondaryButton: { backgroundColor: '#fff', padding: 18, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
