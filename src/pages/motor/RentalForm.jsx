import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const RentalForm = ({navigation}) => {
  const [step, setStep] = useState(1);
  const [pickupLocation, setPickupLocation] = useState('');
  const [returnLocation, setReturnLocation] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [returnTime, setReturnTime] = useState('');
  const [price, setPrice] = useState(80000);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else alert('Đặt xe thành công!');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View>
            <Text style={styles.label}>Thông tin cần nhập:</Text>
            <TouchableOpacity style={styles.input} onPress={() => setStep(2)}>
              <Text style={styles.placeholderText}>{pickupLocation || 'Chọn vị trí nhận xe'}</Text>
            </TouchableOpacity>
          </View>
        );
      case 2:
        return (
          <View>
            <Text style={styles.label}>Vị trí nhận xe *</Text>
            <TextInput
              style={styles.input}
              value={pickupLocation}
              onChangeText={setPickupLocation}
              placeholder="Nhập vị trí nhận xe"
            />
            <Text style={styles.label}>Thời gian thuê xe *</Text>
            <TextInput
              style={styles.input}
              value={pickupTime}
              onChangeText={setPickupTime}
              placeholder="Nhập thời gian nhận xe"
            />
            <TouchableOpacity style={styles.serviceBtn} onPress={() =>  navigation.navigate("SelectExtraServicesScreen")}>
              <Text style={styles.serviceBtnText}>Chọn dịch vụ bổ sung</Text>
            </TouchableOpacity>
          </View>
        );
      case 3:
        return (
          <View>
            <Text style={styles.label}>Địa điểm đón *</Text>
            <TextInput
              style={styles.input}
              value={pickupLocation}
              onChangeText={setPickupLocation}
              placeholder="Nhập địa điểm đón"
            />
            <Text style={styles.label}>Vị trí trả về *</Text>
            <TextInput
              style={styles.input}
              value={returnLocation}
              onChangeText={setReturnLocation}
              placeholder="Nhập địa điểm trả xe"
            />
            <Text style={styles.label}>Thời gian thuê *</Text>
            <TextInput
              style={styles.input}
              value={returnTime}
              onChangeText={setReturnTime}
              placeholder="Nhập thời gian trả xe"
            />
          </View>
        );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Thuê xe máy</Text>
      <View style={styles.card}>
        <Text style={styles.vehicleName}>Honda Beat 2018</Text>
        <Text style={styles.vehicleSubText}>Thuê xe máy tại Lampunggan</Text>
        <Text style={styles.vehicleTime}>8:00 - 18:00 hằng ngày</Text>
      </View>

      {renderStep()}

      <View style={styles.footer}>
        <Text style={styles.priceText}>Giá thuê: {step === 3 ? '135.000đ' : '80.000đ'}</Text>
        <TouchableOpacity style={styles.submitBtn} onPress={handleNext}>
          <Text style={styles.submitBtnText}>{step < 3 ? 'Tiếp theo' : 'Đặt ngay'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f7f9fb',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#0a3d62',
  },
  card: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e272e',
  },
  vehicleSubText: {
    color: '#576574',
    marginTop: 4,
  },
  vehicleTime: {
    color: '#8395a7',
    fontSize: 12,
    marginTop: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#2f3542',
  },
  input: {
    borderWidth: 1,
    borderColor: '#dcdde1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  placeholderText: {
    color: '#a4b0be'
  },
  serviceBtn: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  serviceBtnText: {
    color: '#FFF',
    fontWeight: '600',
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 10,
  },
  submitBtn: {
    backgroundColor: '#1abc9c',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  submitBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default RentalForm;
