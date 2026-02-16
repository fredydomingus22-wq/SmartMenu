import { useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const LOCATION_TASK_NAME = 'background-location-task';

// Define the background task
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }: any) => {
  if (error) {
    console.error('Background location task error:', error);
    return;
  }
  if (data) {
    const { locations } = data;
    const location = locations[0];
    if (location) {
      // We need to retrieve the user ID from storage since hooks/context aren't available here
      // But for simplicity in this refactor, we'll dispatch to API if we can get the token/user from SecureStore inside the task
      // However, TaskManager runs in a separate context.
      // Best practice: Store the location in local storage or send it directly if we can access the token.
      // For now, let's just log it or try to send it if we have the token stored.
      
      try {
        const token = await SecureStore.getItemAsync('rider_token');
        const userStr = await SecureStore.getItemAsync('rider_user');
        
        if (token && userStr) {
           const user = JSON.parse(userStr);
           const { latitude, longitude } = location.coords;
           
           // We can't use the 'api' interceptor directly if it relies on a closure variable, 
           // but our api.ts uses SecureStore.getItemAsync inside the interceptor! 
           // So actually, 'api' import MIGHT work if the interceptor runs. 
           // However, to be safe and explicit in a background task:
           
           await axios.patch(`${process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3001'}/enatega-delivery-integration/rider/${user.id}`, {
             currentLat: latitude,
             currentLng: longitude,
             lastLocationAt: new Date().toISOString()
           }, {
             headers: { Authorization: `Bearer ${token}` }
           });
           
           console.log('Background location sent:', latitude, longitude);
        }
      } catch (err) {
        console.error('Background task failed:', err);
      }
    }
  }
});

export const useLocationTracking = (isOnline: boolean) => {
  const { user } = useAuth();

  useEffect(() => {
    const toggleTracking = async () => {
      try {
        const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
        
        if (isOnline && !hasStarted) {
          await startTracking();
        } else if (!isOnline && hasStarted) {
          await stopTracking();
        }
      } catch (e) {
        console.error('Error toggling location tracking:', e);
      }
    };

    toggleTracking();
  }, [isOnline]);

  const startTracking = async () => {
    try {
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus !== 'granted') {
        console.error('Foreground location permission denied');
        return;
      }

      const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus !== 'granted') {
        console.error('Background location permission denied');
        return;
      }

      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 10000,
        distanceInterval: 50,
        foregroundService: {
          notificationTitle: "SmartMenu Rider",
          notificationBody: "Tracking your location for deliveries",
          notificationColor: "#E91E63"
        }
      });
      console.log('Background tracking started');
    } catch (e) {
      console.error('Error starting location tracking', e);
    }
  };

  const stopTracking = async () => {
    try {
      const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
      if (hasStarted) {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
        console.log('Background tracking stopped');
      }
    } catch (e) {
      console.error('Error stopping location tracking', e);
    }
  };
};
