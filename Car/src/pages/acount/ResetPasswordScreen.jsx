import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '@env';

const ResetPasswordScreen = ({ route, navigation }) => {
  const { email } = route.params;
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateOtp = (otp) => {
    return /^\d{6}$/.test(otp);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleResetPassword = async () => {
    // Reset errors
    setOtpError('');
    setPasswordError('');
    let isValid = true;

    if (!validateOtp(otp)) {
      setOtpError('Mã OTP phải có 6 chữ số');
      isValid = false;
    }

    if (!validatePassword(newPassword)) {
      setPasswordError('Mật khẩu phải có ít nhất 6 ký tự');
      isValid = false;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Mật khẩu xác nhận không khớp');
      isValid = false;
    }

    if (!isValid) return;

    setIsLoading(true);
    try {
      // First verify the OTP
      await axios.post(`${BASE_URL}/verify-reset-token`, { email, otp });
      
      // Then reset the password
      await axios.post(`${BASE_URL}/reset-password`, {
        email,
        otp,
        newPassword
      });

      Alert.alert(
        'Thành công',
        'Mật khẩu đã được đặt lại thành công',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
    } catch (error) {
      console.error('Lỗi:', error);
      const errorMessage = error.response?.data?.message || 'Đã có lỗi xảy ra';
      Alert.alert('Lỗi', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đặt lại mật khẩu</Text>
      <Text style={styles.description}>
        Nhập mã OTP đã được gửi đến email của bạn và mật khẩu mới
      </Text>

      <Text style={styles.label}>Mã OTP</Text>
      <TextInput
        style={[styles.input, otpError ? styles.inputError : null]}
        placeholder="Nhập mã OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        maxLength={6}
      />
      {otpError ? <Text style={styles.errorText}>{otpError}</Text> : null}

      <Text style={styles.label}>Mật khẩu mới</Text>
      <TextInput
        style={[styles.input, passwordError ? styles.inputError : null]}
        placeholder="Nhập mật khẩu mới"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />

      <Text style={styles.label}>Xác nhận mật khẩu</Text>
      <TextInput
        style={[styles.input, passwordError ? styles.inputError : null]}
        placeholder="Nhập lại mật khẩu mới"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleResetPassword}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Đặt lại mật khẩu</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Quay lại</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  inputError: {
    borderColor: '#ff0000',
  },
  errorText: {
    color: '#ff0000',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
});

export default ResetPasswordScreen;
