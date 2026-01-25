import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { clearCart } from '../store/slices/cartSlice';
import { useConnectivity } from '../hooks/useConnectivity';
import { PaymentService } from '../services/paymentService';

export default function CheckoutScreen() {
  const dispatch = useDispatch();
  const { items: cartItems, isOffline } = useSelector((state: RootState) => state.cart);
  const { isConnected } = useConnectivity();
  const [isProcessing, setIsProcessing] = useState(false);

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 5.00;
  const finalTotal = total + deliveryFee;

  const handlePayment = async () => {
    if (!isConnected && !isOffline) {
      Alert.alert('Erro', 'Conexão necessária para processar pagamento.');
      return;
    }

    if (cartItems.length === 0) {
      Alert.alert('Erro', 'Carrinho vazio.');
      return;
    }

    // Validação básica dos campos
    if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.cardholderName) {
      Alert.alert('Erro', 'Preencha todos os campos do cartão.');
      return;
    }

    setIsProcessing(true);

    try {
      const result = await PaymentService.processCardPayment({
        amount: finalTotal,
        currency: 'brl',
        cardNumber: paymentData.cardNumber,
        expiryDate: paymentData.expiryDate,
        cvv: paymentData.cvv,
        cardholderName: paymentData.cardholderName,
      });

      if (result.success) {
        Alert.alert('Sucesso', 'Pagamento processado com sucesso!', [
          {
            text: 'OK',
            onPress: () => {
              dispatch(clearCart());
              // TODO: Navegar para tela de confirmação
            },
          },
        ]);
      } else {
        Alert.alert('Erro', result.error || 'Erro no processamento do pagamento.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao processar pagamento. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyCheckout}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={styles.emptyTitle}>Carrinho vazio</Text>
          <Text style={styles.emptySubtitle}>Adicione itens antes de finalizar</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Finalizar Pedido</Text>
        {!isConnected && (
          <View style={styles.offlineIndicator}>
            <Text style={styles.offlineText}>Offline - Pagamento será processado quando conectar</Text>
          </View>
        )}
      </View>

      <ScrollView style={styles.checkoutContent}>
        {/* Resumo do Pedido */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo do Pedido</Text>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemEmoji}>{item.emoji}</Text>
                <View>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemQuantity}>Quantidade: {item.quantity}</Text>
                </View>
              </View>
              <Text style={styles.itemPrice}>R$ {(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}

          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>R$ {total.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Taxa de entrega</Text>
              <Text style={styles.summaryValue}>R$ {deliveryFee.toFixed(2)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>R$ {finalTotal.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Dados do Pagamento */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados do Cartão</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Número do Cartão</Text>
            <TextInput
              style={styles.input}
              placeholder="1234 5678 9012 3456"
              value={paymentData.cardNumber}
              onChangeText={(text) => setPaymentData(prev => ({ ...prev, cardNumber: text }))}
              keyboardType="numeric"
              maxLength={19}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.inputLabel}>Validade</Text>
              <TextInput
                style={styles.input}
                placeholder="MM/AA"
                value={paymentData.expiryDate}
                onChangeText={(text) => setPaymentData(prev => ({ ...prev, expiryDate: text }))}
                keyboardType="numeric"
                maxLength={5}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>CVV</Text>
              <TextInput
                style={styles.input}
                placeholder="123"
                value={paymentData.cvv}
                onChangeText={(text) => setPaymentData(prev => ({ ...prev, cvv: text }))}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nome no Cartão</Text>
            <TextInput
              style={styles.input}
              placeholder="João Silva"
              value={paymentData.cardholderName}
              onChangeText={(text) => setPaymentData(prev => ({ ...prev, cardholderName: text }))}
              autoCapitalize="words"
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
          onPress={handlePayment}
          disabled={isProcessing}
        >
          <Text style={styles.payButtonText}>
            {isProcessing ? 'Processando...' : `Pagar R$ ${finalTotal.toFixed(2)}`}
          </Text>
        </TouchableOpacity>
      </View>
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
  offlineIndicator: {
    backgroundColor: '#fef3c7',
    padding: 8,
    borderRadius: 6,
    marginTop: 10,
  },
  offlineText: {
    color: '#92400e',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  checkoutContent: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#64748b',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  summary: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  summaryValue: {
    fontSize: 14,
    color: '#1e293b',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
  },
  footer: {
    backgroundColor: 'white',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  payButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  payButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyCheckout: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
});