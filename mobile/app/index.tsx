import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  Text,
} from 'react-native';

import { createStock, getStocks, login } from '@/api';
import type { StockDto } from '@/api';

const initialStockForm = {
  symbol: '',
  companyName: '',
};

function getErrorMessage(error: unknown, fallback: string) {
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as any).message);
  }

  return fallback;
}

export default function HomeScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [stocks, setStocks] = useState<StockDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stockForm, setStockForm] = useState(initialStockForm);

  const isLoggedIn = Boolean(token);

  useEffect(() => {
    if (!token) {
      return;
    }

    setLoading(true);
    getStocks(token)
      .then(setStocks)
      .catch((err: unknown) => {
        setError(getErrorMessage(err, 'Failed to load stocks'));
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);

    try {
      const auth = await login({ email, password });
      setToken(auth.token);
    } catch (err) {
      setError(getErrorMessage(err, 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStock = async () => {
    if (!token) {
      setError('Please login first');
      return;
    }

    if (!stockForm.symbol || !stockForm.companyName) {
      setError('Fill in both symbol and company name');
      return;
    }

    setLoading(true);

    try {
      const created = await createStock(token, {
        symbol: stockForm.symbol.trim(),
        companyName: stockForm.companyName.trim(),
      });
      setStocks((current) => [created, ...current]);
      setStockForm(initialStockForm);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to create stock'));
    } finally {
      setLoading(false);
    }
  };

  const refreshStocks = async () => {
    if (!token) {
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const list = await getStocks(token);
      setStocks(list);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to refresh stocks'));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setStocks([]);
    setEmail('');
    setPassword('');
    setError(null);
  };

  const statusText = useMemo(() => {
    if (loading) {
      return 'Loading...';
    }

    if (error) {
      return `Error: ${error}`;
    }

    if (isLoggedIn) {
      return `Logged in as ${email}`;
    }

    return 'Enter your credentials to log in';
  }, [email, error, isLoggedIn, loading]);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>
            Muilem BFF
          </Text>

          <Text style={styles.status}>
            {statusText}
          </Text>

          {!isLoggedIn ? (
            <View style={styles.form}>
              <Text style={styles.label}>
                Email
              </Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="you@example.com"
                placeholderTextColor="#888"
              />

              <Text style={styles.label}>
                Password
              </Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="••••••••"
                placeholderTextColor="#888"
              />

              <Button title="Log in" onPress={handleLogin} disabled={loading || !email || !password} />
            </View>
          ) : (
            <View style={styles.form}>
              <View style={styles.row}>
                <Button title="Refresh stocks" onPress={refreshStocks} />
                <Button title="Log out" onPress={handleLogout} color="#d9534f" />
              </View>

              <Text style={styles.sectionTitle}>
                Add a stock
              </Text>
              <TextInput
                style={styles.input}
                value={stockForm.symbol}
                onChangeText={(value) => setStockForm((prev) => ({ ...prev, symbol: value }))}
                placeholder="Symbol"
                placeholderTextColor="#888"
              />
              <TextInput
                style={styles.input}
                value={stockForm.companyName}
                onChangeText={(value) => setStockForm((prev) => ({ ...prev, companyName: value }))}
                placeholder="Company name"
                placeholderTextColor="#888"
              />
              <Button title="Create stock" onPress={handleCreateStock} disabled={loading} />
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Stocks
            </Text>
            {loading && <ActivityIndicator size="small" color="#0a7ea4" />}
            {stocks.length === 0 && !loading ? (
              <Text>No stocks available yet.</Text>
            ) : (
              stocks.map((stock) => (
                <View key={stock.id} style={styles.stockCard}>
                  <View style={styles.stockHeader}>
                    <Text style={styles.bold}>{stock.symbol}</Text>
                    <Text>{stock.exchange ?? 'N/A'}</Text>
                  </View>
                  <Text>{stock.companyName}</Text>
                  <Text style={styles.stockMeta}>Created {new Date(stock.createdAt).toLocaleDateString()}</Text>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 18,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  status: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  form: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff',
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  stockCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 16,
    padding: 14,
    backgroundColor: '#f8fbff',
    gap: 6,
  },
  stockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stockMeta: {
    fontSize: 12,
    color: '#444',
  },
  bold: {
    fontWeight: '600',
  },
});
