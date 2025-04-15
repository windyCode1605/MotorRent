import React, { useState } from 'react';
import RegisterScreen from './RegisterScreen';
import HomeScreen from './HomeScreen';
import AsyncStorage from "@react-native-async-storage/async-storage";

import {View,Text,TextInput,TouchableOpacity,Button,StyleSheet,Alert,Image } from 'react-native';
// Thư viện icon: npm install react-native-vector-icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';




const LoginScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  {/**Xử lí API đăng nhập */}
  const handleLogin = async () => {
    try {
      const response = await axios.post("http://192.168.1.15:3000/login", { username, password });

      if (response.data.success) {
        await AsyncStorage.setItem("username",username);
        Alert.alert("Thành công", "Đăng nhập thành công!");
        navigation.navigate('Main');
      } else {
        Alert.alert("Lỗi", response.data.message);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể kết nối tới server!");
    }
  };
  
  













  


  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = () => {
    // Chuyển sang màn hình quên mật khẩu hoặc xử lý tại đây
    Alert.alert('Quên mật khẩu', 'Vui lòng liên hệ bộ phận hỗ trợ để lấy lại mật khẩu.');
  };

  // Chuyển sang màn hình đăng ký
  const handleRegister = () => {
    navigation.navigate("RegisterScreen");
  };
  

  const handleLoginWithGoogle = () => {
    // Tích hợp Google Sign-In hoặc gọi hàm đăng nhập qua Google
    Alert.alert('Google Sign-In', 'Chức năng đăng nhập bằng Google đang được phát triển.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Đăng nhập</Text>
      
      {/* Ô nhập tên đăng nhập */}
      <TextInput
        style={styles.input}
        placeholder="Tên đăng nhập"
        placeholderTextColor="#888"
        value={username}
        onChangeText={setUsername}
      />

      {/* Ô nhập mật khẩu + Icon ẩn/hiện mật khẩu */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
          placeholder="Mật khẩu"
          placeholderTextColor="#888"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.eyeIcon} onPress={handleTogglePassword}>
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={22}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      {/* Nút "Quên mật khẩu" */}
      <TouchableOpacity
        style={styles.forgotPasswordButton}
        onPress={handleForgotPassword}
      >
        <Text style={styles.forgotPasswordText}>Quên mật khẩu</Text>
      </TouchableOpacity>

      {/* Nút Đăng nhập */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Đăng nhập</Text>
      </TouchableOpacity>

      {/* Chuyển sang đăng ký */}
      <View style={styles.registerContainer}>
        <Text style={{ color: '#333' }}>Bạn chưa có tài khoản? </Text>
        <TouchableOpacity onPress={handleRegister}>
          <Text style={styles.registerText}>Đăng ký ngay</Text>
        </TouchableOpacity>
      </View>

      {/* Hoặc đăng nhập với ... */}
      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>Hoặc đăng nhập với</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Nút đăng nhập với Google */}
      <TouchableOpacity style={styles.googleButton} onPress={handleLoginWithGoogle}>
        {/* Thay thế require(...) bằng đường dẫn icon Google của bạn */}
        <Image
          source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png' }}
          style={styles.googleIcon}
        />
        <Text style={styles.googleButtonText}>Đăng nhập sử dụng Gmail</Text>
      </TouchableOpacity>
    </View>
  );
};

// Các thiết lập StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F3EE',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '600',
    alignSelf: 'center',
    marginBottom: 40,
    color: '#333',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 32,
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#0275d8',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  registerText: {
    color: '#E67E22',
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  dividerText: {
    marginHorizontal: 8,
    color: '#999',
  },
  googleButton: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
    resizeMode: 'contain',
  },
  googleButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
});

export default LoginScreen;
