import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const mockSelectedServices = [
  {
    addon_type: "Insurance",
    addon_name: "Bảo hiểm toàn diện",
    addon_price: 500000,
  },
  {
    addon_type: "Child Seat",
    addon_name: "Ghế trẻ em",
    addon_price: 100000,
  },
  {
    addon_type: "WiFi",
    addon_name: "WiFi di động",
    addon_price: 200000,
  },
  {
    addon_type: "WiFi",
    addon_name: "WiFi di động",
    addon_price: 200000,
  },
];

const formatCurrency = (value) =>
  value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const ExtraServiceSummary = () => {
  const totalPrice = mockSelectedServices.reduce(
    (sum, item) => sum + item.addon_price * item.quantity,
    0
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tóm tắt dịch vụ bổ sung</Text>

      <FlatList
        data={mockSelectedServices}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.name}>{item.addon_name}</Text>
            <Text style={styles.detail}>Loại: {item.addon_type}</Text>
            <Text style={styles.detail}>
              Giá: {formatCurrency(item.addon_price)} x {item.quantity}
            </Text>
            <Text style={styles.total}>
              Thành tiền: {formatCurrency(item.addon_price * item.quantity)}
            </Text>
          </View>
        )}
        ListFooterComponent={
          <Text style={styles.grandTotal}>
            Tổng cộng: {formatCurrency(totalPrice)}
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  itemContainer: {
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  detail: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  total: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: "600",
    color: "#27ae60",
  },
  grandTotal: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
    color: "#e74c3c",
  },
});

export default ExtraServiceSummary;
