import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { logoutAPI } from '../services/api';

export default function HomeScreen({ navigation, onLogout, username, notifications }) {
  const handleLogout = async () => {
    try {
      await logoutAPI();
    } catch (e) {}
    onLogout();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>GenAI Quotes</Text>
          <Text style={styles.headerSubtitle}>Welcome, {username}</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.adminButton}
            onPress={() => navigation.navigate('AdminLogin')}
          >
            <Text style={styles.adminButtonText}>🔐 Admin</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>🔔 Notifications</Text>
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No notifications yet</Text>
            <Text style={styles.emptySubtext}>
              Quotes sent by admin will appear here
            </Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.notifCard}>
                <Text style={styles.notifTitle}>{item.title}</Text>
                <Text style={styles.notifBody}>{item.body}</Text>
                <Text style={styles.notifTime}>{item.time}</Text>
              </View>
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#16213e',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6c63ff',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  adminButton: {
    backgroundColor: '#2a2a4a',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  adminButtonText: {
    color: '#6c63ff',
    fontSize: 13,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#555',
    fontSize: 13,
  },
  listContent: {
    paddingBottom: 30,
  },
  notifCard: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  notifTitle: {
    color: '#6c63ff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  notifBody: {
    color: '#e0e0e0',
    fontSize: 14,
    lineHeight: 20,
  },
  notifTime: {
    color: '#555',
    fontSize: 11,
    marginTop: 8,
    textAlign: 'right',
  },
});
