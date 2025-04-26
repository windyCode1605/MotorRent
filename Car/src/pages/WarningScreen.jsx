import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialCommunityIcons";

const data = [
  { id: "1", plate: "123 1453", type: "Bảo hiểm xe" },
  { id: "2", plate: "123 1453", type: "Bảo hiểm TNDS" },
  { id: "3", plate: "123 1453", type: "Bảo hiểm thân vỏ" },
  { id: "4", plate: "123 1453", type: "Giấy ngân hàng" },
  { id: "5", plate: "123 1453", type: "Bảo dưỡng" },
  { id: "6", plate: "123 1453", type: "Phù hiệu" },
];

const WarningScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View>
        <Text style={styles.plate}>{item.plate}</Text>
        <Text style={styles.type}>{item.type}:</Text>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Chưa cấu hình</Text>
        <MaterialIcons name="chevron-right" size={20} color="#000" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.title}>Cảnh báo</Text>
      </View>

      {/* Danh sách*/}
      <FlatList data={data} renderItem={renderItem} keyExtractor={(item) => item.id} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { padding: 16, borderBottomWidth: 1, borderColor: "#ddd", alignItems: "center" },
  title: { marginTop: 25, fontSize: 20, fontWeight: "bold" },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  plate: { fontSize: 16, fontWeight: "bold" },
  type: { fontSize: 14, color: "gray" },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ddd",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  buttonText: { marginRight: 5 },
});

export default WarningScreen;
