import { initStripe, useStripe } from '@stripe/stripe-react-native';
import { Alert } from 'react-native';

// Initialize Stripe (call this once in the app)
export const initializeStripe = async () => {
  try {
    // For development, use test key. In production, use environment variable
    const publishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
      'pk_test_51ABC123DEF456GHI789JKL012MNO345PQR678STU901VWX234YZ567890ABCD123EFG456HIJ789KLM012NOP';

    if (!publishableKey || publishableKey === 'pk_test_...') {
      console.warn('Stripe publishable key not configured - using test mode');
      return false;
    }

    await initStripe({
      publishableKey,
      merchantIdentifier: 'merchant.com.smartmenu', // For Apple Pay
      urlScheme: 'smartmenu', // For 3D Secure
    });

    return true;
  } catch (error) {
    console.error('Error initializing Stripe:', error);
    return false;
  }
};

export interface PaymentData {
  amount: number; // Amount in cents
  currency: string;
  description: string;
  metadata?: Record<string, any>;
}

export class PaymentService {
  static async createPaymentIntent(data: PaymentData): Promise<string | null> {
    try {
      // This would typically call your backend API
      // For now, we'll simulate the response
      console.log('Creating payment intent:', data);

      // In a real implementation, you'd call:
      // const response = await fetch('/api/create-payment-intent', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      // const { clientSecret } = await response.json();

      // Simulated client secret
      const clientSecret = 'pi_test_secret_' + Date.now();

      return clientSecret;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      return null;
    }
  }

  static async processPayment(clientSecret: string, paymentMethodId: string): Promise<boolean> {
    // Simplified for demo - in production this would use Stripe API
    console.log('Processing payment with clientSecret:', clientSecret, 'paymentMethodId:', paymentMethodId);
    return true;
  }

  static async createPaymentMethod(cardDetails: {
    number: string;
    expMonth: number;
    expYear: number;
    cvc: string;
  }): Promise<string | null> {
    try {
      const { createPaymentMethod } = useStripe();

      const { error, paymentMethod } = await createPaymentMethod({
        paymentMethodType: 'Card',
        paymentMethodData: {
          billingDetails: {},
        },
      });

      if (error) {
        console.error('Error creating payment method:', error);
        return null;
      }

      return paymentMethod?.id || null;
    } catch (error) {
      console.error('Error creating payment method:', error);
      return null;
    }
  }

  static formatAmount(amount: number, currency: string = 'brl'): string {
    // Format amount for display (amount is in cents)
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency.toUpperCase(),
    });

    return formatter.format(amount / 100);
  }

  static async processCardPayment(paymentData: {
    amount: number;
    currency: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      // Basic validation
      if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.cardholderName) {
        return { success: false, error: 'Preencha todos os campos' };
      }

      // Create payment intent
      const clientSecret = await this.createPaymentIntent({
        amount: Math.round(paymentData.amount * 100), // Convert to cents
        currency: paymentData.currency,
        description: 'Pedido SmartMenu',
      });

      if (!clientSecret) {
        return { success: false, error: 'Erro ao criar intenção de pagamento' };
      }

      // For demo purposes, simulate successful payment
      // In production, this would create payment method and confirm payment
      console.log('Processing payment for:', paymentData.amount, paymentData.currency);

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      return { success: true };
    } catch (error) {
      console.error('Error processing card payment:', error);
      return { success: false, error: 'Erro inesperado no processamento' };
    }
  }
}