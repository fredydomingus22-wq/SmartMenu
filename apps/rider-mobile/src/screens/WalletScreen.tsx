import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';

export default function WalletScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wallet</Text>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Current Balance</Text>
        <Text style={styles.balanceValue}>$0.00</Text>
        <TouchableOpacity style={styles.withdrawButton}>
          <Text style={styles.withdrawText}>Withdraw</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Recent Transactions</Text>
      <FlatList
        data={[]}
        renderItem={null}
        ListEmptyComponent={<Text style={styles.empty}>No transactions yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, marginTop: 40 },
  balanceCard: { backgroundColor: '#2196F3', padding: 30, borderRadius: 20, alignItems: 'center', marginBottom: 30 },
  balanceLabel: { color: '#fff', opacity: 0.8, fontSize: 16 },
  balanceValue: { color: '#fff', fontSize: 36, fontWeight: 'bold', marginVertical: 10 },
  withdrawButton: { backgroundColor: '#fff', paddingHorizontal: 30, paddingVertical: 10, borderRadius: 25 },
  withdrawText: { color: '#2196F3', fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  empty: { textAlign: 'center', color: '#999', marginTop: 20 },
});
