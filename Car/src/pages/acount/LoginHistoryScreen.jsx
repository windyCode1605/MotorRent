import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const mockLoginHistory = [
  { id: 1, date: '2025-05-25 09:15', location: 'TP. Hồ Chí Minh', device: 'iPhone 14' },
  { id: 2, date: '2025-05-23 18:47', location: 'Đà Nẵng', device: 'Laptop Windows' },
  { id: 3, date: '2025-05-20 12:30', location: 'Hà Nội', device: 'Samsung Galaxy S22' },
  // Thêm dữ liệu mô phỏng khác nếu muốn
];

const LoginHistoryScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Lịch sử đăng nhập</Text>

      {mockLoginHistory.map((item) => (
        <View key={item.id} style={styles.historyItem}>
          <Text style={styles.date}>{item.date}</Text>
          <Text style={styles.detail}>Thiết bị: {item.device}</Text>
          <Text style={styles.detail}>Vị trí: {item.location}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default LoginHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  historyItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  detail: {
    fontSize: 14,
    color: '#555',
  },
});
