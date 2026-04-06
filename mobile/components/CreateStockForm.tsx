import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

interface CreateStockFormProps {
  symbol: string;
  companyName: string;
  loading: boolean;
  onSymbolChange: (text: string) => void;
  onCompanyNameChange: (text: string) => void;
  onCreate: () => void;
}

export function CreateStockForm({
  symbol,
  companyName,
  loading,
  onSymbolChange,
  onCompanyNameChange,
  onCreate,
}: CreateStockFormProps) {
  return (
    <View style={styles.form}>
      <Text style={styles.sectionTitle}>Add a stock</Text>
      <TextInput
        style={styles.input}
        value={symbol}
        onChangeText={onSymbolChange}
        placeholder="Symbol"
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        value={companyName}
        onChangeText={onCompanyNameChange}
        placeholder="Company name"
        placeholderTextColor="#888"
      />
      <Button
        title="Create stock"
        onPress={onCreate}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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
