import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('customer'); // mặc định là customer

  const handleRegister = () => {
    if (username && password && fullname && phone && role) {
      // TODO: Gửi API đăng ký tại đây
      Alert.alert('Thành công', `Bạn đã đăng ký với quyền: ${role}`);
      navigation.replace('Login');
    } else {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng ký</Text>

      <TextInput
        style={styles.input}
        placeholder="Tên đăng nhập*"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu*"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Họ và tên*"
        value={fullname}
        onChangeText={setFullname}
      />
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại*"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <Text style={styles.label}>Chọn quyền:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={role}
          onValueChange={(itemValue) => setRole(itemValue)}
        >
          <Picker.Item label="Khách hàng" value="customer" />
          <Picker.Item label="Nhân viên" value="staff" />
          <Picker.Item label="Quản trị viên" value="admin" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.btnRegister} onPress={handleRegister}>
        <Text style={styles.btnRegisterText}>Đăng ký</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginLink}>Đã có tài khoản? Đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F3EE',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    alignSelf: 'center',
    marginBottom: 32,
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  label: {
    fontWeight: '500',
    marginBottom: 6,
    marginLeft: 4,
    color: '#333',
  },
  btnRegister: {
    backgroundColor: '#0275d8',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  btnRegisterText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginLink: {
    color: '#E67E22',
    textAlign: 'center',
    fontWeight: '500',
  },
});
exports.default.RegisterScreen = RegisterScreen;