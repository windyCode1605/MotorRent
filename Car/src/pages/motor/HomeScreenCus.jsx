import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import axios from "axios"; 
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@env";
console.log("BASE URL HomeScreenCus :", BASE_URL);

const HomeScreenCus = () => {
  const navigation = useNavigation();
  const [motorcycles, setMotorcycles] = useState([]);

  useEffect(() => {
    fetchMotorcycles();
  }, []);




  // API DS xe
  const fetchMotorcycles = async () => {
    const token = await AsyncStorage.getItem('token');
    console.log("token motor: ", token);
    try {
      const res = await axios.get(`${BASE_URL}/vehicles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMotorcycles(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách xe:", error.message);
      console.error("Chi tiết lỗi:", error.response || error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('MotorDetail', { motorcycle: item })}>

      <Image source={{ uri: `${BASE_URL}/${item.IMG_Motor}` }} style={styles.image} />
      <Text style={styles.name}>{item.model}</Text>
      <Text style={styles.price}>{item.daily_rental_price}K/Ngày</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.TextHead}>Motor Partner</Text>
        <Icon name="bell-outline" size={24} style={styles.IconBell} />
      </View>

      <View style={{ flex: 1, marginHorizontal: 20 }}>
        <ScrollView horizontal={true} style={styles.contents} showsHorizontalScrollIndicator={false}>
          <Image source={require('../../assets/car2.jpg')} style={styles.ImageTitle} />
        </ScrollView>

        <Text style={styles.title}>Xu hướng quanh bạn</Text>
        <FlatList
          data={motorcycles}
          renderItem={renderItem}
          keyExtractor={(item) => item.car_id.toString()}
          numColumns={2}
        />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  TextHead: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  IconBell: {
    marginTop: 5,
  },
  contents: {
    width: '100%',
    height: 200,
    flexDirection: 'row',
  },
  ImageTitle: { color: '#FFF', fontWeight: 'bold', width: 300, height: '90%', marginHorizontal: 5, marginVertical: 7 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  card: { flex: 1, margin: 5, backgroundColor: '#fff', borderRadius: 8, padding: 10, alignItems: 'center' },
  name: { fontSize: 16, fontWeight: 'bold', marginTop: 5 },
  price: { fontSize: 14, color: 'green' },
  image: { width: 100, height: 100, borderRadius: 10, },
});

export default HomeScreenCus;