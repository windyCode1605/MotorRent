import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { BASE_URL } from '@env';

export default function VehicleListScreen({ navigation }) {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState('');

  const fetchVehicles = async (searchTerm = '') => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);      
      const response = await fetch(`${BASE_URL}/api/vehicles?${params.toString()}`);
      const data = await response.json();
      setVehicles(data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleSearch = () => {
    fetchVehicles(search);
  };

  const renderVehicle = ({ item, index }) => (
    <View style={styles.vehicleItem}>
      <View>
        <Text style={styles.vehicleName}>{`${index + 1}. ${item.name}`}</Text>
        <Text>Số chỗ: {item.seats}</Text>
        <Text>Thuê ngày: {item.rentalDate}</Text>
        <Text>Thuê tháng: {item.rentalMonth}</Text>
        <Text>
          Trạng thái: <Text style={item.status === 'Đang hoạt động' ? styles.statusActive : styles.statusInactive}>{item.status}</Text>
        </Text>
      </View>
      <TouchableOpacity>
        <Text style={styles.detailButton}>Chi tiết</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm Theo Tên, Biển số"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddVehicle')}
        >
          <Text style={styles.addButtonText}>Thêm xe mới</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={vehicles}
        renderItem={renderVehicle}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#10b981',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  vehicleItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vehicleName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  statusActive: {
    color: '#10b981',
  },
  statusInactive: {
    color: '#ef4444',
  },
  detailButton: {
    color: '#3b82f6',
  },
  list: {
    paddingBottom: 20,
  },
});
