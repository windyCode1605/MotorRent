import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import { BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const VehicleListScreen = ({ navigation }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchVehicles = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/vehicles`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVehicles(response.data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách xe:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchVehicles();
  }, []);

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.license_plate.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderVehicleCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('VehicleDetails', { vehicle: item })}
    >
      <Image
        source={{ uri: item.image_url }}
        style={styles.vehicleImage}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <Text style={styles.brand}>{item.brand} {item.model}</Text>
        <Text style={styles.detail}>Biển số: {item.license_plate}</Text>
        <Text style={styles.detail}>Năm SX: {item.year}</Text>
        <Text style={styles.detail}>Giá thuê: {item.daily_rental_price.toLocaleString('vi-VN')}đ/ngày</Text>
        <View style={styles.statusContainer}>
          <Text style={[
            styles.status,
            { color: item.status === 'Đang hoạt động' ? '#10b981' : '#ef4444' }
          ]}>
            {item.status}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Đang tải danh sách xe...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="magnify" size={24} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm theo tên, biển số..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <FlatList
        data={filteredVehicles}
        renderItem={renderVehicleCard}
        keyExtractor={(item) => item.car_id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>Không tìm thấy xe nào</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 10,
    padding: 10,
    borderRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  listContainer: {
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
  },
  vehicleImage: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 15,
  },
  brand: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  statusContainer: {
    marginTop: 8,
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default VehicleListScreen;
