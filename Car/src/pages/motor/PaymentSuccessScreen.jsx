import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PaymentSuccessScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'MotorScreen' }],
      });
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Thanh toán thành công!</Text>
      <ActivityIndicator size="large" color="#00C853" style={{ marginTop: 20 }} />
      <Text style={styles.subText}>Bạn sẽ được chuyển về trang chính...</Text>
    </View>
  );
};

export default PaymentSuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10
  },
  subText: {
    fontSize: 16,
    color: '#4CAF50',
    marginTop: 10
  }
});
