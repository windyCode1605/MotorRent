import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import axios from "axios"; // nhớ cài: npm install axios

const HomeScreenCus = () => {
  const navigation = useNavigation();
  const [motorcycles, setMotorcycles] = useState([]);

  useEffect(() => {
    fetchMotorcycles();
  }, []);

  const fetchMotorcycles = async () => {
    try {
      const res = await axios.get("http://192.168.1.15:3000/car");
      setMotorcycles(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách xe:", error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('MotorDetail', { motorcycle: item })}
    >
      <Image
        source={{ uri: `http://192.168.1.15:3000/uploads/${item.IMG_Motor}` }} //https://cdn.carvip.vn/images/car1.jpg

        style={styles.image}
      />
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
          <Image source={require('../../assets/ab2021.jpg')} style={styles.ImageTitle} />
          <Image source={require('../../assets/Ab.png')} style={styles.ImageTitle} />
          <Image source={require('../../assets/Ab.png')} style={styles.ImageTitle} />

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
  ImageTitle: { color: '#FFF',fontWeight: 'bold', width: 300, height: '90%', marginHorizontal: 5 , marginVertical: 7},
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  card: { flex: 1, margin: 5, backgroundColor: '#fff', borderRadius: 8, padding: 10, alignItems: 'center' },
  name: { fontSize: 16, fontWeight: 'bold', marginTop: 5 },
  price: { fontSize: 14, color: 'green' },
  image: {width: 100, height: 100, borderRadius: 10,},
});

export default HomeScreenCus;