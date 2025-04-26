import React, { useContext, useEffect, useState } from "react";
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TabNavigator from "../navigation/RouterTab";

// Dữ liệu giả danh sách chi nhánh
const branches = [
  {
    id: "1",
    Branch_name: "Hội sở",
    address: "Hà Nội",
    contracts: 5,
    customers: 5,
    activeCars: 3,
  },
  {
    id: "2",
    Branch_name: "Quang Nguyễn XeVip",
    address: "72 Trần Đại Nghĩa, Hà Nội",
    contracts: 0,
    customers: 0,
    activeCars: 0,
  },
  {
    id: "3",
    Branch_name: "Nguyễn XeVip02",
    address: "Hồ Chí Minh",
    contracts: 0,
    customers: 0,
    activeCars: 0,
  },
  {
    id: "4",
    Branch_name: "Nguyễn XeVip02",
    address: "Hồ Chí Minh",
    contracts: 0,
    customers: 0,
    activeCars: 0,
  },
];

const HomeScreen = () => {
  
  const [selectedBranch,setSelectedBranch] = useState("1");

  const [username, setUsername] = useState('');
  useEffect(() => {
    const fetchUsername = async () => {
      const storedUsername = await AsyncStorage.getItem("username");
      if(storedUsername) 
      {
        setUsername(storedUsername);
      }
    };
    fetchUsername();
  },[]);

  return(
    <SafeAreaView style= {Styles.container}>
    <View style={Styles.header}>

      {/*Header */}
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      <Text style={{ fontSize: 12, fontWeight: "800", color: "#FFFFFF" }}>xin chao</Text>
      <Icon name="bell-outline" size={24} color="#FFFFFF" />
      </View>
      <Text style={{fontSize: 22, fontWeight: "bold", color: "#FFFFFF"}}> {username} </Text>
    </View>
    {/*Banner */}
    <View style={Styles.banner} >
      <Text style={Styles.header_text}>Chúc bạn một {'\n'}ngày làm việc {'\n'}Hiệu quả </Text>
      <Image source={require("../assets/image4.png")}  style={{width: 200, height: '80%', }}/>
    </View>


    {/*Danh sach chi nhanh */}
    <Text style={Styles.Text}>Danh sách chi nhánh của bạn</Text>
    <FlatList
        data={branches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              backgroundColor: selectedBranch === item.id ? "#EAF2FF" : "#FFF",
              width: "85%",
              alignSelf: 'center',
              padding: 15,
              borderRadius: 10,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: selectedBranch === item.id ? "#007AFF" : "#DDD",
            }}
            onPress={() => setSelectedBranch(item.id)}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "#007AFF" }}>{item.Branch_name}</Text>
            <Text style={{ fontSize: 14, color: "#666" }}>{item.address}</Text>

            {/* Thông tin hợp đồng, khách hàng, xe */}
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <View style={{ flex: 1, alignItems: "center" }}>
                <Icon name="file-document-outline" size={24} color="#007AFF" />
                <Text>Hợp đồng</Text>
                <Text style={{ fontWeight: "bold" }}>{item.contracts}</Text>
              </View>
              <View style={{ flex: 1, alignItems: "center" }}>
                <Icon name="account-group-outline" size={24} color="#F4B400" />
                <Text>Khách hàng</Text>
                <Text style={{ fontWeight: "bold" }}>{item.customers}</Text>
              </View>
              <View style={{ flex: 1, alignItems: "center" }}>
                <Icon name="car-outline" size={24} color="#34A853" />
                <Text>Xe active</Text>
                <Text style={{ fontWeight: "bold" }}>{item.activeCars}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};
const Styles = StyleSheet.create (
  {
    container: {
      flex: 1,
    },
    header: {
      padding: 20,
      backgroundColor: 'blue',
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
    },
    header_text: {
      margin: 15,
      marginTop: 40,
      fontSize: 15,
      fontWeight: '700',
    },
    banner: {
      width: "95%",
      height: 160,
      backgroundColor: '#FFFFFF',
      margin: 10,
      borderRadius: 10,
      flexDirection: 'row',
      
    },
    Text: {
      margin: 10,
      fontSize: 15,
      fontWeight: 'bold',
      
    }

  }
)
export default HomeScreen;
