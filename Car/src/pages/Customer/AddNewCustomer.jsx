import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "@env";
import { CustomerStyles } from './styles/CustomerStyles';

const AddNewCustomer = ({navigation}) => {
  // Khởi tạo state cho các trường thông tin khách hàng
  const [customerData, setCustomerData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    date_of_birth: '',
    gender: 'Male',
    address: '',
    driver_license_number: '',
    driver_license_expiry: '',
    driver_license_class: '',
    driver_license_issued_date: '',
    driver_license_issued_by: '',
    id_card_number: '',
    id_card_issued_date: '',
    id_card_issued_by: '',
    note: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setCustomerData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!customerData.first_name) newErrors.first_name = 'Vui lòng nhập họ';
    if (!customerData.last_name) newErrors.last_name = 'Vui lòng nhập tên';
    if (!customerData.phone_number) newErrors.phone_number = 'Vui lòng nhập số điện thoại';
    if (!customerData.email) newErrors.email = 'Vui lòng nhập email';
    if (!customerData.driver_license_number) newErrors.driver_license_number = 'Vui lòng nhập số GPLX';
    if (!customerData.id_card_number) newErrors.id_card_number = 'Vui lòng nhập số CCCD';
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (customerData.email && !emailRegex.test(customerData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    // Validate phone number format
    const phoneRegex = /^[0-9]{10}$/;
    if (customerData.phone_number && !phoneRegex.test(customerData.phone_number)) {
      newErrors.phone_number = 'Số điện thoại không hợp lệ (10 số)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddNew = async () => {
    if (!validateForm()) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(`${BASE_URL}/customers`, customerData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      Alert.alert(
        "Thành công",
        "Thêm khách hàng mới thành công!",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert(
        "Lỗi",
        error.response?.data?.message || "Không thể thêm khách hàng"
      );
    } finally {
      setLoading(false);
    }
  };

  // Hàm reset các trường về giá trị ban đầu
  const handleReset = () => {
    setCustomerData({
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      date_of_birth: '',
      gender: 'Male',
      address: '',
      driver_license_number: '',            // số giấy phép lái xe
      driver_license_expiry: '',           // giấy phép lái xe hết hạn
      driver_license_class: '',           // bằng lái xe
      driver_license_issued_date: '',    // ngày cấp giấy phép lái xe
      driver_license_issued_by: '',     // giấy phép lái xe do
      id_card_number: '',              // số thẻ căn cước
      id_card_issued_date: '',        // ngày cấp thẻ căn cước
      id_card_issued_by: '',         // thẻ căn cước do
      note: '',
    });
  };

  const renderSection = (title, children) => (
    <View style={CustomerStyles.section}>
      <Text style={CustomerStyles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const renderInput = (placeholder, field, keyboardType = 'default', isRequired = false) => (
    <View style={CustomerStyles.inputContainer}>
      <TextInput
        style={[
          CustomerStyles.input,
          errors[field] && CustomerStyles.inputError
        ]}
        placeholder={placeholder + (isRequired ? ' *' : '')}
        value={customerData[field]}
        onChangeText={text => handleChange(field, text)}
        keyboardType={keyboardType}
      />
      {errors[field] && (
        <Text style={CustomerStyles.errorText}>{errors[field]}</Text>
      )}
    </View>
  );

  return (
    <View style={CustomerStyles.container}>
      <View style={CustomerStyles.header}>        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} />
        </TouchableOpacity>
        <Text style={CustomerStyles.headerTitle}>Thêm khách hàng mới</Text>
        <View style={{inlineSize: 24}} />
      </View>

      <ScrollView style={CustomerStyles.content}>
        {renderSection('Thông tin cơ bản', (
          <>
            {renderInput('Họ', 'first_name', 'default', true)}
            {renderInput('Tên', 'last_name', 'default', true)}
            {renderInput('Email', 'email', 'email-address', true)}
            {renderInput('Số điện thoại', 'phone_number', 'phone-pad', true)}
            {renderInput('Ngày sinh (YYYY-MM-DD)', 'date_of_birth')}
            <View style={CustomerStyles.pickerContainer}>
              <Text style={CustomerStyles.pickerLabel}>Giới tính *</Text>
              <Picker
                selectedValue={customerData.gender}
                style={CustomerStyles.picker}
                onValueChange={(value) => handleChange('gender', value)}
              >
                <Picker.Item label="Nam" value="Male" />
                <Picker.Item label="Nữ" value="Female" />
                <Picker.Item label="Khác" value="Other" />
              </Picker>
            </View>
            {renderInput('Địa chỉ', 'address')}
          </>
        ))}

        {renderSection('Giấy phép lái xe', (
          <>
            {renderInput('Số GPLX', 'driver_license_number', 'default', true)}
            {renderInput('Ngày hết hạn (YYYY-MM-DD)', 'driver_license_expiry')}
            {renderInput('Hạng GPLX', 'driver_license_class')}
            {renderInput('Ngày cấp (YYYY-MM-DD)', 'driver_license_issued_date')}
            {renderInput('Nơi cấp', 'driver_license_issued_by')}
          </>
        ))}

        {renderSection('Căn cước công dân', (
          <>
            {renderInput('Số CCCD', 'id_card_number', 'default', true)}
            {renderInput('Ngày cấp (YYYY-MM-DD)', 'id_card_issued_date')}
            {renderInput('Nơi cấp', 'id_card_issued_by')}
          </>
        ))}

        {renderSection('Thông tin khác', (
          <>
            {renderInput('Ghi chú', 'note')}
          </>
        ))}

        <View style={CustomerStyles.buttonContainer}>
          <TouchableOpacity 
            style={[CustomerStyles.button, CustomerStyles.resetButton]} 
            onPress={handleReset}
          >
            <Icon name="refresh" size={20} color="#FFF" />
            <Text style={CustomerStyles.buttonText}>Làm mới</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[CustomerStyles.button, CustomerStyles.submitButton]} 
            onPress={handleAddNew}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Icon name="check" size={20} color="#FFF" />
                <Text style={CustomerStyles.buttonText}>Thêm mới</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {loading && (
        <View style={CustomerStyles.loadingOverlay}>
          <View style={CustomerStyles.loadingContainer}>
            <ActivityIndicator size="large" color="#00d1b2" />
            <Text style={CustomerStyles.loadingText}>Đang xử lý...</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default AddNewCustomer;
