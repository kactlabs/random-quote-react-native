import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { fetchAllQuotesAPI, sendQuoteAPI } from '../services/api';
import { sendQuoteNotification } from '../services/notificationService';

export default function HomeScreen({ onLogout }) {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState(null);

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    setLoading(true);
    try {
      const response = await fetchAllQuotesAPI();
      if (response.success) {
        setQuotes(response.data);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load quotes');
    } finally {
      setLoading(false);
    }
  };

  const handleSendQuote = async (quote) => {
    setSendingId(quote.id);
    try {
      // Call the API to "send" the quote
      const response = await sendQuoteAPI(quote.id);

      if (response.success) {
        // Trigger a local push notification
        await sendQuoteNotification(`"${quote.text}" — ${quote.author}`);
        Alert.alert('Sent!', 'Quote sent as push notification');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send quote');
    } finally {
      setSendingId(null);
    }
  };

  const renderQuote = ({ item }) => (
    <View style={styles.quoteCard}>
      <Text style={styles.quoteText}>"{item.text}"</Text>
      <Text style={styles.authorText}>— {item.author}</Text>
      <TouchableOpacity
        style={[styles.sendButton, sendingId === item.id && styles.sendingButton]}
        onPress={() => handleSendQuote(item)}
        disabled={sendingId === item.id}
      >
        {sendingId === item.id ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.sendButtonText}>📤 Send as Notification</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>GenAI Quotes</Text>
          <Text style={styles.headerSubtitle}>Tap to send as push notification</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6c63ff" />
          <Text style={styles.loadingText}>Loading quotes...</Text>
        </View>
      ) : (
        <FlatList
          data={quotes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderQuote}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6c63ff',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#888',
    marginTop: 12,
    fontSize: 14,
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  quoteCard: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  quoteText: {
    color: '#e0e0e0',
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 8,
  },
  authorText: {
    color: '#6c63ff',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 16,
  },
  sendButton: {
    backgroundColor: '#6c63ff',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  sendingButton: {
    backgroundColor: '#4a44b5',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
