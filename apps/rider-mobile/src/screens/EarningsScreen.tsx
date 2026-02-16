import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator } from 'react-native';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function EarningsScreen() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      api.get(`/enatega-delivery-integration/rider/${user.id}/stats`)
        .then((res: { data: any }) => setStats(res.data))
        .catch((err: Error) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E91E63" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Earnings</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Total Earnings</Text>
        <Text style={styles.value}>${stats?.totalEarnings || '0.00'}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Total Deliveries</Text>
        <Text style={styles.value}>{stats?.totalDeliveries || '0'}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Current Rating</Text>
        <Text style={styles.value}>⭐ {stats?.rating || '5.0'}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, marginTop: 40 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 15, marginBottom: 15, elevation: 2 },
  label: { fontSize: 16, color: '#666' },
  value: { fontSize: 28, fontWeight: 'bold', color: '#E91E63', marginTop: 5 },
});
