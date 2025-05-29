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
import { BASE_URL } from "@env";
import { socketManager } from "../../utils/socket";

console.log("BASE URL VerifyBookingScreen:", BASE_URL);

const VerifyBookingScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchPendingBookings = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("Token in VerifyBookingScreen:", token);
      const res = await axios.get(`${BASE_URL}/Booking/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn chờ xác nhận:", error.message);
    } finally {
      setLoading(false);
    }
  };  useEffect(() => {
    const initializeSocket = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        console.log('Decoded token:', decoded);
        socketManager.connect(decoded.account_id);
        
        if (socketManager.socket) {
          // Listen for booking status updates
          socketManager.socket.on("bookingStatusUpdated", (data) => {
            console.log("Received booking update:", data);
            fetchPendingBookings(); // Refresh the list when a booking is updated
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

  const handleUpdateStatus = async (rental_id, newStatus) => {
    const token = await AsyncStorage.getItem("token");
    try {
      await axios.put(
        `${BASE_URL}/Booking/update/${rental_id}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );      // Emit socket event for real-time notification
      if (socket.socket) {
        socket.socket.emit("bookingStatusChange", {
          rental_id,
          status: newStatus,
          message: `Đơn đặt xe của bạn đã được ${newStatus === "Đã xác nhận" ? "xác nhận" : "từ chối"}.`,
        });
      }

      Alert.alert(
        "Thành công",
        `Đơn đã được ${
          newStatus === "Đã xác nhận" ? "xác nhận" : "từ chối"
        }.`
      );
      fetchPendingBookings();
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error.message);
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
        <Text>{item.model}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Ngày thuê:</Text>
        <Text>{item.start_date}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Ngày trả:</Text>
        <Text>{item.end_date}</Text>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#28a745" }]}
          onPress={() => handleUpdateStatus(item.rental_id, "Đã xác nhận")}
        >
          <Icon name="check" size={20} color="#fff" />
          <Text style={styles.buttonText}>Xác nhận</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#dc3545" }]}
          onPress={() => handleUpdateStatus(item.rental_id, "Từ chối")}
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
      <Text style={styles.header}>Kiểm duyệt đơn đặt xe</Text>
      {bookings.length === 0 ? (
        <Text style={styles.center}>Không có đơn chờ xác nhận.</Text>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.rental_id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f9f9f9" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  label: { fontWeight: "bold" },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    minWidth: 100,
    justifyContent: "center",
  },
  buttonText: { color: "#fff", marginLeft: 5 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default VerifyBookingScreen;
