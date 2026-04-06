import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import type { StockDto } from '@/api';

interface StockListProps {
  stocks: StockDto[];
  loading: boolean;
}

export function StockList({ stocks, loading }: StockListProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Stocks</Text>
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
            <Text style={styles.stockMeta}>
              Created {new Date(stock.createdAt).toLocaleDateString()}
            </Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
  bold: {
    fontWeight: '600',
  },
  stockMeta: {
    fontSize: 12,
    color: '#444',
  },
});
