import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const RentalStep3 = ({ route, navigation }) => {
  const [customer, setCustomer] = useState(null);
  const { motorcycle, pickupLocation, pickupTime, returnLocation, returnTime, selectedIds, services } = route.params;

  useEffect(() => {
    const fetchCustomerInfo = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log("token RETAL ASTEP 3: ", token);
        const accountId = await AsyncStorage.getItem('account_id');
        if (!accountId) {
          console.error("Không tìm thấy account_id trong AsyncStorage");
          return;
        }
        const response = await axios.get(`${BASE_URL}/customers/${accountId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCustomer(response.data);
      } catch (error) {
        console.error("Lỗi khi fetch customer info:", error.response?.data || error.message);
      }
    };
    fetchCustomerInfo();
  }, []);

  const formatDateTime = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleString('vi-VN', { hour12: false });
  };

  const handleConfirm = async () => {
    if (!customer || !motorcycle) {
      console.log(customer, motorcycle);
      alert("Thông tin chưa đầy đủ. Vui lòng thử lại sau.");
      return;
    }
    try {
      const token = await AsyncStorage.getItem('token');

      const payload = {
        customer_id: customer.customer_id,
        car_id: motorcycle.motorcycle_id,
        start_date: new Date(pickupTime).toISOString(),
        end_date: new Date(returnTime).toISOString(),
        status: "pending",
        total_price: totalPrice,
        payment_status: "unpaid",
        pickup_location: pickupLocation,
        return_location: returnLocation,
      };

      console.log("Payload gửi lên:", payload);

      const response = await axios.post(`${BASE_URL}/reservations`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Tạo đơn thành công:", response.data);
      navigation.navigate('SuccessScreen', { reservationId: response.data.reservation_id });
    } catch (error) {
      console.error("Lỗi khi gửi đơn đặt xe:", error.response?.data || error.message);
      alert("Có lỗi xảy ra khi xác nhận đơn, vui lòng thử lại.");
    }
  };

  // 🛵 Xử lý dịch vụ và tính tổng tiền
  const pickupDate = new Date(pickupTime);
  const returnDate = new Date(returnTime);
  const rentalDays = Math.max(1, Math.ceil((returnDate - pickupDate) / (1000 * 60 * 60 * 24))); // ít nhất 1 ngày

  const priceService = Array.isArray(services)
    ? services.filter(service => selectedIds.includes(service.addon_id)).reduce((total, service) => total + Number(service.addon_price), 0)
    : 0;

  const totalMotorcyclePrice = motorcycle.daily_rental_price * rentalDays;
  const totalPrice = totalMotorcyclePrice + priceService;

  const selectedServices = Array.isArray(services)
    ? services.filter(service => selectedIds.includes(service.addon_id)).map(service => service.addon_name).join(', ')
    : 'Không có dịch vụ bổ sung';

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Xác nhận thông tin</Text>
      <Text style={styles.label}>Xe: {motorcycle.model}</Text>
      <Text style={styles.label}>Vị trí nhận xe: {pickupLocation}</Text>
      <Text style={styles.label}>Thời gian nhận xe: {formatDateTime(pickupTime)}</Text>
      <Text style={styles.label}>Vị trí trả xe: {returnLocation}</Text>
      <Text style={styles.label}>Thời gian trả xe: {formatDateTime(returnTime)}</Text>
      <Text style={styles.label}>Dịch vụ bổ sung: {selectedServices}</Text>
      <Text style={styles.label}>Tổng tiền dịch vụ bổ sung: {priceService.toLocaleString()}(đ)</Text>
      <Text style={styles.label}>Tổng tiền thuê xe: {totalMotorcyclePrice.toLocaleString()}(đ)</Text>
      <Text style={styles.label}>Tổng tiền: {totalPrice.toLocaleString()}(đ)</Text>
      <TouchableOpacity style={styles.button} onPress={handleConfirm}>
        <Text style={styles.buttonText}>Xác nhận</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7f9fb' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, textAlign: 'center', color: '#0a3d62' },
  label: { fontSize: 16, marginBottom: 8, color: '#2f3542' },
  button: { backgroundColor: '#1abc9c', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});

export default RentalStep3;
