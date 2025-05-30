import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useUser } from '../../components/hooks/UserContext';
import { BASE_URL } from '../../API/api';

const VehicleManagementScreen = ({ navigation }) => {
  const { user } = useUser();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('view');
  const [formData, setFormData] = useState({
    barcode: '',
    parking_spot: '',
    license_plate: '',
    brand: '',
    model: '',
    year: '',
    color: '',
    fuel_type: '',
    transmission: '',
    mileage: '',
    status: 'available',
    daily_rental_price: '',
    insurance_status: 'valid'
  });

  const isAdmin = useCallback(() => {
    if (!user) return false;
    
    if (Array.isArray(user.roles)) {
      return user.roles.includes('admin');
    }
    
    if (typeof user.roles === 'string') {
      return user.roles === 'admin';
    }
    
    if (user.role) {
      return user.role === 'admin';
    }
    
    if (user.user_type) {
      return user.user_type === 'admin';
    }
    
    return false;
  }, [user]);

  const loadVehicles = useCallback(async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      
      let endpoint = `${BASE_URL}/vehicles/public`;
      
      if (viewMode === 'manage' && isAdmin()) {
        endpoint = `${BASE_URL}/vehicles`;
      }
      
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVehicles(response.data);
      setError(null);
    } catch (error) {
      console.error('Lỗi khi tải danh sách xe:', error);
      setError('Không thể tải danh sách xe');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [viewMode, isAdmin]);

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  const onRefresh = () => {
    setRefreshing(true);
    loadVehicles();
  };

  const checkPermissionAndExecute = async (action) => {
    if (!isAdmin()) {
      setError('Bạn cần quyền admin để thực hiện hành động này');
      return false;
    }
    
    if (action === 'add' || action === 'edit') {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          setError('Ứng dụng cần quyền truy cập thư viện ảnh');
          return false;
        }
      }
    }
    
    if (action === 'add') {
      setEditingVehicle(null);
      resetForm();
      setShowForm(true);
    } else if (action === 'edit') {
      return true;
    }
    return true;
  };

  const pickImage = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      setError('Không thể chọn ảnh');
    }
  }, []);

  const validateForm = () => {
    const requiredFields = ['license_plate', 'brand', 'model', 'daily_rental_price'];
    for (let field of requiredFields) {
      if (!formData[field]) {
        setError(`Vui lòng nhập ${field}`);
        return false;
      }
    }
    return true;
  };

  const handleFormSubmit = useCallback(async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const data = new FormData();
      
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      
      if (image) {
        data.append('image', {
          uri: image,
          type: 'image/jpeg',
          name: 'vehicle_image.jpg',
        });
      }
      
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };
      
      if (editingVehicle) {
        await axios.put(`${BASE_URL}/vehicles/${editingVehicle._id}`, data, config);
      } else {
        await axios.post(`${BASE_URL}/vehicles`, data, config);
      }
      
      setShowForm(false);
      setEditingVehicle(null);
      setImage(null);
      setFormData({
        barcode: '',
        parking_spot: '',
        license_plate: '',
        brand: '',
        model: '',
        year: '',
        color: '',
        fuel_type: '',
        transmission: '',
        mileage: '',
        status: 'available',
        daily_rental_price: '',
        insurance_status: 'valid'
      });
      
      await loadVehicles();
      
    } catch (error) {
      setError(error.response?.data?.message || 'Lỗi khi lưu thông tin xe');
    } finally {
      setLoading(false);
    }
  }, [formData, image, editingVehicle, loadVehicles]);

  const handleEdit = useCallback((vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      barcode: vehicle.barcode || '',
      parking_spot: vehicle.parking_spot || '',
      license_plate: vehicle.license_plate || '',
      brand: vehicle.brand || '',
      model: vehicle.model || '',
      year: vehicle.year?.toString() || '',
      color: vehicle.color || '',
      fuel_type: vehicle.fuel_type || '',
      transmission: vehicle.transmission || '',
      mileage: vehicle.mileage?.toString() || '',
      status: vehicle.status || 'available',
      daily_rental_price: vehicle.daily_rental_price?.toString() || '',
      insurance_status: vehicle.insurance_status || 'valid'
    });
    setShowForm(true);
  }, []);

  const handleCancel = useCallback(() => {
    setShowForm(false);
    setEditingVehicle(null);
    setImage(null);
    setFormData({
      barcode: '',
      parking_spot: '',
      license_plate: '',
      brand: '',
      model: '',
      year: '',
      color: '',
      fuel_type: '',
      transmission: '',
      mileage: '',
      status: 'available',
      daily_rental_price: '',
      insurance_status: 'valid'
    });
  }, []);

  const handleDelete = useCallback(async (id) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      await axios.delete(`${BASE_URL}/vehicles/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await loadVehicles();
    } catch (error) {
      setError(error.response?.data?.message || 'Lỗi khi xóa xe');
    } finally {
      setLoading(false);
    }
  }, [loadVehicles]);

  // Header với nút chuyển đổi chế độ
  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Danh sách xe</Text>
      {isAdmin() && (
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[styles.modeButton, viewMode === 'view' && styles.activeModeButton]}
            onPress={() => setViewMode('view')}
          >
            <Text style={[styles.modeButtonText, viewMode === 'view' && styles.activeModeButtonText]}>
              Xem
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, viewMode === 'manage' && styles.activeModeButton]}
            onPress={() => setViewMode('manage')}
          >
            <Text style={[styles.modeButtonText, viewMode === 'manage' && styles.activeModeButtonText]}>
              Quản lý
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderVehicleItem = useCallback(({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.imageContainer}>
        <Image
          source={item.image ? { uri: item.image } : require('../../assets/car2.jpg')}
          style={styles.vehicleImage}
          resizeMode="cover"
        />
        {isAdmin() && viewMode === 'manage' && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEdit(item)}
          >
            <Icon name="edit" size={24} color="#007AFF" />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Biển số:</Text>
          <Text style={styles.value}>{item.license_plate}</Text>
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Hãng xe:</Text>
          <Text style={styles.value}>{item.brand}</Text>
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Model:</Text>
          <Text style={styles.value}>{item.model}</Text>
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Năm:</Text>
          <Text style={styles.value}>{item.year}</Text>
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Giá thuê/ngày:</Text>
          <Text style={styles.value}>{item.daily_rental_price}đ</Text>
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Trạng thái:</Text>
          <Text style={styles.value}>{item.status}</Text>
        </Text>
      </View>

      {isAdmin() && viewMode === 'manage' && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#FF3B30', marginBlockStart: 10 }]}
          onPress={() => handleDelete(item._id)}
        >
          <Text style={styles.buttonText}>Xóa</Text>
        </TouchableOpacity>
      )}
    </View>
  ), [isAdmin, viewMode, handleEdit, handleDelete]);

  // Render content dựa trên trạng thái
  const renderContent = () => {
    if (loading && !refreshing) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
          <Text style={styles.message}>Đang tải...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setError(null);
              loadVehicles();
            }}
          >
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (showForm && viewMode === 'manage') {
      return (
        <ScrollView style={styles.form}>
          <Text style={styles.formTitle}>
            {editingVehicle ? 'Cập nhật xe' : 'Thêm xe mới'}
          </Text>

          <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.previewImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Icon name="camera" size={40} color="#666" />
                <Text>Chọn ảnh</Text>
              </View>
            )}
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Mã barcode"
            value={formData.barcode}
            onChangeText={(text) => setFormData({ ...formData, barcode: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Vị trí đỗ"
            value={formData.parking_spot}
            onChangeText={(text) => setFormData({ ...formData, parking_spot: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Biển số xe *"
            value={formData.license_plate}
            onChangeText={(text) => setFormData({ ...formData, license_plate: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Hãng xe *"
            value={formData.brand}
            onChangeText={(text) => setFormData({ ...formData, brand: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Model *"
            value={formData.model}
            onChangeText={(text) => setFormData({ ...formData, model: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Năm sản xuất"
            value={formData.year}
            onChangeText={(text) => setFormData({ ...formData, year: text })}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Màu sắc"
            value={formData.color}
            onChangeText={(text) => setFormData({ ...formData, color: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Loại nhiên liệu"
            value={formData.fuel_type}
            onChangeText={(text) => setFormData({ ...formData, fuel_type: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Hộp số"
            value={formData.transmission}
            onChangeText={(text) => setFormData({ ...formData, transmission: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Số km đã đi"
            value={formData.mileage}
            onChangeText={(text) => setFormData({ ...formData, mileage: text })}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Giá thuê/ngày *"
            value={formData.daily_rental_price}
            onChangeText={(text) => setFormData({ ...formData, daily_rental_price: text })}
            keyboardType="numeric"
          />

          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Trạng thái:</Text>
            <Picker
              selectedValue={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
              style={styles.picker}
            >
              <Picker.Item label="Có sẵn" value="available" />
              <Picker.Item label="Đang cho thuê" value="rented" />
              <Picker.Item label="Bảo trì" value="maintenance" />
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Bảo hiểm:</Text>
            <Picker
              selectedValue={formData.insurance_status}
              onValueChange={(value) => setFormData({ ...formData, insurance_status: value })}
              style={styles.picker}
            >
              <Picker.Item label="Bảo hiểm hợp lệ" value="valid" />
              <Picker.Item label="Bảo hiểm hết hạn" value="expired" />
            </Picker>
          </View>

          <View style={styles.formButtons}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleFormSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {editingVehicle ? 'Cập nhật' : 'Thêm mới'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setShowForm(false);
                setEditingVehicle(null);
                resetForm();
              }}
            >
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      );
    }

    return (
      <ScrollView 
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {viewMode === 'manage' && isAdmin() && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => checkPermissionAndExecute('add')}
          >
            <Icon name="plus" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Thêm xe mới</Text>
          </TouchableOpacity>
        )}

        {vehicles.length === 0 ? (
          <Text style={styles.emptyText}>Chưa có xe nào</Text>
        ) : (
          vehicles.map((vehicle) => (
            <View key={vehicle.car_id} style={styles.vehicleCard}>
              {vehicle.image_url && (
                <Image
                  source={{ uri: vehicle.image_url }}
                  style={styles.vehicleImage}
                  resizeMode="cover"
                />
              )}
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleTitle}>{vehicle.brand} {vehicle.model}</Text>
                {viewMode === 'manage' && vehicle.license_plate && (
                  <Text style={styles.vehicleDetail}>Biển số: {vehicle.license_plate}</Text>
                )}
                <Text style={styles.vehicleDetail}>
                  Giá thuê: {vehicle.daily_rental_price?.toLocaleString()}đ/ngày
                </Text>
                <Text style={[
                  styles.vehicleDetail,
                  { color: vehicle.status === 'available' ? 'green' : 'orange' }
                ]}>
                  Trạng thái: {vehicle.status}
                </Text>
              </View>
              
              {viewMode === 'manage' && isAdmin() && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEdit(vehicle)}
                  >
                    <Icon name="pencil" size={20} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(vehicle.car_id)}
                  >
                    <Icon name="delete" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderContent()}

      <Modal
        visible={showForm}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              <TouchableOpacity onPress={pickImage}>
                <View style={styles.imageContainer}>
                  {image ? (
                    <Image source={{ uri: image }} style={styles.vehicleImage} />
                  ) : (
                    <View style={[styles.vehicleImage, { backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center' }]}>
                      <Icon name="camera" size={40} color="#666" />
                      <Text>Chọn ảnh</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>

              {Object.keys(formData).map(key => (
                <TextInput
                  key={key}
                  style={styles.input}
                  placeholder={key.replace(/_/g, ' ').toUpperCase()}
                  value={formData[key]}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, [key]: text }))}
                  keyboardType={['year', 'mileage', 'daily_rental_price'].includes(key) ? 'numeric' : 'default'}
                />
              ))}

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleCancel}
                >
                  <Text style={styles.buttonText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.submitButton]}
                  onPress={handleFormSubmit}
                >
                  <Text style={styles.buttonText}>{editingVehicle ? 'Cập nhật' : 'Thêm'}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },
  itemContainer: {
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      inlineSize: 0,
      blockSize: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBlockEnd: 15,
  },
  imageContainer: {
    position: 'relative',
  },
  vehicleImage: {
    inlineSize: '100%',
    blockSize: 200,
    borderRadius: 8,
    marginBlockEnd: 15,
  },
  editButton: {
    position: 'absolute',
    insetInlineEnd: 10,
    insetBlockStart: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 8,
    borderRadius: 20,
  },
  infoContainer: {
    marginBlockStart: 10,
  },
  infoText: {
    fontSize: 16,
    marginBlockEnd: 5,
  },
  label: {
    fontWeight: 'bold',
    marginInlineEnd: 10,
  },
  value: {
    flex: 1,
  },
  addButton: {
    position: 'absolute',
    insetInlineEnd: 20,
    insetBlockEnd: 20,
    inlineSize: 60,
    blockSize: 60,
    backgroundColor: '#007AFF',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 32,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    inlineSize: '90%',
    maxInlineSize: 400,
  },
  input: {
    borderInlineSize: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBlockEnd: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBlockStart: 15,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    marginInlineEnd: 5,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  errorText: {
    color: '#FF3B30',
    marginBlockStart: 5,
    textAlign: 'center',
  },
});

export default VehicleManagementScreen;