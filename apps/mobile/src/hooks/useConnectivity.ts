import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useDispatch } from 'react-redux';
import { setOfflineMode } from '../store/slices/cartSlice';

export const useConnectivity = () => {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [connectionType, setConnectionType] = useState<string>('unknown');
  const dispatch = useDispatch();

  useEffect(() => {
    // Get initial connection state
    const unsubscribe = NetInfo.addEventListener(state => {
      const connected = state.isConnected ?? false;
      const type = state.type;

      setIsConnected(connected);
      setConnectionType(type);

      // Update Redux store
      dispatch(setOfflineMode(!connected));

      console.log('Connection state changed:', { connected, type });
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  return {
    isConnected,
    connectionType,
    isOffline: !isConnected,
  };
};