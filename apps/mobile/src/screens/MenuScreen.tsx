import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { apiClient } from '@smart-menu/api';
import { Product, Category } from '@smart-menu/ui';

export default function MenuScreen() {
  const [categories, setCategories] = useState<string[]>(['Todos']);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const tenantId = useSelector((state: any) => state.user.tenantId);

  useEffect(() => {
    async function fetchMenu() {
      if (!tenantId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        // Using the public menu endpoint as per implementation_plan
        const data = await apiClient.get<Category[]>(`/public/menu/${tenantId}`);
        
        if (data && Array.isArray(data)) {
          const allProducts = data.flatMap(cat => cat.products || []);
          setProducts(allProducts);
          
          const catNames = ['Todos', ...data.map(cat => 
            typeof cat.name === 'string' ? cat.name : (cat.name?.pt || cat.name?.en || 'Sem Nome')
          )];
          setCategories(catNames);
        }
      } catch (error) {
        console.error('[MenuScreen] Failed to fetch menu:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMenu();
  }, [tenantId]);

  const filteredItems = selectedCategory === 'Todos'
    ? products
    : products.filter(item => {
        const catName = typeof item.category?.name === 'string' 
          ? item.category.name 
          : (item.category?.name?.pt || item.category?.name?.en);
        return catName === selectedCategory;
      });

  const renderCategoryButton = (category: string) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryButton,
        selectedCategory === category && styles.categoryButtonActive
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text style={[
        styles.categoryButtonText,
        selectedCategory === category && styles.categoryButtonTextActive
      ]}>
        {category}
      </Text>
    </TouchableOpacity>
  );

  const renderMenuItem = ({ item }: { item: Product }) => {
    const name = typeof item.name === 'string' ? item.name : (item.name?.pt || item.name?.en || 'Produto');
    const description = typeof item.description === 'string' 
      ? item.description 
      : (item.description?.pt || item.description?.en || '');
    const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;

    return (
      <TouchableOpacity style={styles.menuItem}>
        <View style={styles.menuItemContent}>
          <Text style={styles.menuItemEmoji}>🍴</Text>
          <View style={styles.menuItemDetails}>
            <Text style={styles.menuItemName}>{name}</Text>
            <Text style={styles.menuItemDescription}>{description}</Text>
            <Text style={styles.menuItemPrice}>AOA {price.toLocaleString()}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cardápio</Text>
      </View>

      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
          <View style={styles.categoriesContainer}>
            {categories.map(renderCategoryButton)}
          </View>
        </ScrollView>
      </View>

      <FlatList
        data={filteredItems}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.menuList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum produto encontrado.</Text>
          </View>
        }
      />
    </View>
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
  },
  categories: {
    backgroundColor: 'white',
    maxHeight: 60,
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  categoryButton: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryButtonActive: {
    backgroundColor: '#2563eb',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: 'white',
  },
  menuList: {
    padding: 20,
    paddingBottom: 40,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#64748b',
    fontSize: 16,
  },
  menuItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  menuItemDetails: {
    flex: 1,
  },
  menuItemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  addButton: {
    backgroundColor: '#2563eb',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});