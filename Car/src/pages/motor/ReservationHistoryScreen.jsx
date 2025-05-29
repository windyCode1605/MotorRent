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

const ReservationHistoryScreen = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchReservations = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/reservation/customer-reservations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservations(response.data);
    } catch (error) {
      console.error('Lỗi khi tải đơn đặt xe:', error);
      Alert.alert('Lỗi', 'Không thể tải lịch sử đặt xe');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchReservations();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#FFA500';
      case 'confirmed':
        return '#4CAF50';
      case 'cancelled':
        return '#FF0000';
      case 'completed':
        return '#2196F3';
      default:
        return '#000000';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return '#4CAF50';
      case 'pending':
        return '#FFA500';
      case 'failed':
        return '#FF0000';
      default:
        return '#000000';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'cancelled':
        return 'Đã hủy';
      case 'completed':
        return 'Hoàn thành';
      default:
        return status;
    }
  };

  const getPaymentStatusText = (status) => {
    switch (status) {
      case 'paid':
        return 'Đã thanh toán';
      case 'pending':
        return 'Chưa thanh toán';
      case 'failed':
        return 'Thanh toán thất bại';
      default:
        return status;
    }
  };

  const handlePayment = async (reservationId, totalPrice) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/payment/create`,
        { reservation_id: reservationId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.payUrl) {
        navigation.navigate('MoMoWebView', { payUrl: response.data.payUrl });
      } else {
        Alert.alert('Lỗi', 'Không thể tạo link thanh toán');
      }
    } catch (error) {
      console.error('Lỗi tạo thanh toán:', error);
      Alert.alert('Lỗi', 'Không thể khởi tạo thanh toán');
    }
  };

  const handleCancelReservation = async (reservationId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Hủy đơn đặt xe với ID:', reservationId);      console.log('Token:', token);
      await axios.post(`${BASE_URL}/reservation/cancel/${reservationId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      
      setReservations(prevReservations => 
        prevReservations.map(reservation => 
          reservation.reservation_id === reservationId 
            ? { ...reservation, status: 'cancelled' }
            : reservation
        )
      );
      
      Alert.alert('Thành công', 'Đơn đặt xe đã được hủy thành công');
    } catch (error) {
      console.error('Lỗi khi hủy đơn đặt xe:', error);
      Alert.alert('Lỗi', error.response?.data?.message || 'Không thể hủy đơn đặt xe');
    }
  };

  const confirmCancelReservation = (reservationId) => {
    Alert.alert(
      'Xác nhận hủy đơn',
      'Bạn có chắc chắn muốn hủy đơn đặt xe này không?',
      [
        { text: 'Không', style: 'cancel' },
        { 
          text: 'Có', 
          onPress: () => handleCancelReservation(reservationId),
          style: 'destructive'
        }
      ]
    );
  };

  const renderReservationItem = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>Đơn đặt #{item.reservation_id}</Text>
        <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
          {getStatusText(item.status)}
        </Text>
      </View>

      <View style={styles.vehicleInfo}>
        <Text style={styles.vehicleName}>{item.vehicle_name || 'Xe máy'}</Text>
        <Text style={styles.licensePlate}>Biển số: {item.license_plate}</Text>
      </View>

      <View style={styles.dateInfo}>
        <Text style={styles.date}>
          Ngày đặt: {new Date(item.created_at).toLocaleDateString('vi-VN')}
        </Text>
        <Text style={styles.date}>
          Ngày thuê: {new Date(item.start_date).toLocaleDateString('vi-VN')}
        </Text>
        <Text style={styles.date}>
          Ngày trả: {new Date(item.end_date).toLocaleDateString('vi-VN')}
        </Text>
      </View>

      <View style={styles.paymentInfo}>
        <Text style={styles.totalPrice}>
          Tổng tiền: {Number(item.total_price).toLocaleString('vi-VN')}đ
        </Text>
        <Text style={[
          styles.paymentStatus,
          { color: getPaymentStatusColor(item.payment_status) }
        ]}>
          {getPaymentStatusText(item.payment_status)}
        </Text>
      </View>

      {item.status === 'pending' && item.payment_status === 'pending' && (
        <TouchableOpacity
          style={styles.payButton}
          onPress={() => handlePayment(item.reservation_id, item.total_amount)}
        >
          <Icon name="payment" size={20} color="#fff" />
          <Text style={styles.payButtonText}>Thanh toán</Text>
        </TouchableOpacity>
      )}

      {item.status !== 'cancelled' && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => confirmCancelReservation(item.reservation_id)}
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
      <Text style={styles.title}>Lịch sử đặt xe</Text>
      <FlatList
        data={reservations}
        renderItem={renderReservationItem}
        keyExtractor={(item) => item.reservation_id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>Chưa có đơn đặt xe nào</Text>
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
    marginTop: 40,
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
  vehicleInfo: {
    marginBottom: 10,
  },
  vehicleName: {
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
  paymentInfo: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  paymentStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  payButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
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

export default ReservationHistoryScreen;
