import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList , ActivityIndicator} from 'react-native';
import axios from 'axios';
import { BASE_URL } from '@env';
console.log("BASE URL RentalStep2:", BASE_URL);



const RentalStep2 = ({ route, navigation }) => {
  const { motorcycle, pickupLocation, pickupTime, returnLocation, returnTime } = route.params;
  const [services, setServices] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
 

  useEffect(() => {
    axios.get(`${BASE_URL}/rentaladdons/getService`)
      .then(res => setServices(res.data))
      .catch(err => console.error("ERR", err))
      .finally(() => setLoading(false));
  }, []);

  const toggleSelect = useCallback((id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }, []);

    const handleNext = () => {
      const selectedServices = services.filter(service => selectedIds.includes(service.addon_id));
      console.log("SELECTED SERVICES:", selectedServices);
      console.log("Motorcycle in Step 2:", motorcycle);
      console.log("Pickup Time in Step 2:", pickupTime);
      console.log("Return Time in Step 2:", returnTime);
      navigation.navigate('RentalStep3', { motorcycle, pickupLocation, pickupTime, returnLocation, returnTime, selectedIds, services , selectedServices});
    };

  const renderItem = useCallback(({ item }) => (
    <ServiceCard 
      item={item} 
      selected={selectedIds.includes(item.addon_id)} 
      onPress={() => toggleSelect(item.addon_id)} 
    />
  ), [selectedIds, toggleSelect]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1abc9c" />
        <Text style={{ marginTop: 10, color: '#555' }}>Đang tải dịch vụ...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chọn dịch vụ bổ sung</Text>
      <FlatList
        data={services}
        keyExtractor={(item) => item.addon_id.toString()}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Tiếp theo</Text>
      </TouchableOpacity>
    </View>
  );
};


const ServiceCard = React.memo(({ item, selected, onPress }) => (
  <TouchableOpacity
    style={[styles.card, selected && styles.cardSelected]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={[styles.name, selected && styles.textSelected]}>
      {item.addon_name}
    </Text>
    <Text style={[styles.price, selected && styles.textSelected]}>
      {item.addon_price.toLocaleString()}₫
    </Text>
  </TouchableOpacity>
));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9fcff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: '#0a3d62',
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    margin: 6,
    padding: 18,
    backgroundColor: '#f0f0f5',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    transition: 'all 0.3s ease'
  },
  cardSelected: {
    backgroundColor: '#1abc9c',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 14,
    color: '#666',
  },
  textSelected: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#27ae60',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
    marginHorizontal: 20,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default RentalStep2;