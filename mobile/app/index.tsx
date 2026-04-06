import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { createStock, getStocks, login } from '@/api';
import type { StockDto } from '@/api';
import { Header } from '@/components/Header';
import { StatusDisplay } from '@/components/StatusDisplay';
import { LoginForm } from '@/components/LoginForm';
import { LogoutBar } from '@/components/LogoutBar';
import { CreateStockForm } from '@/components/CreateStockForm';
import { StockList } from '@/components/StockList';

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

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Header title="Muilem BFF" />

          <StatusDisplay
            loading={loading}
            error={error}
            isLoggedIn={isLoggedIn}
            email={email}
          />

          {!isLoggedIn ? (
            <LoginForm
              email={email}
              password={password}
              loading={loading}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onLogin={handleLogin}
            />
          ) : (
            <>
              <LogoutBar onRefresh={refreshStocks} onLogout={handleLogout} />

              <CreateStockForm
                symbol={stockForm.symbol}
                companyName={stockForm.companyName}
                loading={loading}
                onSymbolChange={(value) =>
                  setStockForm((prev) => ({ ...prev, symbol: value }))
                }
                onCompanyNameChange={(value) =>
                  setStockForm((prev) => ({ ...prev, companyName: value }))
                }
                onCreate={handleCreateStock}
              />
            </>
          )}

          <StockList stocks={stocks} loading={loading} />
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
});
