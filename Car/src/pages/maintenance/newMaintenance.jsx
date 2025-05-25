{/**Buoc 2 */ }
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from "@env";


const newMaintenance = ({ navigation }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [errorMessage, setErrorMessage] = useState('');
  const [errorMessage0, setErrorMessage0] = useState('');
  const [staffList, setStaffList] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [motorList, setMotorList] = useState([]);
  const [selectedMotorId, setSelectedMotorId] = useState('');
  const [note, setNote] = useState('');
  const [mechanic, setMechanic] = useState('');


  // Tạo mã bảo trì ngẫu nhiên
  const generateMaintenanceId = (length = 3) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };
  const [maintenanceid, setMaintenanceId] = useState(generateMaintenanceId());


  useEffect(() => {
    fetchVehicles();
    fetchStaff();
  }, [])
  const fetchStaff = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await axios.get(`${BASE_URL}/Receptionist/Receptionist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStaffList(res.data);
    } catch (error) {
      console.log("Lỗi khi lấy danh sách nhân viên : ", error.message);
      console.error("Chi tiết lỗi:", error.res || error);
    }
  };
  const fetchVehicles = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await axios.get(`${BASE_URL}/vehicles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMotorList(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách xe: ", error.message);
    }
  }

  const validateDates = (newStart, newEnd) => {
    if (newStart > newEnd) {
      setErrorMessage('Ngày bắt đầu không được lớn hơn ngày hoàn thành.');
      return false;
    } else {
      setErrorMessage('');
      return true;
    }
  };


  const showDatePicker = (type) => {
    const current = type === 'start' ? startDate : endDate;
    DateTimePickerAndroid.open({
      value: current,
      mode: 'date',
      minimumDate: new Date(),
      onChange: (event, selectedDate) => {
        if (event.type === 'set' && selectedDate) {
          if (type === 'start') {
            setStartDate(selectedDate);
            validateDates(selectedDate, endDate);
          } else {
            setEndDate(selectedDate);
            validateDates(startDate, selectedDate);
          }
        }
      },
    });
  };

  const formatDate = (date) => {
    const pad = (n) => (n < 10 ? '0' + n : n);
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
  };

  const handleNext = async () => {
    if (!validateDates(startDate, endDate)) return;
    if (!selectedMotorId) {
      setErrorMessage('Vui lòng chọn xe.');
      return;
    }

    setErrorMessage('');
    try {
      const formatstartDate = startDate.toISOString().split('T')[0];
      const formatendDate = endDate.toISOString().split('T')[0];  
    

      console.log({
        maintenance_id: maintenanceid,
        car_id: selectedMotorId,
        maintenance_date: formatstartDate,
        next_maintenance_date: formatendDate,
        description: note,
        cost: 0,
        status: 'Chưa duyệt',
        receptionist_id: selectedStaffId
      });

      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/maintenance/create`, {
        maintenance_id: maintenanceid,
        car_id: selectedMotorId,
        maintenance_date: formatstartDate,
        next_maintenance_date: formatendDate,
        description: note,
        cost: 0,
        status: 'Chưa duyệt',
        receptionist_id: selectedStaffId
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Sau khi tạo thành công mới chuyển màn hình
      navigation.navigate('serviceForm', { maintenance_id : maintenanceid });
    } catch (error) {
      console.error("Lỗi khi tạo phiếu bảo trì: ", error.message);
      setErrorMessage0('Đã xảy ra lỗi khi tạo phiếu bảo trì.');
    }
  };


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={28} />
        </TouchableOpacity>
        <Text style={styles.title}>Thêm mới phiếu sửa chữa</Text>
        <Icon name="filter-variant" size={28} />
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Thông tin xe</Text>

        {/* Chọn xe */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Chọn xe <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.inputContainer}>
            <Picker
              selectedValue={selectedMotorId}
              onValueChange={(value) => setSelectedMotorId(value)}
              style={styles.picker}
            >
              <Picker.Item label="Chọn xe" value="" />
              {
                motorList.map((motor) => (
                  <Picker.Item
                    key={motor.car_id}
                    label={`${motor.model} - ${motor.license_plate}`}
                    value={motor.car_id}
                  />
                ))
              }
            </Picker>
          </View>
        </View>

        {/* Ngày bắt đầu */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Ngày bắt đầu <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity onPress={() => showDatePicker('start')}>
            <Text style={styles.input}>{formatDate(startDate)}</Text>
          </TouchableOpacity>
        </View>

        {/* Ngày hoàn thành */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Ngày hoàn thành <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity onPress={() => showDatePicker('end')}>
            <Text style={styles.input}>{formatDate(endDate)}</Text>
          </TouchableOpacity>
        </View>

        {/* Thông báo lỗi */}
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        {/* Nhân viên phụ trách */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nhân viên phụ trách</Text>
          <View style={styles.inputContainer}>
            <Picker
              selectedValue={selectedStaffId}
              onValueChange={(itemValue) => setSelectedStaffId(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Chọn nhân viên" value="" />
              {staffList.map((staff) => (
                <Picker.Item
                  key={staff.receptionist_id}
                  label={staff.full_name}
                  value={staff.receptionist_id}
                />
              ))}
            </Picker>

          </View>
        </View>

        {/* Ghi chú */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Ghi chú</Text>
          <TextInput style={styles.input} placeholder="Nhập ghi chú" onChangeText={setNote} />
        </View>

        {/* Nút hành động */}
        <View style={styles.formButtons}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButtonText}>Hủy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.nextButton,
              (errorMessage || !selectedMotorId) && { backgroundColor: '#ccc' },
            ]}
            onPress={handleNext}
            disabled={!selectedMotorId || !!errorMessage}
          >
            <Text style={styles.nextButtonText}>Tiếp theo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 15, paddingTop: 30 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  formContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    elevation: 2,
  },
  formTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  formGroup: { marginBottom: 15 },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#2f3542',
  },
  required: { color: 'red' },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  picker: {
    height: 40,
    borderBottomWidth: 5,
    ...Platform.select({
      ios: { height: 120 },
      android: { height: 50 },
    }),
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
    marginTop: -10,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#2196f3',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
  },
  cancelButtonText: { color: '#2196f3', fontSize: 16 },
  nextButton: {
    flex: 1,
    backgroundColor: '#2196f3',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
  },
  nextButtonText: { color: '#fff', fontSize: 16 },
});

export default newMaintenance;
