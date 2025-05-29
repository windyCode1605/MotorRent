import React, { useState, useEffect } from "react";
import { View, Text, FlatList, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "@env";
console.log("BASE URL AllContract:", BASE_URL);

const status = ["Tất cả", "Chờ xác nhận", "Đã xác nhận", "Đang thuê", "Hoàn thành", "Hủy", "Xe sự cố"];

const handleRegister = (navigation, item) => {
  navigation.navigate("RegisterScreen", { contract: item });
};

const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};





const AllContract = () => {
  const [contracts, setContracts] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("Tất cả");
  const navigation = useNavigation();

  const fetchAllContracts = async () => {
    const Token = await AsyncStorage.getItem('token');
    try {
      const res = await axios.get(`${BASE_URL}/contracts/getAll`, {
        headers: { Authorization: `Bearer ${Token}` },
      });
      // Thêm isDropdownOpen vào mỗi contract
      const contractsWithDropdown = res.data.map((contract) => ({
        ...contract,
        isDropdownOpen: false,
      }));
      setContracts(contractsWithDropdown);
    } catch (error) {
      console.log("Lỗi khi lấy danh sách hợp đồng:", error.message);
    }
  };

  useEffect(() => {
    fetchAllContracts();
  }, []);

  // Lọc hợp đồng theo trạng thái
  const filteredContracts = selectedStatus === "Tất cả"
    ? contracts
    : contracts.filter((contract) => contract.status === selectedStatus);

  // Tính tổng tiền
  const totalAmount = filteredContracts.reduce((sum, contract) =>sum +  parseFloat((contract.total_price || 0)), 0);

  // Toggle dropdown cho contract cụ thể
  const toggleStatusDropdown = (retal_id) => {
    setContracts((prevContracts) =>
      prevContracts.map((contract) =>
        contract.retal_id === retal_id
          ? { ...contract, isDropdownOpen: !contract.isDropdownOpen }
          : { ...contract, isDropdownOpen: false } 
      )
    );
  };


  const handleStatusSelect = async (retal_id, newStatus) => {
    const Token = await AsyncStorage.getItem('token');
    try {
      await axios.patch(
        `${BASE_URL}/contracts/update/${retal_id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${Token}` } }
      );
      setContracts((prevContracts) =>
        prevContracts.map((contract) =>
          contract.retal_id === retal_id
            ? { ...contract, status: newStatus, isDropdownOpen: false }
            : contract
        )
      );
    } catch (error) {
      console.log("Lỗi khi cập nhật trạng thái:", error.message);
    }
  };

  const handleTabSelect = (status) => {
    setSelectedStatus(status);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Icon name='arrow-left' size={35} /></TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Hợp đồng ngày</Text>
        <Icon name="menu" size={35} />
      </View>
      {/* Filter Tabs */}
      <ScrollView horizontal={true} style={styles.scroll}>
        {status.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.items, selectedStatus === item ? styles.activeTab : null]}
            onPress={() => handleTabSelect(item)}
          >
            <Text style={styles.text}>{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.Search}>
        <TextInput
          style={styles.TIP}
          placeholder="Tìm kiếm theo tên, SDT"
          right={<TextInput.Icon name="microphone" size={24} />}
        />
        <TouchableOpacity style={styles.ButtonSort}>
          <Icon name='sort-calendar-ascending' size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        style={styles.ListView}
        data={filteredContracts}
        keyExtractor={(item) => item.retal_id}
        renderItem={({ item }) => (
          <View style={styles.View}>
            <View style={[styles.item, { borderBottomWidth: 0, height: 40 }]}>
              <Text style={{ fontWeight: 'bold' }}>{item.fullName}</Text>
              <TouchableOpacity onPress={() => handleRegister(navigation, item)}>
                <Icon name='arrow-right' size={30} />
              </TouchableOpacity>
            </View>
            <View style={[styles.item, { height: 40 }]}>
              <Text>Ngày Thuê</Text>
              <Text>{new Date(item.start_date).toISOString().split('T')[0]}</Text>
            </View>
            <View style={styles.item}>
              <Text>Số tiền</Text>
              <Text>{formatNumber(item.total_price)}</Text>
            </View>
            <View style={styles.item}>
              <Text>Đã trả</Text>
              <Text>{item.payment_status}</Text>
            </View>
            <View style={styles.item}>
              <Text>Trạng thái</Text>
              <TouchableOpacity
                style={styles.statusButton}
                onPress={() => toggleStatusDropdown(item.retal_id)}
              >
                <Text>{item.status}</Text>
                <Icon name='chevron-down' size={20} />
              </TouchableOpacity>
              {item.isDropdownOpen && (
                <View style={styles.dropdown}>
                  {status.slice(1).map((statusItem, index) => ( // Bỏ "Tất cả" khỏi dropdown
                    <TouchableOpacity
                      key={index}
                      style={styles.dropdownItem}
                      onPress={() => handleStatusSelect(item.retal_id, statusItem)}
                    >
                      <Text>{statusItem}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}
      />
      {/* Add new contract */}
      <TouchableOpacity style={styles.addButton}>
        <Icon name='plus' size={24} color="#FFF" />
      </TouchableOpacity>
      {/* Footer */}
      <View style={styles.footer}>
        <Text>Tổng tiền: {formatNumber(totalAmount)} đ</Text>
        <TouchableOpacity>
          <Text style={{ color: "blue" }}>Chi tiết</Text>
        </TouchableOpacity>
      </View>
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
});

export default AllContract;