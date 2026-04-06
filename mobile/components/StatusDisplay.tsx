import { StyleSheet, Text } from 'react-native';

interface StatusDisplayProps {
  loading: boolean;
  error: string | null;
  isLoggedIn: boolean;
  email: string;
}

export function StatusDisplay({
  loading,
  error,
  isLoggedIn,
  email,
}: StatusDisplayProps) {
  let text = 'Enter your credentials to log in';

  if (loading) {
    text = 'Loading...';
  } else if (error) {
    text = `Error: ${error}`;
  } else if (isLoggedIn) {
    text = `Logged in as ${email}`;
  }

  return <Text style={styles.status}>{text}</Text>;
}

const styles = StyleSheet.create({
  status: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
});
