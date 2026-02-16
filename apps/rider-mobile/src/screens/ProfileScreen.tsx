import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{user?.fullName?.charAt(0)}</Text>
        </View>
        <Text style={styles.name}>{user?.fullName}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Personal Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Vehicle Info</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={logout}>
          <Text style={[styles.menuText, { color: '#F44336' }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#fff', padding: 40, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee' },
  avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#E91E63', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  avatarText: { color: '#fff', fontSize: 40, fontWeight: 'bold' },
  name: { fontSize: 22, fontWeight: 'bold' },
  email: { color: '#666', marginTop: 5 },
  menu: { marginTop: 20, backgroundColor: '#fff' },
  menuItem: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  menuText: { fontSize: 16 },
});
