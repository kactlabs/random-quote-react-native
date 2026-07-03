import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications appear when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Request notification permissions and set up the notification channel
 */
export async function setupNotifications() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Notification permissions not granted');
    return false;
  }

  // Set up Android notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('quotes', {
      name: 'GenAI Quotes',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#6c63ff',
    });
  }

  return true;
}

/**
 * Send a local push notification with the quote content
 */
export async function sendQuoteNotification(quote) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '💡 GenAI Quote',
      body: quote,
      data: { type: 'quote' },
      sound: true,
    },
    trigger: null, // Send immediately
  });
}
