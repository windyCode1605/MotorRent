import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AddNewCustomer = ( {navigation} ) => {
  // Khởi tạo state cho các trường thông tin khách hàng
  const [customerData, setCustomerData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    date_of_birth: '',
    gender: '',
    address: '',
    driver_license_number: '',
    driver_license_expiry: '',
    driver_license_class: '',
    driver_license_issued_date: '',
    driver_license_issued_by: '',
    id_card_number: '',
    id_card_issued_date: '',
    id_card_issued_by: '',
    note: '',
  });
  const [loading, setLoading] = useState(false);


  // Hàm xử lý thay đổi giá trị của từng trường
  const handleChange = (name, value) => {
    setCustomerData(prev => ({ ...prev, [name]: value }));
  };

  // Hàm xử lý khi nhấn "Thêm mới"
  const handleAddNew = async () => {
    setLoading(true); 
    try {
      const response = await fetch('http://192.168.1.13:3000/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: customerData.first_name,
          last_name: customerData.last_name,
          email: customerData.email,
          phone_number: customerData.phone_number,
          gender: customerData.gender,
          date_of_birth: customerData.date_of_birth,
          address: customerData.address,
          note: customerData.note,
  
          driver_license_number: customerData.driver_license_number,
          driver_license_class: customerData.driver_license_class,
          driver_license_expiry: customerData.driver_license_expiry,
          driver_license_issued_date: customerData.driver_license_issued_date,
          driver_license_issued_by: customerData.driver_license_issued_by,
  
          id_card_number: customerData.id_card_number,
          id_card_issued_date: customerData.id_card_issued_date,
          id_card_issued_by: customerData.id_card_issued_by,
        }),
      });
  
      if (response.ok) {
        Alert.alert("Khách hàng mới được tạo thành công 🫅");
        handleReset();
      } else {
        const error = await response.json();
        console.error("Lỗi từ server:", error);
        Alert.alert("Tạo khách hàng thất bại! 🤦‍♂️");
      }
    } 
    catch (error) {
      console.error("Lỗi mạng hoặc server:", error);
      Alert.alert("Không thể kết nối server! 🤯");
    }
    finally {
      setLoading(false);
    }
  };  
  const LoadingScreen = () => (
    <View style={styles.loadingOverlay}>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00d1b2" />
        <Text style={styles.loadingText}>Đang xử lý...</Text>
      </View>
    </View>
  );

  // Hàm reset các trường về giá trị ban đầu
  const handleReset = () => {
    setCustomerData({
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      date_of_birth: '',
      gender: '',
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

  return (
    <View style={styles.container}>
      {loading && <LoadingScreen/>}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("ListCus")}><Icon name='arrow-left' size={24}/></TouchableOpacity>
        <Text style={styles.Texthead}>Thêm khách hàng mới</Text>
        <Icon name='menu' size={24} color={'blue'} />
      </View>
      <ScrollView>
        <TextInput 
          placeholder="Họ" 
          style={styles.TextInput}
          value={customerData.last_name}
          onChangeText={text => handleChange('last_name', text)}
        />
        <TextInput 
          placeholder="Tên" 
          style={styles.TextInput}
          value={customerData.first_name}
          onChangeText={text => handleChange('first_name', text)}
        />

        <TextInput 
          placeholder="Số điện thoại*" 
          style={styles.TextInput}
          value={customerData.phone_number}
          onChangeText={text => handleChange('phone_number', text)}
        />
        <TextInput 
          placeholder="Email*" 
          style={styles.TextInput}
          value={customerData.email}
          onChangeText={text => handleChange('email', text)}
        />
        <View style={styles.DateInput}>
          <TextInput 
            placeholder="Ngày sinh" 
            style={[styles.TextInput, { width: 240, marginHorizontal: 0 }]}
            value={customerData.date_of_birth}
            onChangeText={text => handleChange('date_of_birth', text)}
          />
          <Icon name='menu' size={24} style={{ marginRight: 20 }} />
        </View>
        <View style={styles.DateInput}>
          <TextInput 
            placeholder="Giới tính" 
            style={[styles.TextInput, { width: 240, marginHorizontal: 0 }]}
            value={customerData.gender}
            onChangeText={text => handleChange('gender', text)}
          />
          <Icon name='menu' size={24} style={{ marginRight: 20 }} />
        </View>
        <TextInput 
          placeholder="Địa chỉ đang ở" 
          style={styles.TextInput}
          value={customerData.address}
          onChangeText={text => handleChange('address', text)}
        />
        
        <TextInput 
          placeholder="Ghi chú" 
          style={styles.TextInput}
          value={customerData.note}
          onChangeText={text => handleChange('note', text)}
        />
        <Text style={{ marginLeft: 20, fontSize: 15, fontWeight: '700' }}>Thông tin nâng cao</Text>
        <TextInput 
          placeholder="Căn cước công dân/ Hộ chiếu" 
          style={styles.TextInput}
          value={customerData.id_card_number}
          onChangeText={text => handleChange('id_card_number', text)}
        />
        <View style={styles.FormTextInput1}>
          <TextInput 
            placeholder="Ngày cấp*" 
            style={styles.TextInput1}
            value={customerData.id_card_issued_date}
            onChangeText={text => handleChange('id_card_issued_date', text)}
          />
          <TextInput 
            placeholder="Nơi cấp *" 
            style={styles.TextInput1}
            value={customerData.id_card_issued_by}
            onChangeText={text => handleChange('id_card_issued_by', text)}
          />
        </View>
        <TextInput 
          placeholder="Bằng lái xe " 
          style={styles.TextInput}
          value={customerData.driver_license_number}
          onChangeText={text => handleChange('driver_license_number', text)}
        />
        <View style={styles.FormTextInput1}>
          <TextInput 
            placeholder="Ngày cấp" 
            style={styles.TextInput1}
            value={customerData.driver_license_issued_date}
            onChangeText={text => handleChange('driver_license_issued_date', text)}
          />
          <TextInput 
            placeholder="Nơi cấp" 
            style={styles.TextInput1}
            value={customerData.driver_license_issued_by}
            onChangeText={text => handleChange('driver_license_issued_by', text)}
          />
        </View>
        <View style={styles.FormTextInput1}>
          <TextInput 
            placeholder="Hạng" 
            style={styles.TextInput1}
            value={customerData.driver_license_class}
            onChangeText={text => handleChange('driver_license_class', text)}
          />
          <TextInput 
            placeholder="giấy phép lái xe hết hạn" 
            style={styles.TextInput1}
            value={customerData.driver_license_expiry}
            onChangeText={text => handleChange('driver_license_expiry', text)}
          />
        </View>
        {/* Nút Thêm mới và Làm lại */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleAddNew}>
            <Text style={styles.buttonText}>Thêm mới</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={handleReset}>
            <Text style={styles.buttonText}>Làm lại</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F8' },
  header: { marginTop: 20, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  Texthead: { fontSize: 20, fontWeight: '500' },
  TextInput: { backgroundColor: '#FFF', marginHorizontal: 30, marginVertical: 10, height: 60, borderRadius: 10, paddingHorizontal: 10 },
  DateInput: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', marginHorizontal: 30, marginVertical: 10, height: 60, borderRadius: 10 },
  TextInput1: { width: 130, backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 10 },
  FormTextInput1: { marginHorizontal: 30, marginVertical: 10, height: 60, flexDirection: 'row', justifyContent: 'space-between' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 },
  button: { backgroundColor: '#007BFF', paddingVertical: 15, paddingHorizontal: 20, borderRadius: 10, minWidth: 120, alignItems: 'center' },
  resetButton: { backgroundColor: '#6c757d' },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },

  loadingOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingContainer: {
    backgroundColor: '#004e64',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 12,
    fontSize: 16,
  },
});

export default AddNewCustomer;
