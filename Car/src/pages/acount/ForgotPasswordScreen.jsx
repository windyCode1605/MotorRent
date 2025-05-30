import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { BASE_URL } from '@env';

const ForgotPasswordScreen = ({ navigation }) => {
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
    return re.test(email);
  };

  const handleSendOTP = async () => {
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
      await axios.post(`${BASE_URL}/forgot-password`, { email });
      Alert.alert(
        'Thành công',
        'Mã OTP đã được gửi đến email của bạn',
        [{ text: 'OK', onPress: () => setStep(2) }]
      );
    } catch (error) {
      console.error('Lỗi gửi OTP:', error);
      Alert.alert(
        'Lỗi',
        error.response?.data?.message || 'Không thể gửi mã OTP'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setOtpError('');
    
    if (!otp) {
      setOtpError('Vui lòng nhập mã OTP');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(`${BASE_URL}/verify-reset-token`, { email, otp });
      setStep(3);
    } catch (error) {
      console.error('Lỗi xác thực OTP:', error);
      setOtpError(error.response?.data?.message || 'Mã OTP không hợp lệ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setPasswordError('');

    if (!newPassword || !confirmPassword) {
      setPasswordError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(`${BASE_URL}/reset-password`, {
        email,
        otp,
        newPassword
      });
      
      Alert.alert(
        'Thành công',
        'Mật khẩu đã được đặt lại thành công',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      console.error('Lỗi đặt lại mật khẩu:', error);
      setPasswordError(
        error.response?.data?.message || 'Không thể đặt lại mật khẩu'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmailStep = () => (
    <View style={styles.formGroup}>
      <Text style={styles.label}>Email</Text>
      <View style={styles.inputContainer}>
        <Icon name="email" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Nhập email của bạn"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      <TouchableOpacity
        style={styles.button}
        onPress={handleSendOTP}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Gửi mã OTP</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderOTPStep = () => (
    <View style={styles.formGroup}>
      <Text style={styles.label}>Nhập mã OTP</Text>
      <View style={styles.inputContainer}>
        <Icon name="numeric" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Nhập mã OTP"
          keyboardType="numeric"
          value={otp}
          onChangeText={setOtp}
          maxLength={6}
        />
      </View>
      {otpError ? <Text style={styles.errorText}>{otpError}</Text> : null}
      <TouchableOpacity
        style={styles.button}
        onPress={handleVerifyOTP}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Xác nhận</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.resendButton}
        onPress={handleSendOTP}
        disabled={isLoading}
      >
        <Text style={styles.resendButtonText}>Gửi lại mã</Text>
      </TouchableOpacity>
    </View>
  );

  const renderNewPasswordStep = () => (
    <View style={styles.formGroup}>
      <Text style={styles.label}>Mật khẩu mới</Text>
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Nhập mật khẩu mới"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
      </View>
      <Text style={styles.label}>Xác nhận mật khẩu</Text>
      <View style={styles.inputContainer}>
        <Icon name="lock-check" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Nhập lại mật khẩu mới"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>
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
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          
          <View style={styles.header}>
            <Icon name="lock-reset" size={80} color="#2196F3" />
            <Text style={styles.title}>Quên mật khẩu</Text>
            <Text style={styles.subtitle}>
              {step === 1 && 'Vui lòng nhập email của bạn để lấy lại mật khẩu'}
              {step === 2 && 'Nhập mã OTP đã được gửi đến email của bạn'}
              {step === 3 && 'Tạo mật khẩu mới cho tài khoản của bạn'}
            </Text>
          </View>

          <View style={styles.progressBar}>
            {[1, 2, 3].map((s) => (
              <View
                key={s}
                style={[
                  styles.progressStep,
                  s <= step ? styles.progressStepActive : null,
                ]}
              />
            ))}
          </View>

          {step === 1 && renderEmailStep()}
          {step === 2 && renderOTPStep()}
          {step === 3 && renderNewPasswordStep()}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginVertical: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 10,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#f44336',
    fontSize: 14,
    marginTop: 4,
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  progressStep: {
    width: 60,
    height: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
    borderRadius: 2,
  },
  progressStepActive: {
    backgroundColor: '#2196F3',
  },
  resendButton: {
    alignItems: 'center',
    marginTop: 15,
  },
  resendButtonText: {
    color: '#2196F3',
    fontSize: 14,
  },
});

export default ForgotPasswordScreen;
