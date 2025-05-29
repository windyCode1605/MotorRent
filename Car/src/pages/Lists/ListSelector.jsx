import React, { useState } from "react";
import { View, Text, StyleSheet, Picker, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const ListSelector = ({ navigation }) => {
  const [selectedList, setSelectedList] = useState("");

  const handleConfirm = () => {
    if (!selectedList) return;
    navigation.navigate(selectedList); // tên route giống key enum
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chọn danh sách</Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedList}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedList(itemValue)}
        >
          <Picker.Item label="-- Chọn loại danh sách --" value="" />
          <Picker.Item label="Khách hàng" value="CustomerListScreen" />
          <Picker.Item label="Đối tác" value="PartnerListScreen" />
          <Picker.Item label="Danh sách xe" value="VehicleListScreen" />
          <Picker.Item label="Tài khoản ngân hàng" value="BankAccountScreen" />
        </Picker>
      </View>

      <TouchableOpacity
        style={[styles.button, !selectedList && { backgroundColor: "#ccc" }]}
        onPress={handleConfirm}
        disabled={!selectedList}
      >
        <Icon name="check-circle-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}>Xác nhận</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ListSelector;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 20,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 8,
    alignItems: "center",
    gap: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
