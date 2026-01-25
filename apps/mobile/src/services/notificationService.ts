import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { store } from '../store';
import { setToken, setPermissionGranted, addNotification } from '../store/slices/notificationsSlice';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export class NotificationService {
  static async requestPermissions(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    const granted = finalStatus === 'granted';
    store.dispatch(setPermissionGranted(granted));

    if (granted) {
      await this.registerForPushNotifications();
    }

    return granted;
  }

  static async registerForPushNotifications(): Promise<string | null> {
    let token: string | null = null;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Platform.OS === 'ios') {
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowCriticalAlerts: true,
          allowProvisional: false,
        },
      });

      if (status !== 'granted') {
        return null;
      }
    }

    try {
      token = (await Notifications.getExpoPushTokenAsync()).data;
      store.dispatch(setToken(token));
      console.log('Push token:', token);
    } catch (error) {
      console.error('Error getting push token:', error);
    }

    return token;
  }

  static async sendLocalNotification(title: string, body: string, data?: any) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
      },
      trigger: null, // Send immediately
    });

    // Also add to Redux store
    store.dispatch(addNotification({ title, body, data }));
  }

  static async sendOrderStatusNotification(orderId: string, status: string) {
    const statusMessages = {
      received: { title: 'Pedido Recebido! 🎉', body: 'Seu pedido foi confirmado e está sendo preparado.' },
      preparing: { title: 'Pedido em Preparo! 👨‍🍳', body: 'Estamos preparando seu pedido com todo cuidado.' },
      ready: { title: 'Pedido Pronto! ✅', body: 'Seu pedido está pronto para retirada.' },
      completed: { title: 'Pedido Finalizado! 😊', body: 'Obrigado por escolher nosso restaurante!' },
    };

    const message = statusMessages[status as keyof typeof statusMessages];
    if (message) {
      await this.sendLocalNotification(message.title, message.body, { orderId, status });
    }
  }

  static setupNotificationListeners() {
    // Handle notification received while app is foregrounded
    const notificationReceivedListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      store.dispatch(addNotification({
        title: notification.request.content.title || 'Notificação',
        body: notification.request.content.body || '',
        data: notification.request.content.data,
      }));
    });

    // Handle notification response (user tapped notification)
    const notificationResponseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      // Handle navigation or actions based on notification data
      const data = response.notification.request.content.data;
      if (data?.orderId) {
        // Navigate to order details
        // This will be handled by navigation service
      }
    });

    return () => {
      notificationReceivedListener.remove();
      notificationResponseListener.remove();
    };
  }
}