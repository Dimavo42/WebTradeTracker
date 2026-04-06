import { Button, StyleSheet, View } from 'react-native';

interface LogoutBarProps {
  onRefresh: () => void;
  onLogout: () => void;
}

export function LogoutBar({ onRefresh, onLogout }: LogoutBarProps) {
  return (
    <View style={styles.row}>
      <Button title="Refresh stocks" onPress={onRefresh} />
      <Button title="Log out" onPress={onLogout} color="#d9534f" />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
});
