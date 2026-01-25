import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  TextInput,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface SettingItemProps {
  title: string;
  subtitle?: string;
  type: 'toggle' | 'input' | 'action';
  value?: boolean | string;
  onValueChange?: (value: boolean | string) => void;
  onPress?: () => void;
}

const SettingItem = ({ title, subtitle, type, value, onValueChange, onPress }: SettingItemProps) => (
  <TouchableOpacity
    style={styles.settingItem}
    onPress={type === 'action' ? onPress : undefined}
    disabled={type === 'toggle'}
  >
    <View style={styles.settingContent}>
      <Text style={styles.settingTitle}>{title}</Text>
      {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
    </View>

    {type === 'toggle' && (
      <Switch
        value={value as boolean}
        onValueChange={(newValue) => onValueChange?.(newValue)}
        trackColor={{ false: '#cbd5e1', true: '#93c5fd' }}
        thumbColor={value ? '#2563eb' : '#f1f5f9'}
      />
    )}

    {type === 'input' && (
      <TextInput
        style={styles.settingInput}
        value={value as string}
        onChangeText={(text) => onValueChange?.(text)}
        placeholder="Digite aqui..."
      />
    )}

    {type === 'action' && (
      <Text style={styles.settingArrow}>›</Text>
    )}
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const { user } = useSelector((state: RootState) => state.auth);

  const [notifications, setNotifications] = useState(true);
  const [autoAcceptOrders, setAutoAcceptOrders] = useState(false);
  const [restaurantName, setRestaurantName] = useState('SmartMenu Restaurant');
  const [phone, setPhone] = useState('(11) 99999-9999');
  const [address, setAddress] = useState('Rua das Flores, 123 - São Paulo, SP');

  const handleSaveSettings = () => {
    Alert.alert('Sucesso', 'Configurações salvas com sucesso!');
  };

  const handleExportData = () => {
    Alert.alert('Exportar Dados', 'Funcionalidade em desenvolvimento');
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Redefinir Configurações',
      'Tem certeza que deseja redefinir todas as configurações?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Redefinir',
          style: 'destructive',
          onPress: () => {
            setNotifications(true);
            setAutoAcceptOrders(false);
            setRestaurantName('SmartMenu Restaurant');
            setPhone('(11) 99999-9999');
            setAddress('Rua das Flores, 123 - São Paulo, SP');
            Alert.alert('Configurações redefinidas');
          },
        },
      ]
    );
  };

  const settingsSections = [
    {
      title: 'Notificações',
      items: [
        {
          title: 'Notificações de Pedidos',
          subtitle: 'Receber alertas para novos pedidos',
          type: 'toggle' as const,
          value: notifications,
          onValueChange: (value: boolean | string) => setNotifications(value as boolean),
        },
        {
          title: 'Aceitação Automática',
          subtitle: 'Aceitar pedidos automaticamente',
          type: 'toggle' as const,
          value: autoAcceptOrders,
          onValueChange: (value: boolean | string) => setAutoAcceptOrders(value as boolean),
        },
      ],
    },
    {
      title: 'Informações do Restaurante',
      items: [
        {
          title: 'Nome do Restaurante',
          type: 'input' as const,
          value: restaurantName,
          onValueChange: (value: boolean | string) => setRestaurantName(value as string),
        },
        {
          title: 'Telefone',
          type: 'input' as const,
          value: phone,
          onValueChange: (value: boolean | string) => setPhone(value as string),
        },
        {
          title: 'Endereço',
          type: 'input' as const,
          value: address,
          onValueChange: (value: boolean | string) => setAddress(value as string),
        },
      ],
    },
    {
      title: 'Dados e Privacidade',
      items: [
        {
          title: 'Exportar Dados',
          subtitle: 'Baixar relatório completo dos dados',
          type: 'action' as const,
          onPress: handleExportData,
        },
        {
          title: 'Redefinir Configurações',
          subtitle: 'Voltar às configurações padrão',
          type: 'action' as const,
          onPress: handleResetSettings,
        },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Configurações</Text>
        <Text style={styles.subtitle}>Gerencie as configurações do seu restaurante</Text>
      </View>

      {settingsSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionContent}>
            {section.items.map((item, itemIndex) => (
              <SettingItem key={itemIndex} {...item} />
            ))}
          </View>
        </View>
      ))}

      <View style={styles.saveContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveSettings}>
          <Text style={styles.saveButtonText}>Salvar Configurações</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>SmartMenu Admin v1.0.0</Text>
        <Text style={styles.userInfo}>Logado como: {user?.name || 'Admin'}</Text>
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
  section: {
    margin: 20,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  sectionContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  settingInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    minWidth: 150,
  },
  settingArrow: {
    fontSize: 20,
    color: '#cbd5e1',
  },
  saveContainer: {
    margin: 20,
    marginTop: 40,
  },
  saveButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  versionContainer: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  versionText: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  userInfo: {
    fontSize: 12,
    color: '#64748b',
  },
});