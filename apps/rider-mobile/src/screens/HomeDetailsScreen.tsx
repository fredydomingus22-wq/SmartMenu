import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';

const MENU_ITEMS = [
  { id: '1', title: 'Bank Management' },
  { id: '2', title: 'Work Schedule' },
  { id: '3', title: 'Vehicle Type' },
  { id: '4', title: 'Language' },
  { id: '5', title: 'Help' },
];

export default function HomeDetailsScreen() {
  return (
    <ScrollView style={styles.container}>
      {MENU_ITEMS.map((item) => (
        <TouchableOpacity key={item.id} style={styles.card}>
          <Text style={styles.cardText}>{item.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  card: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 15, 
    marginBottom: 10, 
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardText: { fontSize: 16, fontWeight: '500' },
});
