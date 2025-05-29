import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Alert, ActivityIndicator, RefreshControl, SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ListEmployeeScreen = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchEmployees = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/Receptionist/receptionist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách nhân viên:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách nhân viên');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchEmployees();
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa nhân viên này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`${BASE_URL}/Receptionist/receptionist/${id}`, {
                headers: {
                  Authorization: `Bearer ${await AsyncStorage.getItem('token')}`,
                },
              });
              Alert.alert('Thành công', 'Đã xóa nhân viên');
              fetchEmployees();
            } catch (error) {
              console.error('Lỗi khi xóa nhân viên:', error);
              Alert.alert('Lỗi', 'Không thể xóa nhân viên');
            }
          },
        },
      ],
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <Icon name="account-circle" size={50} color="#2196F3" />
      </View>
      <View style={styles.cardRight}>
        <View style={styles.cardTop}>
          <Text style={styles.name}>{item.full_name}</Text>
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={() => navigation.navigate('EditEmployee', { employee: item })}
              style={[styles.iconBtn, { backgroundColor: '#4CAF50' }]}
            >
              <Icon name="pencil" size={18} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDelete(item.receptionist_id)}
              style={[styles.iconBtn, { backgroundColor: '#F44336' }]}
            >
              <Icon name="delete" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.infoText}><Icon name="email" size={14} /> {item.email}</Text>
        <Text style={styles.infoText}><Icon name="phone" size={14} /> {item.phone_number}</Text>
        <Text style={styles.infoText}><Icon name="clock-outline" size={14} /> Ca: {item.shift}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
        </View>
      ) : (
        <>
          <FlatList
            data={employees}
            renderItem={renderItem}
            keyExtractor={(item) => item.receptionist_id.toString()}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
            contentContainerStyle={styles.list}
          />
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={() => navigation.navigate('AddEmployee')}
          >
            <Icon name="plus" size={28} color="#fff" />
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f3f6',
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardLeft: {
    marginRight: 12,
    justifyContent: 'center',
  },
  cardRight: {
    flex: 1,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flexShrink: 1,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  actions: {
    flexDirection: 'row',
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#2196F3',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default ListEmployeeScreen;
