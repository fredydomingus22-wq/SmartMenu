import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Bem-vindo ao</Text>
        <Text style={styles.restaurantName}>SmartMenu</Text>
        <Text style={styles.subtitle}>Descubra nosso cardápio delicioso</Text>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionCard}>
          <Text style={styles.actionIcon}>🍽️</Text>
          <Text style={styles.actionTitle}>Cardápio</Text>
          <Text style={styles.actionSubtitle}>Explore nossos pratos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <Text style={styles.actionIcon}>🛒</Text>
          <Text style={styles.actionTitle}>Carrinho</Text>
          <Text style={styles.actionSubtitle}>Veja seus pedidos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <Text style={styles.actionIcon}>👤</Text>
          <Text style={styles.actionTitle}>Perfil</Text>
          <Text style={styles.actionSubtitle}>Suas informações</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.featured}>
        <Text style={styles.sectionTitle}>Destaques do Dia</Text>
        <View style={styles.featuredCard}>
          <Text style={styles.featuredEmoji}>🍕</Text>
          <View style={styles.featuredContent}>
            <Text style={styles.featuredTitle}>Pizza Margherita</Text>
            <Text style={styles.featuredDescription}>Molho de tomate, mussarela, manjericão fresco</Text>
            <Text style={styles.featuredPrice}>R$ 45,00</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#2563eb',
    padding: 24,
    paddingTop: 60,
    alignItems: 'center',
  },
  welcome: {
    fontSize: 18,
    color: 'white',
    opacity: 0.9,
  },
  restaurantName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    marginTop: -20,
  },
  actionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  featured: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  featuredCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featuredEmoji: {
    fontSize: 40,
    marginRight: 16,
  },
  featuredContent: {
    flex: 1,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  featuredDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  featuredPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563eb',
  },
});