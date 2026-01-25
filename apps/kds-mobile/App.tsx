import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store';
import { KDSService } from './src/services/kdsService';
import AppNavigator from './src/navigation/AppNavigator';

function AppContent() {
  useEffect(() => {
    // Initialize KDS services
    const initializeServices = async () => {
      try {
        await KDSService.initialize();
        console.log('KDS services initialized');
      } catch (error) {
        console.error('Error initializing KDS services:', error);
      }
    };

    initializeServices();
  }, []);

  return <AppNavigator />;
}

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContent />
        <StatusBar style="light" />
      </PersistGate>
    </Provider>
  );
}