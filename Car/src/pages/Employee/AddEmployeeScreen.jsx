import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@env';

const AddEmployeeScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    password: '',
    confirmPassword: '',
    job_title: 'Lễ tân' 
  });

  const validateForm = () => {
    if (!formData.full_name || !formData.email || !formData.phone_number || 
        !formData.password || !formData.confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
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
      await axios.post(`${BASE_URL}/Receptionist/receptionist`, {
        full_name: formData.full_name,
        email: formData.email,
        phone_number: formData.phone_number,
        password: formData.password,
        job_title: formData.job_title
      }, {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem('token')}`
        }
      });

      Alert.alert(
        'Thành công',
        'Thêm nhân viên mới thành công',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Lỗi khi thêm nhân viên:', error);
      Alert.alert(
        'Lỗi',
        error.response?.data?.message || 'Không thể thêm nhân viên'
      );
    }
  };

  const renderInput = (icon, placeholder, value, onChangeText, options = {}) => (
    <View style={styles.inputGroup}>
      <Icon name={icon} size={20} color="#888" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        value={value}
        onChangeText={onChangeText}
        {...options}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      
      <ScrollView contentContainerStyle={styles.formContainer}>
        {renderInput("account", "Họ và tên", formData.full_name, text => setFormData({ ...formData, full_name: text }))}
        {renderInput("email", "Email", formData.email, text => setFormData({ ...formData, email: text }), { keyboardType: 'email-address', autoCapitalize: 'none' })}
        {renderInput("phone", "Số điện thoại", formData.phone_number, text => setFormData({ ...formData, phone_number: text }), { keyboardType: 'phone-pad' })}
        {renderInput("lock", "Mật khẩu", formData.password, text => setFormData({ ...formData, password: text }), { secureTextEntry: true })}
        {renderInput("lock-check", "Xác nhận mật khẩu", formData.confirmPassword, text => setFormData({ ...formData, confirmPassword: text }), { secureTextEntry: true })}

        <View style={styles.pickerWrapper}>
          <Icon name="briefcase" size={20} color="#888" style={styles.icon} />
          <Picker
            selectedValue={formData.job_title}
            style={styles.picker}
            dropdownIconColor="#666"
            onValueChange={(value) => setFormData({ ...formData, job_title: value })}
          >
            <Picker.Item label="Lễ tân" value="Lễ tân ca sáng" />
            <Picker.Item label="Nhân viên bảo trì" value="Nhân viên bảo trì" />
            <Picker.Item label="Nhân viên chăm sóc khách hàng" value="Nhân viên chăm sóc khách hàng" />
          </Picker>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Thêm nhân viên</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  formContainer: {
    padding: 20,
    paddingTop: 65,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 0 : 4,
    marginBottom: 14,
    elevation: 2,
  },
  picker: {
    flex: 1,
    height: 50,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddEmployeeScreen;
