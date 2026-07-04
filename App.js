import React, { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import AdminScreen from './src/screens/AdminScreen';
import AdminLoginScreen from './src/screens/AdminLoginScreen';
import { registerPushToken } from './src/services/notificationService';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      const { title, body } = notification.request.content;
      setNotifications((prev) => [
        { id: Date.now().toString(), title, body, time: new Date().toLocaleTimeString() },
        ...prev,
      ]);
    });

    return () => subscription.remove();
  }, []);

  const handleLogin = async (userData) => {
    setUser(userData);
    const token = await registerPushToken();
    if (token) {
      Alert.alert('Push Enabled', 'Push token registered: ' + token.substring(0, 30) + '...');
    } else {
      Alert.alert('Push Failed', 'Could not register push token. Notifications will not work.');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setNotifications([]);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} onLogin={handleLogin} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Home">
              {(props) => (
                <HomeScreen
                  {...props}
                  onLogout={handleLogout}
                  username={user.username}
                  notifications={notifications}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="AdminLogin">
              {(props) => <AdminLoginScreen {...props} />}
            </Stack.Screen>
            <Stack.Screen name="Admin">
              {(props) => <AdminScreen {...props} username={user.username} />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
