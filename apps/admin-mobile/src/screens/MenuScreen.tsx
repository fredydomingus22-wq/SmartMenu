import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setMenuItems, toggleItemAvailability, setLoading } from '../store/slices/menuSlice';
import { MenuService } from '../services/menuService';
import { MenuItem } from '../types';

export default function MenuScreen() {
  const dispatch = useDispatch();
  const { menuItems, isLoading } = useSelector((state: RootState) => state.menu);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    dispatch(setLoading(true));
    try {
      const items = await MenuService.getMenuItems();
      dispatch(setMenuItems(items));
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar o menu');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      await MenuService.updateItemAvailability(item.id, !item.available);
      dispatch(toggleItemAvailability(item.id));
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar a disponibilidade');
    }
  };

  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.menuItemCard}>
      <View style={styles.itemHeader}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemCategory}>{item.category}</Text>
        </View>
        <TouchableOpacity
          style={[styles.availabilityButton, { backgroundColor: item.available ? '#10b981' : '#ef4444' }]}
          onPress={() => handleToggleAvailability(item)}
        >
          <Text style={styles.availabilityText}>
            {item.available ? 'Disponível' : 'Indisponível'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.itemDescription}>{item.description}</Text>

      <View style={styles.itemFooter}>
        <Text style={styles.itemPrice}>R$ {item.price.toFixed(2)}</Text>
        {item.prepTime && (
          <Text style={styles.prepTime}>{item.prepTime}min</Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Menu</Text>
        <TouchableOpacity onPress={loadMenuItems} disabled={isLoading}>
          <Text style={styles.refreshText}>Atualizar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar itens..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {isLoading ? (
        <View style={styles.loading}>
          <Text>Carregando menu...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          renderItem={renderMenuItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  refreshText: {
    color: '#2563eb',
    fontSize: 16,
  },
  searchContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  searchInput: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 20,
  },
  menuItemCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 14,
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  availabilityButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  availabilityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  itemDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
    lineHeight: 20,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  prepTime: {
    fontSize: 14,
    color: '#64748b',
  },
});