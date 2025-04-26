import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const BookingScreen = ({ route }) => {
  const { motorcycle } = route.params;
  const navigation = useNavigation();
  const [position, setPosition] = useState('');
  const [fuel, setFuel] = useState('');

  const handleBooking = () => {
    // Gửi dữ liệu đặt xe đến backend (sẽ xử lý ở phần backend)
    navigation.navigate('Payment', { motorcycle, position, fuel });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Thông tin xe máy</Text>
      <Text style={styles.name}>{motorcycle.name}</Text>
      <Text style={styles.price}>{motorcycle.price}</Text>

      <Text style={styles.label}>Vị trí nhận xe *</Text>
      <TextInput
        style={styles.input}
        value={position}
        onChangeText={setPosition}
        placeholder="Nhập vị trí nhận xe"
      />

      <Text style={styles.label}>Chọn vị trí trả xe *</Text>
      <TextInput
        style={styles.input}
        value={fuel}
        onChangeText={setFuel}
        placeholder="Nhập vị trí trả xe"
      />

      <TouchableOpacity style={styles.button} onPress={handleBooking}>
        <Text style={styles.buttonText}>Đặt ngay</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 20, fontWeight: 'bold' },
  name: { fontSize: 18, marginVertical: 5 },
  price: { fontSize: 16, color: 'green' },
  label: { fontSize: 16, marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginVertical: 5 },
  button: { backgroundColor: 'green', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default BookingScreen;