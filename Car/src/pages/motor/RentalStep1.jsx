import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const RentalStep1 = ({ navigation, route }) => {
  const { motorcycle } = route.params;
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupTime, setPickupTime] = useState('');

  const handleNext = () => {
    navigation.navigate('RentalStep2', { motorcycle, pickupLocation, pickupTime });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Thông tin cơ bản</Text>
      <Text style={styles.label}>Vị trí nhận xe *</Text>
      <TextInput
        style={styles.input}
        value={pickupLocation}
        onChangeText={setPickupLocation}
        placeholder="Nhập vị trí nhận xe"
      />
      <Text style={styles.label}>Thời gian nhận xe *</Text>
      <TextInput
        style={styles.input}
        value={pickupTime}
        onChangeText={setPickupTime}
        placeholder="Nhập thời gian nhận xe"
      />
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Tiếp theo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7f9fb' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, textAlign: 'center', color: '#0a3d62' },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 6, color: '#2f3542' },
  input: { borderWidth: 1, borderColor: '#dcdde1', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fff', marginBottom: 12 },
  button: { backgroundColor: '#1abc9c', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});

export default RentalStep1;