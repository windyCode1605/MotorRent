{/**Buoc 3 */}
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const ServiceForm = ({navigation}) => {
  const [services, setServices] = useState([
    {
      id: '1',
      name: 'Thay nhớt',
      quantity: '2222',
      price: '33',
      total: '33',
      note: '33',
    },
    ]);

  const addService = () => {
    const newService = {
      id: Date.now().toString(),
      name: 'Tên dịch vụ',
      quantity: '1',
      price: '1',
      total: '1',
      note: '111',
    };
    setServices([...services, newService]);
  };

  const updateField = (id, field, value) => {
    const updated = services.map(service =>
      service.id === id ? { ...service, [field]: value } : service
    );
    setServices(updated);
  };

  const deleteService = id => {
    const filtered = services.filter(service => service.id !== id);
    setServices(filtered);
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.serviceBox}>
      <View style={styles.serviceHeader}>
        <View style={styles.circleNumber}>
          <Text style={styles.circleText}>{index + 1}</Text>
        </View>
        <Text style={styles.serviceTitle}>{item.name}</Text>
      </View>

      <View style={styles.serviceRow}>
        <View style={styles.serviceRow1}>
          <Text style={styles.serviceLabel}>Lần</Text>
          <Text>{item.quantity}</Text>
        </View>
        <View style={styles.serviceRow1}>
          <Text style={styles.serviceLabel}>Số lượng</Text>
          <Text>{item.quantity}</Text>
        </View>
        <View style={styles.serviceRow1}>
          <Text style={styles.serviceLabel}>Đơn giá</Text>
          <Text>{item.price}</Text>
        </View>
        <View style={styles.serviceRow1}>
          <Text style={styles.serviceLabel}>Thành tiền</Text>
          <Text>{item.total}</Text>
        </View>
        <View style={styles.serviceRow1}>
          <Text style={styles.serviceLabel}>Ghi chú</Text>
          <Text>{item.note}</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditServiceScreen')}>
          <Ionicons name="create-outline" size={18} color="#007AFF" />
          <Text style={styles.actionText}>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteService(item.id)}
        >
          <Ionicons name="trash" size={18} color="#FF3B30" />
          <Text style={[styles.actionText, { color: '#FF3B30' }]}>Xoá</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={28} />
        </TouchableOpacity>
        <Text style={styles.title}>Thêm mới phiếu sửa chữa</Text>
        <Icon name="filter-variant" size={28} />
      </View>
      <FlatList
        data={services}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />

      <TouchableOpacity style={styles.addButton} onPress={addService}>
        <Ionicons name="add-circle-outline" size={20} color="#007AFF" />
        <Text style={styles.addText}>Thêm dịch vụ</Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveText}>Lưu</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitText}>Lưu và gửi duyệt</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ServiceForm;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 15, paddingTop: 30 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  formContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    elevation: 2,
  },
  serviceBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  circleNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  circleText: { fontWeight: 'bold' },
  serviceTitle: { fontSize: 16, fontWeight: 'bold' },
  serviceRow: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  serviceRow1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
    borderBottomWidth: 1,
    borderBlockColor: "#888"
  },
  serviceLabel: {
    flex: 1,
    fontSize: 13,
    color: '#888',
    textAlign: 'left',
  },
  noteLabel: { fontSize: 13, marginTop: 10, marginBottom: 4 },
  noteInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 5,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F0FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginRight: 10,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#007AFF',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 10,
    marginTop: 10,
  },
  addText: { color: '#007AFF', fontWeight: 'bold', marginLeft: 5 },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 20,
    alignItems: 'center',
    marginRight: 10,
  },
  saveText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  submitButton: {
    flex: 1,
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: '#007AFF',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});