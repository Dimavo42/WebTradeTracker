import { StyleSheet, Text } from 'react-native';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return <Text style={styles.title}>{title}</Text>;
}

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});
