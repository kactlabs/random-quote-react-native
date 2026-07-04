import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { sendNotificationAPI, broadcastNotificationAPI } from '../services/api';

const QUOTES_URL = 'https://fastapi-for-quote-dummy.vercel.app/quotes';

export default function AdminScreen({ navigation, username }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [targetUser, setTargetUser] = useState('');
  const [loading, setLoading] = useState(false);
  const [quotes, setQuotes] = useState([]);
  const [sendingRandom, setSendingRandom] = useState(false);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const response = await fetch(QUOTES_URL);
      const data = await response.json();
      setQuotes(data.quotes || []);
    } catch (error) {
      console.log('Failed to fetch quotes:', error);
    }
  };

  const handleSendRandomQuote = async () => {
    if (quotes.length === 0) {
      Alert.alert('Error', 'No quotes available');
      return;
    }
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const notifTitle = '💡 GenAI Quote';
    const notifBody = `"${randomQuote.text}" — ${randomQuote.author}`;

    setSendingRandom(true);
    try {
      const result = await broadcastNotificationAPI(notifTitle, notifBody);
      Alert.alert(
        'Quote Sent!',
        `"${randomQuote.text}" — ${randomQuote.author}\n\nSent: ${result.sent}, Failed: ${result.failed}`
      );
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setSendingRandom(false);
    }
  };

  const handleSendToUser = async () => {
    if (!title.trim() || !body.trim() || !targetUser.trim()) {
      Alert.alert('Error', 'Please fill title, body, and target username');
      return;
    }
    setLoading(true);
    try {
      const result = await sendNotificationAPI(title, body, targetUser);
      Alert.alert('Success', `Notification sent! (${result.sent} delivered, ${result.failed} failed)`);
      setTitle('');
      setBody('');
      setTargetUser('');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBroadcast = async () => {
    if (!title.trim() || !body.trim()) {
      Alert.alert('Error', 'Please fill title and body');
      return;
    }
    setLoading(true);
    try {
      const result = await broadcastNotificationAPI(title, body);
      Alert.alert(
        'Broadcast Sent',
        `Sent: ${result.sent}, Failed: ${result.failed}`
      );
      setTitle('');
      setBody('');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Admin Panel</Text>
          <Text style={styles.headerSubtitle}>Send notifications to users</Text>
        </View>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.replace('Home')}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        {/* Random Quote Section */}
        <Text style={styles.sectionTitle}>🎲 Send Random Quote</Text>
        <TouchableOpacity
          style={[styles.button, styles.randomButton]}
          onPress={handleSendRandomQuote}
          disabled={sendingRandom}
        >
          {sendingRandom ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>🎲 Send Random Quote to All</Text>
          )}
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Custom Notification Section */}
        <Text style={styles.sectionTitle}>📢 Custom Notification</Text>

        <TextInput
          style={styles.input}
          placeholder="Notification Title"
          placeholderTextColor="#888"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[styles.input, styles.bodyInput]}
          placeholder="Notification Body"
          placeholderTextColor="#888"
          value={body}
          onChangeText={setBody}
          multiline
          numberOfLines={3}
        />
        <TextInput
          style={styles.input}
          placeholder="Target Username (for individual send)"
          placeholderTextColor="#888"
          value={targetUser}
          onChangeText={setTargetUser}
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={[styles.button, styles.sendButton]}
          onPress={handleSendToUser}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>📤 Send to User</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.broadcastButton]}
          onPress={handleBroadcast}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>📡 Broadcast to All</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
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
    color: '#e74c3c',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  backButton: {
    backgroundColor: '#2a2a4a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  backText: {
    color: '#6c63ff',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentInner: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#2a2a4a',
    marginVertical: 24,
  },
  input: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    color: '#fff',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  bodyInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  randomButton: {
    backgroundColor: '#27ae60',
  },
  sendButton: {
    backgroundColor: '#6c63ff',
  },
  broadcastButton: {
    backgroundColor: '#e67e22',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
