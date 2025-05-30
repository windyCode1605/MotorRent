import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
  Modal,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '@env';
import { Picker } from '@react-native-picker/picker';

const status = ["Tất cả", "Chờ xác nhận", "Đã xác nhận", "Đang thuê", "Hoàn thành", "Hủy", "Xe sự cố"];
const paymentStatus = ['paid', 'unpaid', 'refunded'];

const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const AllContract = () => {
  const [contracts, setContracts] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("Tất cả");
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();

  const fetchAllContracts = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/contracts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContracts(response.data.map(contract => ({
        ...contract,
        isDropdownOpen: false
      })));
    } catch (error) {
      console.error('Lỗi khi lấy danh sách hợp đồng:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách hợp đồng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllContracts();
  }, []);

  const handleUpdateContract = async (values) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(
        `${BASE_URL}/contracts/${selectedContract.rental_id}`,
        values,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      Alert.alert('Thành công', 'Cập nhật hợp đồng thành công');
      fetchAllContracts();
      setEditModalVisible(false);
    } catch (error) {
      console.error('Lỗi khi cập nhật hợp đồng:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật hợp đồng');
    }
  };

  const handleDeleteContract = async (rental_id) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa hợp đồng này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              await axios.delete(`${BASE_URL}/contracts/${rental_id}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              Alert.alert('Thành công', 'Xóa hợp đồng thành công');
              fetchAllContracts();
            } catch (error) {
              console.error('Lỗi khi xóa hợp đồng:', error);
              Alert.alert('Lỗi', 'Không thể xóa hợp đồng');
            }
          }
        }
      ]
    );
  };

  const EditContractModal = () => (
    <Modal
      visible={editModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setEditModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Cập nhật hợp đồng</Text>
          
          <View style={styles.inputContainer}>
            <Text>Trạng thái:</Text>
            <Picker
              selectedValue={selectedContract?.status}
              onValueChange={(value) => 
                setSelectedContract({...selectedContract, status: value})
              }
              style={styles.picker}
            >
              {status.filter(s => s !== "Tất cả").map((s, index) => (
                <Picker.Item key={index} label={s} value={s} />
              ))}
            </Picker>
          </View>

          <View style={styles.inputContainer}>
            <Text>Trạng thái thanh toán:</Text>
            <Picker
              selectedValue={selectedContract?.payment_status}
              onValueChange={(value) => 
                setSelectedContract({...selectedContract, payment_status: value})
              }
              style={styles.picker}
            >
              {paymentStatus.map((s, index) => (
                <Picker.Item key={index} label={s} value={s} />
              ))}
            </Picker>
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setEditModalVisible(false)}
            >
              <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.saveButton]}
              onPress={() => handleUpdateContract(selectedContract)}
            >
              <Text style={styles.buttonText}>Lưu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderItem = ({ item }) => (
    <View style={styles.View}>
      <View style={[styles.item, { borderBottomWidth: 0, height: 40 }]}>
        <Text style={{ fontWeight: 'bold' }}>{item.fullName}</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            onPress={() => {
              setSelectedContract(item);
              setEditModalVisible(true);
            }}
            style={styles.editButton}
          >
            <Icon name="pencil" size={20} color="#4CAF50" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => handleDeleteContract(item.rental_id)}
            style={styles.deleteButton}
          >
            <Icon name="delete" size={20} color="#F44336" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={[styles.item, { height: 40 }]}>
        <Text>Ngày Thuê</Text>
        <Text>{new Date(item.start_date).toLocaleDateString('vi-VN')}</Text>
      </View>
      <View style={styles.item}>
        <Text>Số tiền</Text>
        <Text>{formatNumber(item.total_price)}đ</Text>
      </View>
      <View style={styles.item}>
        <Text>Đã trả</Text>
        <Text>{item.payment_status}</Text>
      </View>
      <View style={styles.item}>
        <Text>Trạng thái</Text>
        <Text>{item.status}</Text>
      </View>
    </View>
  );

  // Lọc hợp đồng theo trạng thái và tìm kiếm
  const filteredContracts = contracts
    .filter(contract => 
      selectedStatus === "Tất cả" || contract.status === selectedStatus
    )
    .filter(contract =>
      contract.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
      contract.rental_id.toString().includes(searchText)
    );

 
  const totalAmount = filteredContracts.reduce(
    (sum, contract) => sum + parseFloat(contract.total_price || 0),
    0
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={35} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hợp đồng ngày</Text>
        <Icon name="menu" size={35} />
      </View>

      <ScrollView horizontal={true} style={styles.scroll}>
        {status.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.items, selectedStatus === item ? styles.activeTab : null]}
            onPress={() => setSelectedStatus(item)}
          >
            <Text style={styles.text}>{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.Search}>
        <TextInput
          style={styles.TIP}
          placeholder="Tìm kiếm theo tên, mã hợp đồng"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.ButtonSort}>
          <Icon name="sort-calendar-ascending" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        style={styles.ListView}
        data={filteredContracts}
        keyExtractor={(item) => item.rental_id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <View style={styles.emptyList}>
            <Text>Không có hợp đồng nào</Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Tổng tiền: {formatNumber(totalAmount)}đ
        </Text>
      </View>

      {EditContractModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    width: '100%',
    height: 35,
    marginTop: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scroll: {
    marginVertical: 10,
  },
  items: {
    width: 120,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: 'blue',
  },
  text: {
    color: "#000",
    fontSize: 12,
    fontWeight: "bold",
  },
  Search: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  TIP: { flex: 1, height: 40, fontSize: 16 },
  ButtonSort: {
    marginRight: 15,
    width: 50,
    backgroundColor: '#fff',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ListView: {
    height: '83%',
  },
  View: {
    paddingVertical: 10,
  },
  item: {
    height: 70,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  statusButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 5,
  },
  addButton: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    backgroundColor: 'blue',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    zIndex: 1000,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 25,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: 'blue',
  },
  dropdown: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    zIndex: 1000,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  picker: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginTop: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  saveButton: {
    backgroundColor: '#4caf50',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: 5,
    marginRight: 10,
  },
  deleteButton: {
    padding: 5,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  footerText: {
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default AllContract;