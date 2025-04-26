import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import axios from 'axios';
import { BASE_URL } from '@env';

const ExtraServiceSummaryScreen = ({ route, navigation }) => {
  const { selectedIds } = route.params;
  const [addons, setAddons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const loadAddons = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/rentaladdons`);
        const all = res.data;
        // Filter to only selected
        const filtered = all.filter(a => selectedIds.includes(a.addon_id));
        setAddons(filtered);
        // compute total
        const sum = filtered.reduce((acc, it) => acc + parseFloat(it.addon_price) * it.quantity, 0);
        setTotal(sum);
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Không thể tải dịch vụ bổ sung');
      } finally {
        setLoading(false);
      }
    };
    loadAddons();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.name}>{item.addon_name}</Text>
      <Text style={styles.qty}>x{item.quantity}</Text>
      <Text style={styles.price}>{Number(item.addon_price * item.quantity).toLocaleString()}₫</Text>
    </View>
  );

  const handleOrder = () => {
    // TODO: navigate to booking form or call reservation API
    navigation.navigate('RentalForm', { selectedAddons: addons, motorcycle });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#27ae60" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xác nhận dịch vụ bổ sung</Text>
      <FlatList
        data={addons}
        keyExtractor={item => item.addon_id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text>Chưa chọn dịch vụ nào.</Text>}
      />
      <View style={styles.footer}>
        <Text style={styles.totalText}>Tổng cộng: {total.toLocaleString()}₫</Text>
        <TouchableOpacity style={styles.button} onPress={handleOrder}>
          <Text style={styles.buttonText}>Đặt ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#eee' },
  name: { flex: 3 },
  qty: { flex: 1, textAlign: 'center' },
  price: { flex: 2, textAlign: 'right' },
  footer: { marginTop: 20, borderTopWidth: 1, borderColor: '#ddd', paddingTop: 16 },
  totalText: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  button: { backgroundColor: '#27ae60', padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default ExtraServiceSummaryScreen;
