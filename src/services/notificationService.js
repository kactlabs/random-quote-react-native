import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';
import { registerPushTokenAPI } from './api';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function setupNotifications() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Notification permissions not granted');
    return null;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#6c63ff',
    });
  }

  try {
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: '06c1e5f3-f277-4de3-ae2d-010ddf5d9a6f',
    });
    return tokenData.data;
  } catch (error) {
    console.log('Failed to get push token:', error);
    return null;
  }
}

export async function registerPushToken() {
  try {
    const token = await setupNotifications();
    if (token) {
      const result = await registerPushTokenAPI(token);
      console.log('Push token registered:', token);
      return token;
    }
    console.log('No push token available');
    return null;
  } catch (error) {
    console.log('Error registering push token:', error);
    return null;
  }
}

export async function sendLocalNotification(title, body) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
    },
    trigger: null,
  });
}
