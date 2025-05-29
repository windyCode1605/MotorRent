import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

const RentalStep1 = ({ navigation, route }) => {
  const { motorcycle } = route.params;

  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupTime, setPickupTime] = useState(new Date());
  const [returnLocation, setReturnLocation] = useState('');
  const [returnTime, setReturnTime] = useState(new Date());

  const [errors, setErrors] = useState({});

  const showDatePicker = (currentDate, setDate) => {
    DateTimePickerAndroid.open({
      value: currentDate,
      onChange: (event, selectedDate) => {
        if (selectedDate) {
          setDate(selectedDate);
        }
      },
      mode: 'date',
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!pickupLocation.trim()) newErrors.pickupLocation = 'Vui lòng nhập vị trí nhận xe.';
    if (!returnLocation.trim()) newErrors.returnLocation = 'Vui lòng nhập vị trí giao xe.';
    if (returnTime <= pickupTime) newErrors.time = 'Thời gian giao xe phải sau thời gian nhận xe.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;

    navigation.navigate('RentalStep2', {
      motorcycle,
      pickupLocation,
      pickupTime,
      returnLocation,
      returnTime,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Thông tin cơ bản</Text>

      <Text style={styles.label}>Vị trí nhận xe *</Text>
      <TextInput
        style={[styles.input, errors.pickupLocation && styles.inputError]}
        value={pickupLocation}
        onChangeText={text => {
          setPickupLocation(text);
          if (errors.pickupLocation) setErrors(prev => ({ ...prev, pickupLocation: '' }));
        }}
        placeholder="Nhập vị trí nhận xe"
      />
      {errors.pickupLocation && <Text style={styles.errorText}>{errors.pickupLocation}</Text>}

      <Text style={styles.label}>Thời gian nhận xe *</Text>
      <TouchableOpacity onPress={() => showDatePicker(pickupTime, setPickupTime)}>
        <Text style={styles.input}>{pickupTime.toLocaleDateString()}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Vị trí giao xe *</Text>
      <TextInput
        style={[styles.input, errors.returnLocation && styles.inputError]}
        value={returnLocation}
        onChangeText={text => {
          setReturnLocation(text);
          if (errors.returnLocation) setErrors(prev => ({ ...prev, returnLocation: '' }));
        }}
        placeholder="Nhập vị trí giao xe"
      />
      {errors.returnLocation && <Text style={styles.errorText}>{errors.returnLocation}</Text>}

      <Text style={styles.label}>Thời gian giao xe *</Text>
      <TouchableOpacity onPress={() => showDatePicker(returnTime, setReturnTime)}>
        <Text style={styles.input}>{returnTime.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {errors.time && <Text style={styles.errorText}>{errors.time}</Text>}

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
  input: {
    borderWidth: 1,
    borderColor: '#dcdde1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 13,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#1abc9c',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});

export default RentalStep1;
