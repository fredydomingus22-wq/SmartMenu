import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store';
import { NotificationService } from './src/services/notificationService';
import { initializeStripe } from './src/services/paymentService';
import AppNavigator from './src/navigation/AppNavigator';

function AppContent() {
  useEffect(() => {
    // Initialize services
    const initializeServices = async () => {
      try {
        // Initialize notifications
        await NotificationService.requestPermissions();
        const cleanup = NotificationService.setupNotificationListeners();

        // Initialize Stripe (temporarily disabled for testing)
        // await initializeStripe();

        return cleanup;
      } catch (error) {
        console.error('Error initializing services:', error);
      }
    };

    const cleanup = initializeServices();

    return () => {
      cleanup?.then(cleanupFn => cleanupFn?.());
    };
  }, []);

  return <AppNavigator />;
}

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContent />
        <StatusBar style="auto" />
      </PersistGate>
    </Provider>
  );
}
