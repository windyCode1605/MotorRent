import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BASE_URL } from '@env';
console.log("BASE URL OrderHistoryScreen:", BASE_URL);


const OrderHistoryScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchOrders = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log("Token OrderHistoryScreen:", token); 
      const response = await axios.get(`${BASE_URL}/rental/customer-rentals`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Lỗi khi tải đơn hàng:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const handleCancelOrder = async (rentalId) => {
    Alert.alert(
      'Xác nhận hủy đơn',
      'Bạn có chắc chắn muốn hủy đơn hàng này không?',
      [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Có',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              await axios.post(
                `${BASE_URL}/rental/cancel/${rentalId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
              );
              Alert.alert('Thành công', 'Đã hủy đơn hàng');
              fetchOrders(); 
            } catch (error) {
              console.error('Lỗi khi hủy đơn:', error);
              Alert.alert('Lỗi', 'Không thể hủy đơn hàng');
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Chờ xác nhận':
        return '#FFA500';
      case 'Đã xác nhận':
        return '#4CAF50';
      case 'Đã hủy':
        return '#FF0000';
      default:
        return '#000000';
    }
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>Đơn hàng #{item.rental_id}</Text>
        <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
          {item.status}
        </Text>
      </View>

      <View style={styles.carInfo}>
        <Text style={styles.carName}>{item.brand} {item.model}</Text>
        <Text style={styles.licensePlate}>Biển số: {item.license_plate}</Text>
      </View>

      <View style={styles.dateInfo}>
        <Text style={styles.date}>Ngày thuê: {new Date(item.start_date).toLocaleDateString('vi-VN')}</Text>
        <Text style={styles.date}>Ngày trả: {new Date(item.end_date).toLocaleDateString('vi-VN')}</Text>
      </View>

      <View style={styles.priceInfo}>
        <Text style={styles.totalPrice}>Tổng tiền: {item.total_price.toLocaleString('vi-VN')}đ</Text>
      </View>

      {item.status === 'Chờ xác nhận' && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => handleCancelOrder(item.rental_id)}
        >
          <Icon name="cancel" size={20} color="#fff" />
          <Text style={styles.cancelButtonText}>Hủy đơn</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lịch sử đơn hàng</Text>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.rental_id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>Không có đơn hàng nào</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
  },
  carInfo: {
    marginBottom: 10,
  },
  carName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  licensePlate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  dateInfo: {
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  priceInfo: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
    marginTop: 5,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
});

export default OrderHistoryScreen;
