import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const BookingScreen = ({ route }) => {
  const { motorcycle } = route.params;
  const navigation = useNavigation();
  const [pickupLocation, setPickupLocation] = useState('');
  const [returnLocation, setReturnLocation] = useState('');

  const handleBooking = () => {
    if (!pickupLocation || !returnLocation) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập vị trí nhận và trả xe!");
      return;
    }

    navigation.navigate('Payment', {
      motorcycle,
      pickupLocation,
      returnLocation,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Thông tin xe máy</Text>
      <Text style={styles.name}>{motorcycle.name}</Text>
      <Text style={styles.price}>Giá: {motorcycle.price} VND/ngày</Text>

      <Text style={styles.label}>Vị trí nhận xe *</Text>
      <TextInput
        style={styles.input}
        value={pickupLocation}
        onChangeText={setPickupLocation}
        placeholder="Nhập vị trí nhận xe"
      />

      <Text style={styles.label}>Vị trí trả xe *</Text>
      <TextInput
        style={styles.input}
        value={returnLocation}
        onChangeText={setReturnLocation}
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
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  name: { fontSize: 18, marginVertical: 5 },
  price: { fontSize: 16, color: 'green', marginBottom: 10 },
  label: { fontSize: 16, marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginVertical: 5 },
  button: { backgroundColor: 'green', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default BookingScreen;
