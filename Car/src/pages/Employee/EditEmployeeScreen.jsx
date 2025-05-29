import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@env';

// ... import như cũ
const EditEmployeeScreen = ({ route, navigation }) => {
  const { employee } = route.params;
  const [formData, setFormData] = useState({
    full_name: employee.full_name,
    email: employee.email,
    phone_number: employee.phone_number,
    password: '',
    confirmPassword: '',
    job_title: employee.job_title
  });

  const validateForm = () => {
    if (!formData.full_name || !formData.email || !formData.phone_number) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return false;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu không khớp');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      Alert.alert('Lỗi', 'Email không hợp lệ');
      return false;
    }

    if (!/^[0-9]{10}$/.test(formData.phone_number)) {
      Alert.alert('Lỗi', 'Số điện thoại không hợp lệ');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const updateData = {
        full_name: formData.full_name,
        email: formData.email,
        phone_number: formData.phone_number,
        job_title: formData.job_title
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      await axios.put(
        `${BASE_URL}/Receptionist/receptionist/${employee.receptionist_id}`,
        updateData, {
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem('token')}`,
          },
        }
      );

      Alert.alert(
        'Thành công',
        'Cập nhật thông tin nhân viên thành công',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Lỗi khi cập nhật nhân viên:', error);
      Alert.alert(
        'Lỗi',
        error.response?.data?.message || 'Không thể cập nhật thông tin nhân viên'
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        {/* Các input như cũ */}
        <View style={styles.inputGroup}>
          <Icon name="account" size={24} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Họ và tên"
            value={formData.full_name}
            onChangeText={(text) => setFormData({ ...formData, full_name: text })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Icon name="email" size={24} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Icon name="phone" size={24} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Số điện thoại"
            keyboardType="phone-pad"
            value={formData.phone_number}
            onChangeText={(text) => setFormData({ ...formData, phone_number: text })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Icon name="lock" size={24} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu mới (để trống nếu không đổi)"
            secureTextEntry
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Icon name="lock-check" size={24} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Xác nhận mật khẩu mới"
            secureTextEntry
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
          />
        </View>

        <View style={styles.pickerContainer}>
          <Icon name="briefcase" size={24} color="#666" style={styles.icon} />
          <Picker
            selectedValue={formData.job_title}
            style={styles.picker}
            onValueChange={(itemValue) =>
              setFormData({ ...formData, job_title: itemValue })
            }
          >
            <Picker.Item label="Lễ tân" value="Lễ tân" />
            <Picker.Item label="Nhân viên bảo trì" value="Nhân viên bảo trì" />
            <Picker.Item label="Nhân viên chăm sóc khách hàng" value="Nhân viên chăm sóc khách hàng" />
          </Picker>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Cập nhật thông tin</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    padding: 16,
    paddingTop: 55,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    paddingLeft: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  picker: {
    flex: 1,
    height: 50,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditEmployeeScreen;
