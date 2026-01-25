import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MoreItem = ({
  title,
  subtitle,
  icon,
  onPress
}: {
  title: string;
  subtitle: string;
  icon: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.moreItem} onPress={onPress}>
    <View style={styles.moreItemContent}>
      <View style={styles.iconContainer}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.moreItemTitle}>{title}</Text>
        <Text style={styles.moreItemSubtitle}>{subtitle}</Text>
      </View>
    </View>
    <Text style={styles.arrow}>›</Text>
  </TouchableOpacity>
);

export default function MoreScreen() {
  const navigation = useNavigation();

  const menuItems = [
    {
      title: 'Analytics',
      subtitle: 'Relatórios e métricas de desempenho',
      icon: '📊',
      screen: 'Analytics',
    },
    {
      title: 'Configurações',
      subtitle: 'Gerenciar configurações do restaurante',
      icon: '⚙️',
      screen: 'Settings',
    },
    {
      title: 'Notificações',
      subtitle: 'Gerenciar alertas e notificações',
      icon: '🔔',
      screen: 'Notifications',
    },
  ];

  const handleNavigate = (screenName: string) => {
    // @ts-ignore
    navigation.navigate(screenName);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mais</Text>
        <Text style={styles.subtitle}>Ferramentas e configurações adicionais</Text>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <MoreItem
            key={index}
            title={item.title}
            subtitle={item.subtitle}
            icon={item.icon}
            onPress={() => handleNavigate(item.screen)}
          />
        ))}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>SmartMenu Admin</Text>
        <Text style={styles.infoVersion}>Versão 1.0.0</Text>
        <Text style={styles.infoText}>
          Gerencie seu restaurante com eficiência e mantenha seus clientes satisfeitos.
        </Text>
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  menuContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  moreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  moreItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 18,
  },
  textContainer: {
    flex: 1,
  },
  moreItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  moreItemSubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  arrow: {
    fontSize: 20,
    color: '#cbd5e1',
  },
  infoContainer: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  infoVersion: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
});