import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const PersonalScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Cá nhân</Text>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Thông tin tài khoản */}
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('AccountInfo')}>
          <Ionicons name="person" size={22} color="#007AFF" style={styles.icon} />
          <Text style={styles.label}>Thông tin tài khoản</Text>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>

        {/* Đổi mật khẩu */}
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('ChangePasswordScreen')}>
          <Ionicons name="key" size={22} color="#007AFF" style={styles.icon} />
          <Text style={styles.label}>Đổi mật khẩu</Text>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>

        {/* Lịch sử thao tác */}
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('LoginHistory')}>
          <Ionicons name="time-outline" size={22} color="#007AFF" style={styles.icon} />
          <Text style={styles.label}>Lịch sử thao tác</Text>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>

        {/* Lịch sử đăng nhập */}
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('LoginHistory')}>
          <MaterialIcons name="login" size={22} color="#007AFF" style={styles.icon} />
          <Text style={styles.label}>Lịch sử đăng nhập</Text>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>

        {/* Gia hạn tài khoản */}
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('ExtendAccount')}>
          <FontAwesome5 name="calendar-alt" size={22} color="#007AFF" style={styles.icon} />
          <Text style={styles.label}>Gia hạn tài khoản</Text>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>

        {/* Cài đặt thông báo */}
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('NotificationSettingsScreen')}>
          <Ionicons name="notifications-outline" size={22} color="#007AFF" style={styles.icon} />
          <Text style={styles.label}>Cài đặt thông báo</Text>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>

        {/* Góp ý & đề xuất */}
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Feedback')}>
          <Ionicons name="chatbubble-ellipses-outline" size={22} color="#007AFF" style={styles.icon} />
          <Text style={styles.label}>Góp ý & đề xuất</Text>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>

        <Text style={styles.version}>Version 2.0.2 (1)</Text>

        <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default PersonalScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  content: {
    paddingHorizontal: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  icon: {
    width: 30,
  },
  label: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  version: {
    textAlign: 'center',
    color: '#aaa',
    marginTop: 20,
  },
  logoutButton: {
    marginTop: 10,
    borderColor: '#007AFF',
    borderWidth: 1.5,
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
