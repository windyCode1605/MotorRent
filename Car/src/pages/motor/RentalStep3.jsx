import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const RentalStep3 = ({ route, navigation }) => {
  const { motorcycle, pickupLocation, pickupTime, selectedIds, services } = route.params;

  if (!services) {
    console.error("Services is undefined");
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Không có dịch vụ bổ sung được truyền.</Text>
      </View>
    );
  }

  const selectedServices = Array.isArray(services)
    ? services.filter((service) => selectedIds.includes(service.addon_id))
        .map((service) => service.addon_name)
        .join(', '): 'Không có dịch vụ bổ sung';

  const handleConfirm = () => {
    alert('Đặt xe thành công!');
    navigation.navigate('MotorScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Xác nhận thông tin</Text>
      <Text style={styles.label}>Xe: {motorcycle.model}</Text>
      <Text style={styles.label}>Vị trí nhận xe: {pickupLocation}</Text>
      <Text style={styles.label}>Thời gian nhận xe: {pickupTime}</Text>
      <Text style={styles.label}>Dịch vụ bổ sung: {selectedServices}</Text>
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