import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { BASE_URL } from "@env";

const SelectExtraServicesScreen = ({ navigation }) => {
  const [services, setServices] = useState([]); 
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${BASE_URL}/rentaladdons/getService`)
      .then(res => setServices(res.data))
      .catch(err => console.error("ERR", err))
      .finally(() => setLoading(false));
  }, []);

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id)
      ? prev.filter(x => x !== id)
      : [...prev, id]
    );
  };

  const renderItem = ({ item }) => {
    const selected = selectedIds.includes(item.addon_id);
    return (
      <TouchableOpacity
        style={[styles.card, selected && styles.cardSelected]}
        onPress={() => toggleSelect(item.addon_id)}
        activeOpacity={0.7}
      >
        <Icon name={getIcon(item.addon_type)} size={24} color={selected ? '#fff' : '#333'} />
        <Text style={[styles.name, selected && styles.textSelected]}>{item.addon_name}</Text>
        <Text style={[styles.price, selected && styles.textSelected]}>{Number(item.addon_price).toLocaleString()}₫</Text>
      </TouchableOpacity>
    );
  };

  const getIcon = (type) => {
    switch(type) {
      case 'Insurance': return 'shield-checkmark-outline';
      case 'Child Seat': return 'baby-outline';
      case 'GPS': return 'navigate-outline';
      case 'WiFi': return 'wifi-outline';
      default: return 'ellipsis-horizontal';
    }
  };

  const submit = () => {
    // pass selectedIds back or navigate with params
     navigation.navigate('RentalForm', { motorcycle , selectedIds });
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
      <Text style={styles.title}>Chọn dịch vụ bổ sung</Text>
      <FlatList
        data={services}
        keyExtractor={item => item.addon_id.toString()}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
      <TouchableOpacity style={styles.button} onPress={submit}>
        <Text style={styles.buttonText}>Xác nhận ({selectedIds.length})</Text>
      </TouchableOpacity>
    </View>
  );
};

const { width } = Dimensions.get('window');
const cardSize = (width - 60) / 2;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  row: { justifyContent: 'space-between' },
  card: { width: cardSize, padding: 16, backgroundColor: '#f0f0f0', borderRadius: 12, alignItems: 'center', marginBottom: 16 },
  cardSelected: { backgroundColor: '#27ae60' },
  name: { marginTop: 8, color: '#333', textAlign: 'center' },
  price: { marginTop: 4, fontWeight: 'bold', color: '#333' },
  textSelected: { color: '#fff' },
  button: { backgroundColor: '#27ae60', padding: 14, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default SelectExtraServicesScreen;
