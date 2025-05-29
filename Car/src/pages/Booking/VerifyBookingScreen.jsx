import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { socketManager } from "../../utils/socket";
import { BASE_URL } from "@env";
console.log("BASE URL verifyBookingScreen : ", BASE_URL);

const VerifyBookingScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false); const fetchPendingBookings = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("Token in VerifyBookingScreen:", token);        const res = await axios.get(`${BASE_URL}/api/reservations/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn chờ xác nhận:", error.message);
      Alert.alert("Lỗi", "Không thể tải danh sách đơn đặt xe");
    } finally {
      setLoading(false);
    }
  }; useEffect(() => {
    const initializeSocket = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        console.log('Decoded token:', decoded);
        socketManager.connect(decoded.account_id);

        if (socketManager.socket) {
          socketManager.socket.on("bookingStatusUpdated", (data) => {
            console.log("Received booking update:", data);
            fetchPendingBookings(); 
          });
        }
      }
    };

    fetchPendingBookings();
    initializeSocket();

    return () => {
      if (socketManager.socket) {
        socketManager.socket.off("bookingStatusUpdated");
        socketManager.disconnect();
      }
    };
  }, []);
  const handleUpdateStatus = async (reservation_id, newStatus) => {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      Alert.alert("Lỗi", "Không tìm thấy token.");
      return;
    }

    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const receptionist_id = decoded.account_id; 

      const status = newStatus === "Đã xác nhận" ? "confirmed" : "canceled";        await axios.put(
        `${BASE_URL}/api/reservations/update/${reservation_id}`,
        {
          status,
          receptionist_id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Gửi socket để thông báo real-time
      socketManager.socket?.emit("reservationStatusChange", {
        reservation_id,
        status,
        message: `Đơn đặt xe của bạn đã được ${newStatus === "Đã xác nhận" ? "xác nhận" : "từ chối"}.`,
      });

      Alert.alert("Thành công", `Đơn đã được ${newStatus === "Đã xác nhận" ? "xác nhận" : "từ chối"}.`);
      fetchPendingBookings();

    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      Alert.alert("Lỗi", "Không thể cập nhật trạng thái đơn.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>Khách hàng:</Text>
        <Text>
          {item.first_name} {item.last_name}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Xe:</Text>
        <Text>{item.brand} {item.model}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Biển số:</Text>
        <Text>{item.license_plate}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Ngày thuê:</Text>
        <Text>{new Date(item.start_date).toLocaleDateString('vi-VN')}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Ngày trả:</Text>
        <Text>{new Date(item.end_date).toLocaleDateString('vi-VN')}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Tổng tiền:</Text>
        <Text>{Number(item.total_price).toLocaleString('vi-VN')}đ</Text>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#28a745" }]}
          onPress={() => handleUpdateStatus(item.reservation_id, "Đã xác nhận")}
        >
          <Icon name="check" size={20} color="#fff" />
          <Text style={styles.buttonText}>Xác nhận</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#dc3545" }]}
          onPress={() => handleUpdateStatus(item.reservation_id, "Từ chối")}
        >
          <Icon name="close" size={20} color="#fff" />
          <Text style={styles.buttonText}>Từ chối</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Đang tải đơn...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kiểm duyệt đơn đặt xe</Text>
      {bookings.length === 0 ? (
        <Text style={styles.center}>Không có đơn chờ xác nhận.</Text>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.reservation_id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 12,
    textAlign: "center",
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  label: {
    fontWeight: "600",
    color: "#444",
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    justifyContent: "center",
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    marginLeft: 6,
    fontWeight: "bold",
    fontSize: 14,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});


export default VerifyBookingScreen;
