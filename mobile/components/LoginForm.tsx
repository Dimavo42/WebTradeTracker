import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

interface LoginFormProps {
  email: string;
  password: string;
  loading: boolean;
  onEmailChange: (text: string) => void;
  onPasswordChange: (text: string) => void;
  onLogin: () => void;
}

export function LoginForm({
  email,
  password,
  loading,
  onEmailChange,
  onPasswordChange,
  onLogin,
}: LoginFormProps) {
  return (
    <View style={styles.form}>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={onEmailChange}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="you@example.com"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={onPasswordChange}
        secureTextEntry
        placeholder="••••••••"
        placeholderTextColor="#888"
      />

      <Button
        title="Log in"
        onPress={onLogin}
        disabled={loading || !email || !password}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
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
});
