import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BASE_URL } from '@env';
console.log("BASE URL PaymentScreen:", BASE_URL);

const PaymentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { reservationId, totalPrice } = route.params;

  const handleMoMoPayment = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/payment/create`, {
        reservation_id: reservationId,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const payUrl = response.data.payUrl;
      if (payUrl) {
        navigation.navigate('MoMoWebView', { payUrl });
      } else {
        Alert.alert('Không lấy được đường dẫn thanh toán từ MoMo.');
      }
    } catch (error) {
      console.error("Lỗi MoMo:", error);
      Alert.alert('Có lỗi khi kết nối đến cổng thanh toán.');
    }
  };

  const handleCashPayment = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.put(`${BASE_URL}/reservations/${reservationId}/pay-cash`, null, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        navigation.replace('PaymentSuccessScreen', { reservationId });
      } else {
        Alert.alert("Không thể cập nhật phương thức thanh toán.");
      }
    } catch (error) {
      console.error("Lỗi COD:", error);
      Alert.alert("Có lỗi xảy ra khi chọn thanh toán tiền mặt.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thanh toán</Text>
      <Text style={styles.info}>Mã đơn: {reservationId}</Text>
      <Text style={styles.amount}>Tổng tiền: {totalPrice.toLocaleString()} đ</Text>

      <TouchableOpacity style={styles.buttonMomo} onPress={handleMoMoPayment}>
        <Text style={styles.buttonText}>Thanh toán với MoMo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonCash} onPress={handleCashPayment}>
        <Text style={styles.buttonText}>Thanh toán tiền mặt</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  info: { fontSize: 16, marginBottom: 10, textAlign: 'center' },
  amount: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: '#e84118', marginBottom: 30 },
  buttonMomo: { backgroundColor: '#d81b60', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  buttonCash: { backgroundColor: '#44bd32', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default PaymentScreen;
