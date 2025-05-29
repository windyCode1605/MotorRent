import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { BASE_URL } from '@env';
console.log('BASE URL MotorcycleDetailScreen:', BASE_URL);

const MotorcycleDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  

  const {motorcycle} = route.params;
  

  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate('MotorScreen')}><Icon name='arrow-left' size={40}/></TouchableOpacity>
            <Text style={styles.textHead}>Chi Tiết</Text>
            <View></View>
        </View>
      <Image source={{ uri: `${BASE_URL}/${motorcycle.IMG_Motor}` }} style={styles.image} />
      <Text style={styles.name}>{motorcycle.model}</Text>
      <Text style={styles.price}>{motorcycle.daily_rental_price}K/Ngay</Text>
      <Text style={styles.info}>Thông tin chi tiết</Text>
      <Text style={styles.detail}>Màu xe: {motorcycle.color}</Text>
      <Text style={styles.detail}>Dung tích: {motorcycle.mileage}</Text>
      <Text style={styles.detail}>Nhiên liệu: {motorcycle.fuel_type}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('RentalStep1', { motorcycle })}
      >
        <Text style={styles.buttonText}>Đặt ngay</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header:{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  textHead: { fontSize: 20, fontWeight: 'bold',marginRight: 40,},
  image: { width: '100%', height: 200, borderRadius: 8, marginTop: 15, },
  name: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
  price: { fontSize: 18, color: 'green' },
  info: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  detail: { fontSize: 14, marginVertical: 5 },
  button: { backgroundColor: 'green', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default MotorcycleDetailScreen;
