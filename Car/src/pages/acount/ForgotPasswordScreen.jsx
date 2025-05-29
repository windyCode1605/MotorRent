import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '@env';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
    return re.test(email);
  };

  const handleForgotPassword = async () => {
    setEmailError('');
    
    if (!email) {
      setEmailError('Vui lòng nhập email');
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError('Email không hợp lệ');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/forgot-password`, { email });
      Alert.alert(
        'Thành công',
        'Mã xác nhận đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('ResetPassword', { email })
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
      <Text style={styles.title}>Quên mật khẩu</Text>
      <Text style={styles.description}>
        Nhập email của bạn để nhận mã xác nhận đặt lại mật khẩu
      </Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={[styles.input, emailError ? styles.inputError : null]}
        placeholder="Nhập email của bạn"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleForgotPassword}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Gửi mã xác nhận</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Quay lại đăng nhập</Text>
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

export default ForgotPasswordScreen;
