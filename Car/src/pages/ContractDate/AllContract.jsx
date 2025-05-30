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
  Alert,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '@env';
import { Picker } from '@react-native-picker/picker';

const { width } = Dimensions.get('window');

const STATUS_LIST = [
  'Tất cả',
  'Chờ xác nhận',
  'Đã xác nhận',
  'Đã nhận xe',
  'Đã trả xe',
  'Xe tai nạn',
  'Xe sự cố',
  'Từ chối',
];

const PAYMENT_STATUS = ['paid', 'unpaid', 'refunded'];

const formatCurrency = (value) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const getStatusColor = (status) => {
  const statusColors = {
    'Chờ xác nhận': '#FF9800',
    'Đã xác nhận': '#2196F3',
    'Đã nhận xe': '#4CAF50',
    'Đã trả xe': '#8BC34A',
    'Xe tai nạn': '#F44336',
    'Xe sự cố': '#FF5722',
    'Từ chối': '#9E9E9E',
  };
  return statusColors[status] || '#757575';
};

const getPaymentStatusColor = (status) => {
  const colors = {
    'paid': '#4CAF50',
    'unpaid': '#F44336',
    'refunded': '#FF9800',
  };
  return colors[status] || '#757575';
};

const AllContract = () => {
  const [contracts, setContracts] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('Tất cả');
  const [searchText, setSearchText] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/contracts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContracts(
        response.data.map((item) => ({ ...item, isDropdownOpen: false }))
      );
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách hợp đồng');
    }
  };

  const handleUpdateContract = async (updatedContract) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(
        `${BASE_URL}/contracts/${updatedContract.rental_id}`,
        updatedContract,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Thành công', 'Cập nhật hợp đồng thành công');
      fetchContracts();
      setEditModalVisible(false);
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật hợp đồng');
    }
  };

  const confirmDeleteContract = (id) => {
    Alert.alert('Xác nhận xóa', 'Bạn có chắc chắn muốn xóa hợp đồng này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => handleDeleteContract(id),
      },
    ]);
  };

  const handleDeleteContract = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete(`${BASE_URL}/contracts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Thành công', 'Xóa hợp đồng thành công');
      fetchContracts();
    } catch (error) {
      console.error('Delete error:', error);
      Alert.alert('Lỗi', 'Không thể xóa hợp đồng');
    }
  };

  const filteredContracts = contracts
    .filter(
      (c) => selectedStatus === 'Tất cả' || c.status === selectedStatus
    )
    .filter(
      (c) =>
        c.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
        c.rental_id.toString().includes(searchText)
    );

  const totalAmount = filteredContracts.reduce(
    (sum, c) => sum + parseFloat(c.total_price || 0),
    0
  );

  const renderItem = ({ item }) => (
    <View style={styles.contractCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {item.fullName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.customerName}>{item.fullName}</Text>
            <Text style={styles.contractId}>ID: {item.rental_id}</Text>
          </View>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={() => {
              setSelectedContract(item);
              setEditModalVisible(true);
            }}
            style={styles.editButton}
          >
            <Icon name="pencil" size={18} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => confirmDeleteContract(item.rental_id)}
            style={styles.deleteButton}
          >
            <Icon name="delete" size={18} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Icon name="calendar" size={16} color="#666" />
            <Text style={styles.infoLabel}>Ngày thuê</Text>
          </View>
          <Text style={styles.infoValue}>
            {new Date(item.start_date).toLocaleDateString('vi-VN')}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Icon name="cash" size={16} color="#666" />
            <Text style={styles.infoLabel}>Tổng tiền</Text>
          </View>
          <Text style={styles.priceValue}>
            {formatCurrency(item.total_price)}đ
          </Text>
        </View>

        <View style={styles.statusContainer}>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Trạng thái</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
          
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Thanh toán</Text>
            <View style={[styles.paymentBadge, { backgroundColor: getPaymentStatusColor(item.payment_status) }]}>
              <Text style={styles.paymentText}>{item.payment_status}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const EditContractModal = () => (
    <Modal
      visible={editModalVisible}
      animationType="slide"
      transparent
      onRequestClose={() => setEditModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Cập nhật hợp đồng</Text>
            <TouchableOpacity 
              onPress={() => setEditModalVisible(false)}
              style={styles.closeButton}
            >
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Trạng thái hợp đồng</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedContract?.status}
                  onValueChange={(value) =>
                    setSelectedContract({ ...selectedContract, status: value })
                  }
                  style={styles.picker}
                >
                  {STATUS_LIST.filter((s) => s !== 'Tất cả').map((s, i) => (
                    <Picker.Item key={i} label={s} value={s} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Trạng thái thanh toán</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedContract?.payment_status}
                  onValueChange={(value) =>
                    setSelectedContract({
                      ...selectedContract,
                      payment_status: value,
                    })
                  }
                  style={styles.picker}
                >
                  {PAYMENT_STATUS.map((s, i) => (
                    <Picker.Item key={i} label={s} value={s} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setEditModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Hủy bỏ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={() => handleUpdateContract(selectedContract)}
            >
              <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Quản lý hợp đồng</Text>
          <Text style={styles.headerSubtitle}>{filteredContracts.length} hợp đồng</Text>
        </View>
        <TouchableOpacity style={styles.menuButton}>
          <Icon name="dots-vertical" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Status Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          {STATUS_LIST.map((status, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.statusTab, 
                selectedStatus === status && styles.activeTab
              ]}
              onPress={() => setSelectedStatus(status)}
            >
              <Text style={[
                styles.tabText,
                selectedStatus === status && styles.activeTabText
              ]}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="magnify" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm theo tên hoặc mã hợp đồng..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#999"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Icon name="tune" size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Contract List */}
      <FlatList
        data={filteredContracts}
        keyExtractor={(item) => item.rental_id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="file-document-outline" size={64} color="#DDD" />
            <Text style={styles.emptyTitle}>Không có hợp đồng</Text>
            <Text style={styles.emptySubtitle}>Thử thay đổi bộ lọc hoặc tìm kiếm</Text>
          </View>
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Text style={styles.totalLabel}>Tổng doanh thu</Text>
          <Text style={styles.totalAmount}>
            {formatCurrency(totalAmount)}đ
          </Text>
        </View>
        <View style={styles.footerRight}>
          <Text style={styles.contractCount}>
            {filteredContracts.length} hợp đồng
          </Text>
        </View>
      </View>

      {EditContractModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#007AFF',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Tabs Styles
  tabsContainer: {
    backgroundColor: '#FFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  tabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  statusTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#FFF',
  },

  // Search Styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // List Styles
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  
  // Contract Card Styles
  contractCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FAFBFC',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  contractId: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F44336',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardBody: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  priceValue: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statusItem: {
    flex: 1,
    marginHorizontal: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
    alignItems: 'center',
  },
  statusText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '500',
  },
  statusLabel: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  paymentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
    alignItems: 'center',
  },
  paymentText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '500',
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#BBB',
    marginTop: 8,
    textAlign: 'center',
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  footerLeft: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 12,
    color: '#888',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 2,
  },
  footerRight: {
    alignItems: 'flex-end',
  },
  contractCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    width: width * 0.9,
    maxHeight: '80%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  picker: {
    height: 50,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '500',
    fontSize: 16,
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default AllContract;