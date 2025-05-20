import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, StyleSheet, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import axios from 'axios';
import { BASE_URL } from '@env';
console.log("BASE_URL LOGIN :", BASE_URL);






const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true); 
    try {
      const response = await axios.post(`${BASE_URL}/login`, { email, password });
      const { token, role, account_id } = response.data;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('account_id', account_id.toString());

      if (role.toLowerCase() === "admin") {
        navigation.replace('Main');
      } else if (role.toLowerCase() === "customer") {
        navigation.replace('MotorScreen');
      } else {
        Alert.alert("Lỗi", "Tài khoản không hợp lệ.");
      }
    } catch (error) {
      console.log("Lỗi Axios:", error);
      Alert.alert("Lỗi", "Không thể kết nối tới server hoặc sai thông tin đăng nhập.");
    } finally {
      setIsLoading(false); // Kết thúc loading
    }
  };

  const handleTogglePassword = () => setShowPassword(!showPassword);
  const handleForgotPassword = () => {
    Alert.alert('Quên mật khẩu', 'Vui lòng liên hệ bộ phận hỗ trợ để lấy lại mật khẩu.');
  };
  const handleRegister = () => {
    navigation.navigate("RegisterScreen");
  };
  const handleLoginWithGoogle = () => {
    Alert.alert('Google Sign-In', 'Chức năng đăng nhập bằng Google đang được phát triển.');
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={{ marginTop: 8, color: "#333" }}>Đang đăng nhập...</Text>
          </View>
        </View>
      )}

      <Text style={styles.headerText}>Đăng nhập</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
      />

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

      <TouchableOpacity style={styles.forgotPasswordButton} onPress={handleForgotPassword}>
        <Text style={styles.forgotPasswordText}>Quên mật khẩu</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Đăng nhập</Text>
      </TouchableOpacity>

      <View style={styles.registerContainer}>
        <Text style={{ color: '#333' }}>Bạn chưa có tài khoản? </Text>
        <TouchableOpacity onPress={handleRegister}>
          <Text style={styles.registerText}>Đăng ký ngay</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>Hoặc đăng nhập với</Text>
        <View style={styles.dividerLine} />
      </View>

      <TouchableOpacity style={styles.googleButton} onPress={handleLoginWithGoogle}>
        <Image
          source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png' }}
          style={styles.googleIcon}
        />
        <Text style={styles.googleButtonText}>Đăng nhập sử dụng Gmail</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
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
