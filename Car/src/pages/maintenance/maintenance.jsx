{/** Buoc 1*/}
import React, { useState, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, StyleSheet, ScrollView
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@env";
import axios from "axios";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

console.log("BASE_URL maintenance : ", BASE_URL);



const MaintenanceScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState("Danh sách phiếu");
  const [expandedId, setExpandedId] = useState(null);
  const [maintenances, setMaintenances] = useState([]);

  useEffect(() => {
    const fetchMaintenances = async () => {
      const Token = await AsyncStorage.getItem('token');
      console.log("Token maintenance: ", Token);
      try {
        const res = await axios.get(`${BASE_URL}/maintenance`, {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        });
        const data = res.data;
        setMaintenances(data);
      }
      catch (error) {
        console.error("Lỗi fetch data maintenance :", error.message);
      }
    };
    fetchMaintenances();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  // Hiển thị ngày 
  const showDatePicker = (DataBaseDate, setDate) => {
    DateTimePickerAndroid.open({
      value: DataBaseDate,
      onChange: (event, selectedDate) => {
        if (selectedDate) {
          setDate(selectedDate);
        }
      },
      mode: 'date',
    })
  }


  return (
    <View style={styles.container}>
      {/* Nội dung chính */}
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('TaskScreen')}>
            <Icon name="arrow-left" size={28} />
          </TouchableOpacity>

          <Text style={styles.title}>Bảo dưỡng sửa chữa</Text>

          <TouchableOpacity>
            <Icon name="filter-variant" size={28} />
          </TouchableOpacity>
        </View>


        {/* Tabs */}
        <View style={styles.tabs}>
          {["Danh sách phiếu", "Phê duyệt"].map(tab => (
            <TouchableOpacity key={tab} onPress={() => setSelectedTab(tab)}>
              <Text style={[styles.tabText, selectedTab === tab && styles.activeTab]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search */}
        <View style={styles.searchRow}>
          <TextInput style={styles.input} placeholder="Tìm theo Tên xe, Biển số" />
          <TouchableOpacity style={styles.filterBtn}>
            <Icon name="filter-outline" size={24} />
          </TouchableOpacity>
        </View>

        {/* List */}
        <FlatList
          data={maintenances}
          keyExtractor={(item) => item.maintenance_id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <TouchableOpacity onPress={() => toggleExpand(item.maintenance_id)}>
                <Text style={styles.vehicleName}>Xe ID: {item.car_id}</Text>
              </TouchableOpacity>
              {expandedId === item.maintenance_id && (
                <>
                  <Text>Thợ sửa chữa: {item.mechanic}</Text>
                  <Text>Hạng mục: {item.description}</Text>
                  <Text>Ngày bắt đầu bảo dưỡng : {new Date(item.maintenance_date).toISOString().split('T')[0]}</Text>
                  <Text>Ngày kết thúc bảo dưỡng : {new Date(item.next_maintenance_date || "Chưa có lịch").toISOString().split('T')[0]}</Text>
                  <Text>Chi phí: {item.cost.toLocaleString()} đ</Text>
                  <Text style={styles.statusBox}>Trạng thái: {item.status}</Text>
                </>
              )}
              <TouchableOpacity style={styles.viewBtn} onPress={() => toggleExpand(item.maintenance_id)}>
                <Text>Xem</Text>
              </TouchableOpacity>
            </View>
          )}
        />

      </View>

      {/* Floating button */}
      <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('newMaintenance')}>
        <Icon name="plus" color="#fff" size={28} />
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, paddingTop: 30 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },

  title: { fontSize: 18, fontWeight: "bold" },
  tabs: {
    flexDirection: "row", justifyContent: "space-around", marginVertical: 10,
  },
  tabText: { fontSize: 16, color: "#999" },
  activeTab: { color: "#007AFF", borderBottomWidth: 2, borderBottomColor: "#007AFF" },
  searchRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  input: {
    flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10,
  },
  filterBtn: {
    marginLeft: 10, padding: 10, backgroundColor: "#eee", borderRadius: 8,
  },
  card: {
    backgroundColor: "#fff", padding: 15, borderRadius: 10, marginBottom: 15,
    shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, elevation: 3,
  },
  vehicleName: { fontWeight: "bold", fontSize: 16, marginBottom: 5 },
  overdue: { color: "red" },
  statusBox: {
    marginTop: 5, backgroundColor: "#fff3cd", padding: 5, borderRadius: 5, color: "#856404",
  },
  viewBtn: {
    alignSelf: "flex-end", marginTop: 10, backgroundColor: "#f0f0f0", padding: 6,
    borderRadius: 5,
  },
  addBtn: {
    position: "absolute", bottom: 20, right: 20, backgroundColor: "#007AFF",
    width: 50, height: 50, justifyContent: "center", alignItems: "center",
    borderRadius: 25, elevation: 5,
  },
});

export default MaintenanceScreen;
