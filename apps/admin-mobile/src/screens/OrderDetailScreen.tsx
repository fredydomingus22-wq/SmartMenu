import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import RiderTrackingMap from '../components/RiderTrackingMap';
import { Order } from '../types';

export default function OrderDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { order } = route.params as { order: Order };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Detalhes do Pedido</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.orderId}># {order.id.slice(-6).toUpperCase()}</Text>
        <Text style={styles.status}>Status: {order.status}</Text>
        <Text style={styles.customer}>Cliente: {order.customerName}</Text>
      </View>

      <Text style={styles.sectionTitle}>Rastreamento do Entregador</Text>
      <RiderTrackingMap riderId={(order as any).riderId} />

      <View style={styles.itemsCard}>
        <Text style={styles.sectionTitle}>Itens</Text>
        {order.items.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <Text>{item.quantity}x {item.name}</Text>
            <Text>R$ {item.price.toFixed(2)}</Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>R$ {order.total.toFixed(2)}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, paddingTop: 40 },
  backText: { color: '#2563eb', marginRight: 20, fontSize: 16 },
  title: { fontSize: 20, fontWeight: 'bold' },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 12, marginBottom: 20 },
  orderId: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  status: { color: '#64748b', marginBottom: 5 },
  customer: { fontSize: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 10, color: '#1e293b' },
  itemsCard: { backgroundColor: 'white', padding: 20, borderRadius: 12, marginTop: 20 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  totalRow: { borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingTop: 10, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' },
  totalLabel: { fontSize: 18, fontWeight: 'bold' },
  totalValue: { fontSize: 18, fontWeight: 'bold', color: '#2563eb' },
});
