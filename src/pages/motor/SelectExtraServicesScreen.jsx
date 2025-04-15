// SelectExtraServicesScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  useColorScheme,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const fetchAddOns = async () => {
  // Giả lập gọi API backend
  return [
    { id: "1", type: "Insurance", name: "Bảo hiểm toàn diện", price: 500000, icon: "shield-checkmark-outline" },
    { id: "2", type: "Child Seat", name: "Ghế trẻ em", price: 100000, icon: "baby-outline" },
    { id: "3", type: "GPS", name: "Thiết bị định vị GPS", price: 150000, icon: "navigate-outline" },
    { id: "4", type: "WiFi", name: "WiFi di động", price: 200000, icon: "wifi-outline" },
    { id: "5", type: "Other", name: "Gói vệ sinh xe", price: 80000, icon: "sparkles-outline" },
  ];
};

const SelectExtraServicesScreen = ({ navigation }) => {
  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const styles = getStyles(isDarkMode);

  useEffect(() => {
    const load = async () => {
      const data = await fetchAddOns();
      setServices(data);
      const stored = await AsyncStorage.getItem("selectedServices");
      if (stored) setSelected(JSON.parse(stored));
      setLoading(false);
    };
    load();
  }, []);

  

  const toggle = async (id) => {
    const updated = selected.includes(id)
      ? selected.filter((i) => i !== id)
      : [...selected, id];
    setSelected(updated);
    await AsyncStorage.setItem("selectedServices", JSON.stringify(updated));
  };

  const renderItem = ({ item }) => {
    const isSelected = selected.includes(item.id);
    return (
      <TouchableOpacity
        style={[styles.item, isSelected && styles.selected]}
        onPress={() => toggle(item.id)}
        activeOpacity={0.7}
      >
        <Icon
          name={item.icon}
          size={24}
          color={isSelected ? "#27ae60" : styles.text.color}
        />
        <Text style={styles.itemText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}><ActivityIndicator size="large" color="#27ae60" /></View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chọn dịch vụ bổ sung</Text>
      <FlatList
        data={services}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("ExtraServiceSummary", { selected })}
      >
        <Text style={styles.buttonText}>Tiếp tục</Text>
      </TouchableOpacity>
    </View>
  );
};

const getStyles = (dark) => {
  const width = Dimensions.get("window").width;
  const cardWidth = (width - 60) / 2;
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: dark ? "#121212" : "#fff",
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      color: dark ? "#fff" : "#000",
      marginBottom: 16,
    },
    row: {
      justifyContent: "space-between",
    },
    item: {
      backgroundColor: dark ? "#1f1f1f" : "#f0f0f0",
      padding: 16,
      marginBottom: 16,
      borderRadius: 12,
      width: cardWidth,
      alignItems: "center",
    },
    selected: {
      borderWidth: 2,
      borderColor: "#27ae60",
    },
    itemText: {
      marginTop: 8,
      color: dark ? "#eee" : "#333",
      textAlign: "center",
    },
    text: {
      color: dark ? "#eee" : "#333",
    },
    button: {
      backgroundColor: "#27ae60",
      padding: 14,
      borderRadius: 10,
      alignItems: "center",
      marginTop: 10,
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
  });
};

export default SelectExtraServicesScreen;
