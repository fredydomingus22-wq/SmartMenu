import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setAnalyticsData, setFilters, setLoading } from '../store/slices/analyticsSlice';
import { AnalyticsService } from '../services/analyticsService';
import { AnalyticsData, AnalyticsFilters } from '../types/analytics';

const { width } = Dimensions.get('window');

const MetricCard = ({ title, value, subtitle, color = '#2563eb' }: {
  title: string;
  value: string;
  subtitle?: string;
  color?: string;
}) => (
  <View style={[styles.metricCard, { borderLeftColor: color }]}>
    <Text style={styles.metricTitle}>{title}</Text>
    <Text style={[styles.metricValue, { color }]}>{value}</Text>
    {subtitle && <Text style={styles.metricSubtitle}>{subtitle}</Text>}
  </View>
);

const StatusCard = ({ status, count, color }: {
  status: string;
  count: number;
  color: string;
}) => (
  <View style={[styles.statusCard, { backgroundColor: color }]}>
    <Text style={styles.statusCount}>{count}</Text>
    <Text style={styles.statusLabel}>{status}</Text>
  </View>
);

const PopularItemCard = ({ item, index }: { item: any; index: number }) => (
  <View style={styles.popularItemCard}>
    <View style={styles.itemRank}>
      <Text style={styles.rankText}>{index + 1}</Text>
    </View>
    <View style={styles.itemInfo}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemStats}>
        {item.quantity} vendidos • R$ {item.revenue.toFixed(2)}
      </Text>
    </View>
  </View>
);

export default function AnalyticsScreen() {
  const dispatch = useDispatch();
  const { data, filters, isLoading } = useSelector((state: RootState) => state.analytics);

  useEffect(() => {
    loadAnalytics();
  }, [filters]);

  const loadAnalytics = async () => {
    dispatch(setLoading(true));
    try {
      const analyticsData = await AnalyticsService.getAnalytics(filters);
      dispatch(setAnalyticsData(analyticsData));
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const changePeriod = (period: AnalyticsFilters['period']) => {
    dispatch(setFilters({ ...filters, period }));
  };

  const periodOptions = [
    { key: 'today', label: 'Hoje' },
    { key: 'week', label: 'Semana' },
    { key: 'month', label: 'Mês' },
  ];

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <Text>Carregando analytics...</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.error}>
        <Text>Erro ao carregar dados</Text>
        <TouchableOpacity onPress={loadAnalytics}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Period Selector */}
      <View style={styles.periodSelector}>
        {periodOptions.map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.periodButton,
              filters.period === option.key && styles.periodButtonActive,
            ]}
            onPress={() => changePeriod(option.key as AnalyticsFilters['period'])}
          >
            <Text
              style={[
                styles.periodButtonText,
                filters.period === option.key && styles.periodButtonTextActive,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Key Metrics */}
      <View style={styles.metricsGrid}>
        <MetricCard
          title="Total de Pedidos"
          value={data.totalOrders.toString()}
          color="#2563eb"
        />
        <MetricCard
          title="Receita Total"
          value={`R$ ${data.totalRevenue.toFixed(2)}`}
          color="#10b981"
        />
        <MetricCard
          title="Ticket Médio"
          value={`R$ ${data.averageOrderValue.toFixed(2)}`}
          color="#f59e0b"
        />
        <MetricCard
          title="Pedidos Hoje"
          value={data.revenueByPeriod.today.toString()}
          subtitle="em receita"
          color="#ef4444"
        />
      </View>

      {/* Orders by Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Status dos Pedidos</Text>
        <View style={styles.statusGrid}>
          <StatusCard status="Pendentes" count={data.ordersByStatus.PENDING} color="#f59e0b" />
          <StatusCard status="Preparando" count={data.ordersByStatus.PREPARING} color="#3b82f6" />
          <StatusCard status="Prontos" count={data.ordersByStatus.READY} color="#10b981" />
          <StatusCard status="Entregues" count={data.ordersByStatus.DELIVERED} color="#6b7280" />
        </View>
      </View>

      {/* Popular Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Itens Mais Vendidos</Text>
        <FlatList
          data={data.popularItems}
          renderItem={({ item, index }) => <PopularItemCard item={item} index={index} />}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Revenue by Period */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Receita por Período</Text>
        <View style={styles.revenueGrid}>
          <View style={styles.revenueCard}>
            <Text style={styles.revenueLabel}>Hoje</Text>
            <Text style={styles.revenueValue}>R$ {data.revenueByPeriod.today.toFixed(2)}</Text>
          </View>
          <View style={styles.revenueCard}>
            <Text style={styles.revenueLabel}>Esta Semana</Text>
            <Text style={styles.revenueValue}>R$ {data.revenueByPeriod.week.toFixed(2)}</Text>
          </View>
          <View style={styles.revenueCard}>
            <Text style={styles.revenueLabel}>Este Mês</Text>
            <Text style={styles.revenueValue}>R$ {data.revenueByPeriod.month.toFixed(2)}</Text>
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
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryText: {
    color: '#2563eb',
    marginTop: 10,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: '#2563eb',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  periodButtonTextActive: {
    color: 'white',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  metricCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: (width - 52) / 2,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricTitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricSubtitle: {
    fontSize: 10,
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
  statusGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statusCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statusCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  statusLabel: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  popularItemCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  itemStats: {
    fontSize: 12,
    color: '#64748b',
  },
  revenueGrid: {
    gap: 12,
  },
  revenueCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  revenueLabel: {
    fontSize: 16,
    color: '#64748b',
  },
  revenueValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
});