{/**Buoc 4 */ }
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@env';
console.log("BASE URL NewServiceScreen:", BASE_URL);


const NewServiceScreen = ({ navigation, route }) => {
  const [servicesList, setServicesList] = useState([]);
  const [service, setService] = useState('');
  const [unit, setUnit] = useState('Lần');
  const [quantity, setQuantity] = useState('1');
  const [price, setPrice] = useState('0');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = Number(quantity) * Number(price);
  const { maintenance_id } = route.params;
  console.log('Maintenance ID:', maintenance_id);


  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('token in edit:', token);
      const response = await axios.get(`${BASE_URL}/services/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setServicesList(response.data);
      if (response.data.length > 0) {
        setService(response.data[0].service_name);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải danh sách dịch vụ');
    }
  };

  const handleSave = async () => {
    if (!service || !quantity || !price) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const payload = {
        maintenance_id: maintenance_id,
        service_name: service,
        unit,
        quantity: Number(quantity),
        unit_price: Number(price),
        notes: note,
      };

      await axios.post(`${BASE_URL}/services/create`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Alert.alert('Thành công', 'Dịch vụ đã được lưu');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lưu dịch vụ');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sửa dịch vụ</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.label}>Dịch vụ<Text style={{ color: 'red' }}> *</Text></Text>
        <View style={styles.inputWrapper}>
          <Picker
            selectedValue={service}
            onValueChange={(value) => setService(value)}
            style={styles.picker}
          >
            {servicesList.map((item) => (
              <Picker.Item key={item.service_id} label={item.service_name} value={item.service_name} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Đơn vị</Text>
        <View style={styles.inputWrapper}>
          <Picker
            selectedValue={unit}
            onValueChange={(value) => setUnit(value)}
            style={styles.picker}
          >
            <Picker.Item label="Lần" value="Lần" />
            <Picker.Item label="Ấn" value="Ấn" />
            <Picker.Item label="Chi" value="Chi" />
            <Picker.Item label="Bộ" value="Bộ" />
            <Picker.Item label="Công" value="Công" />
          </Picker>
        </View>

        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Số lượng</Text>
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
            />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Đơn giá</Text>
            <View style={styles.priceRow}>
              <TextInput
                style={[styles.textInput, { flex: 1 }]}
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />
              <Text style={styles.unitText}>đ</Text>
            </View>
          </View>
        </View>

       
        <Text style={styles.label}>Thành tiền</Text>
        <TextInput
          style={styles.textInput}
          editable={false}
          value={`${total.toLocaleString()} đ`}
        />

        
        <Text style={styles.label}>Ghi chú</Text>
        <TextInput
          style={[styles.textInput, { height: 100, textAlignVertical: 'top' }]}
          multiline
          value={note}
          onChangeText={setNote}
          placeholder="Nhập ghi chú"
        />
      </ScrollView>

     
      <TouchableOpacity
        style={[styles.saveButton, isSubmitting && { backgroundColor: '#aaa' }]}
        onPress={handleSave}
        disabled={isSubmitting}
      >
        <Text style={styles.saveButtonText}>Lưu</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NewServiceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#000',
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  picker: {
    height: 48,
    paddingHorizontal: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unitText: {
    marginLeft: 4,
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 14,
    borderRadius: 24,
    marginHorizontal: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
