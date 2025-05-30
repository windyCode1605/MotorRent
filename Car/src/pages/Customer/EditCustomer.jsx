import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  BackHandler
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "@env";
import { CustomerStyles } from './styles/CustomerStyles';

const EditCustomer = ({ navigation, route }) => {
  const { customer } = route.params;  const [customerData, setCustomerData] = useState({
    first_name: customer.first_name || '',
    last_name: customer.last_name || '',
    phone_number: customer.phone_number || '',
    address: customer.address || '',
    balance: customer.balance || 0,
    total_rent: customer.total_rent || 0,
    ...custome
  });
  const [initialData, setInitialData] = useState({...customerData});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    
    const hasChanges = JSON.stringify(customerData) !== JSON.stringify(initialData);
    setHasUnsavedChanges(hasChanges);

 
    const handleBackPress = () => {
      if (hasChanges) {
        Alert.alert(
          "Thay đổi chưa được lưu",
          "Bạn có những thay đổi chưa được lưu. Bạn có chắc chắn muốn thoát?",
          [
            { text: "Hủy", style: "cancel", onPress: () => {} },
            { text: "Thoát", style: "destructive", onPress: () => navigation.goBack() }
          ]
        );
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    
    // Navigation event listener
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (!hasChanges) return;
      
      e.preventDefault();
      Alert.alert(
        "Thay đổi chưa được lưu",
        "Bạn có những thay đổi chưa được lưu. Bạn có chắc chắn muốn thoát?",
        [
          { text: "Hủy", style: "cancel", onPress: () => {} },
          {
            text: "Thoát",
            style: "destructive",
            onPress: () => navigation.dispatch(e.data.action)
          }
        ]
      );
    });

    return () => {
      unsubscribe();
      backHandler.remove();
    };
  }, [customerData, initialData, navigation]);

  const handleChange = (name, value) => {
    setCustomerData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = {
      first_name: 'Họ',
      last_name: 'Tên',
      phone_number: 'Số điện thoại',
      email: 'Email',
      driver_license_number: 'Số GPLX',
      id_card_number: 'Số CCCD'
    };

    // Kiểm tra các trường bắt buộc
    Object.entries(requiredFields).forEach(([field, label]) => {
      if (!customerData[field]?.trim()) {
        newErrors[field] = `Vui lòng nhập ${label}`;
      }
    });

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (customerData.email && !emailRegex.test(customerData.email?.trim())) {
      newErrors.email = 'Email không hợp lệ';
    }

    // Validate phone number format (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (customerData.phone_number && !phoneRegex.test(customerData.phone_number?.trim())) {
      newErrors.phone_number = 'Số điện thoại không hợp lệ (10 số)';
    }

    // Validate CCCD (12 digits)
    const idCardRegex = /^[0-9]{12}$/;
    if (customerData.id_card_number && !idCardRegex.test(customerData.id_card_number?.trim())) {
      newErrors.id_card_number = 'Số CCCD không hợp lệ (12 số)';
    }

    // Validate date formats
    const dateFields = ['date_of_birth', 'driver_license_expiry', 'driver_license_issued_date', 'id_card_issued_date'];
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    
    dateFields.forEach(field => {
      if (customerData[field] && !dateRegex.test(customerData[field]?.trim())) {
        newErrors[field] = 'Ngày không hợp lệ (YYYY-MM-DD)';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm()) {
      Alert.alert('Lỗi', 'Vui lòng kiểm tra và điền đầy đủ thông tin');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');      // Chuẩn bị dữ liệu để gửi đi
      const dataToSend = {
        first_name: customerData.first_name,
        last_name: customerData.last_name,
        phone_number: customerData.phone_number,
        address: customerData.address,
        balance: customerData.balance,
        total_rent: customerData.total_rent
      };

      const response = await axios.put(`${BASE_URL}/customers/${customer.customer_id}`, dataToSend, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      setInitialData(response.data);
      setHasUnsavedChanges(false);
      
      Alert.alert(
        "Thành công",
        "Cập nhật thông tin khách hàng thành công!",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert(
        "Lỗi",
        error.response?.data?.message || "Không thể cập nhật thông tin khách hàng"
      );
    } finally {
      setLoading(false);
    }
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
          errors[field] && CustomerStyles.inputError,
          hasUnsavedChanges && customerData[field] !== initialData[field] && CustomerStyles.inputChanged
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
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={CustomerStyles.container}
    >
      <View style={CustomerStyles.header}>
        <TouchableOpacity 
          onPress={() => {
            if (hasUnsavedChanges) {
              Alert.alert(
                "Thay đổi chưa được lưu",
                "Bạn có những thay đổi chưa được lưu. Bạn có chắc chắn muốn thoát?",
                [
                  { text: "Hủy", style: "cancel" },
                  { text: "Thoát", style: "destructive", onPress: () => navigation.goBack() }
                ]
              );
            } else {
              navigation.goBack();
            }
          }}
        >
          <Icon name="arrow-left" size={24} />
        </TouchableOpacity>
        <Text style={CustomerStyles.headerTitle}>Sửa thông tin khách hàng</Text>
        <View style={{inlineSize: 24}} />
      </View>

      <ScrollView style={CustomerStyles.content}>
        {renderSection('Thông tin cơ bản', (
          <>
            {renderInput('Họ', 'first_name', 'default', true)}
            {renderInput('Tên', 'last_name', 'default', true)}
            {renderInput('Email', 'email', 'email-address', true)}
            {renderInput('Số điện thoại', 'phone_number', 'phone-pad', true)}
            {renderInput('Ngày sinh', 'date_of_birth', 'default', false)}
            <View style={CustomerStyles.pickerContainer}>
              <Text style={CustomerStyles.pickerLabel}>
                Giới tính <Text style={CustomerStyles.requiredStar}>*</Text>
              </Text>
              <View style={CustomerStyles.pickerWrapper}>
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
            </View>
            {renderInput('Địa chỉ', 'address')}
          </>
        ))}

        {renderSection('Giấy phép lái xe', (
          <>
            {renderInput('Số GPLX', 'driver_license_number', 'default', true)}
            {renderInput('Ngày hết hạn', 'driver_license_expiry')}
            {renderInput('Hạng GPLX', 'driver_license_class')}
            {renderInput('Ngày cấp', 'driver_license_issued_date')}
            {renderInput('Nơi cấp', 'driver_license_issued_by')}
          </>
        ))}

        {renderSection('Căn cước công dân', (
          <>
            {renderInput('Số CCCD', 'id_card_number', 'default', true)}
            {renderInput('Ngày cấp', 'id_card_issued_date')}
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
            style={[
              CustomerStyles.button, 
              CustomerStyles.submitButton,
              (!hasUnsavedChanges || loading) && CustomerStyles.buttonDisabled
            ]} 
            onPress={handleUpdate}
            disabled={!hasUnsavedChanges || loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Icon name="check" size={20} color="#FFF" />
                <Text style={CustomerStyles.buttonText}>
                  {hasUnsavedChanges ? "Lưu thay đổi" : "Không có thay đổi"}
                </Text>
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
    </KeyboardAvoidingView>
  );
};

export default EditCustomer;