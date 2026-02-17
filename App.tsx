import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

type Supplication = {
  id: string;
  text: string;
  addedAt: string;
};

const STORAGE_KEY = 'daily_supplications';

const defaultSupplications: Supplication[] = [
  {
    id: '1',
    text: 'اللهم اجعل يومي هذا مليئًا بالخير والبركة.',
    addedAt: '2026-01-01T06:00:00.000Z',
  },
  {
    id: '2',
    text: 'اللهم اغفر لي ولوالدي وارحمهما كما ربياني صغيرًا.',
    addedAt: '2026-01-01T06:05:00.000Z',
  },
  {
    id: '3',
    text: 'اللهم ارزقني قلبًا مطمئنًا ولسانًا ذاكرًا.',
    addedAt: '2026-01-01T06:10:00.000Z',
  },
];

function App() {
  const [supplications, setSupplications] = useState<Supplication[]>([]);
  const [newSupplication, setNewSupplication] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadSupplications = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (!saved) {
          setSupplications(defaultSupplications);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSupplications));
        } else {
          setSupplications(JSON.parse(saved));
        }
      } catch {
        setSupplications(defaultSupplications);
      } finally {
        setIsLoaded(true);
      }
    };

    loadSupplications();
  }, []);

  const saveSupplications = async (next: Supplication[]) => {
    setSupplications(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const handleAddSupplication = async () => {
    const trimmed = newSupplication.trim();
    if (!trimmed) {
      return;
    }

    const nextItem: Supplication = {
      id: Date.now().toString(),
      text: trimmed,
      addedAt: new Date().toISOString(),
    };

    const nextSupplications = [nextItem, ...supplications];
    await saveSupplications(nextSupplications);
    setNewSupplication('');
  };

  const todaysSupplication = useMemo(() => supplications[0], [supplications]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text style={styles.title}>Daily Prayers & Supplications</Text>
        <Text style={styles.subtitle}>Read, remember, and add a new supplication every day.</Text>

        {isLoaded && todaysSupplication ? (
          <View style={styles.dailyCard}>
            <Text style={styles.dailyLabel}>Today’s Supplication</Text>
            <Text style={styles.dailyText}>{todaysSupplication.text}</Text>
          </View>
        ) : (
          <Text style={styles.loading}>Loading your supplications…</Text>
        )}

        <View style={styles.form}>
          <TextInput
            value={newSupplication}
            onChangeText={setNewSupplication}
            placeholder="Add a new daily supplication..."
            multiline
            style={styles.input}
          />
          <TouchableOpacity style={styles.button} onPress={handleAddSupplication}>
            <Text style={styles.buttonText}>Add Supplication</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>All Supplications</Text>
        <FlatList
          data={supplications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.listText}>{item.text}</Text>
              <Text style={styles.listDate}>{new Date(item.addedAt).toLocaleDateString()}</Text>
            </View>
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A2A3A',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#556477',
    marginBottom: 16,
  },
  dailyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DFE7F0',
    marginBottom: 16,
  },
  dailyLabel: {
    fontSize: 13,
    color: '#48607A',
    fontWeight: '600',
    marginBottom: 8,
  },
  dailyText: {
    fontSize: 17,
    color: '#1A2A3A',
    lineHeight: 26,
  },
  loading: {
    color: '#556477',
    marginBottom: 16,
  },
  form: {
    marginBottom: 14,
  },
  input: {
    minHeight: 86,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CFD9E6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: '#316AFF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A2A3A',
    marginBottom: 8,
  },
  list: {
    paddingBottom: 30,
  },
  listItem: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE7F0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  listText: {
    color: '#22364A',
    lineHeight: 22,
  },
  listDate: {
    marginTop: 8,
    fontSize: 12,
    color: '#7A8796',
  },
});

export default App;
