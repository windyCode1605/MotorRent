import React , {useState} from "react";
import {View, Text, FlatList, ScrollView, StyleSheet, TouchableOpacity} from "react-native";
import { Button, TextInput } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import RegisterScreen from "../RegisterScreen";


const status = ["Tất cả", "Chờ xác nhận", "Đã xác nhận", "Đang thuê", "Hoàn thành", "Hủy", "Xe sự cố"];
const Contracts = [
  {
    id: '1',
    fullName: "Nguyen Van A",
    DateHire: "01/02/2020",
    CarHire: "Ablade A",
    Mount: 150000,
    Paid: 150000,
    Status: "Đã thanh toán",
  },
  {
    id: '2',
    fullName: "Nguyen Van BB",
    DateHire: "01/02/2020",
    CarHire: "Ablade A",
    Mount: 150000,
    Paid: 150000,
    Status: "Đã thanh toán",
  },
  {
    id: '3',
    fullName: "Nguyen Van C",
    DateHire: "01/02/2020",
    CarHire: "Ablade A",
    Mount: 150000,
    Paid: 150000,
    Status: "Đã thanh toán",
  },
]

// ex xample dieu huong 
const handleRegister = () => {
  navigation.navigate("RegisterScreen", {Contract : item});
}
// tong tien
const totalAmount = Contracts.reduce((sum, contract) =>  sum + contract.Mount, 0);
// format Numb
const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const AllContract = () => 
  {

    return(
        <View style={styles.container}>  
        {/* Header */}
          <View style={styles.header}>
              <Icon name='arrow-left' size={35} />
              <Text style={{fontSize: 24, fontWeight:'bold'}}>Hợp đồng ngày</Text>
              <Icon name="menu" size={35}/>
          </View>
        {/* Filter Tabs */}
          <ScrollView horizontal={true} style={styles.scroll}>
            {status.map((item, index) => (
            <TouchableOpacity 
            key={index} 
            style={styles.items}
            >
            <Text style={styles.text}>{item}</Text>
            </TouchableOpacity>
          ))}
          </ScrollView>


          <View style={styles.Search}>
            <TextInput style={styles.TIP}>
              <Icon name='microphone' size={24}/> Tìm kiếm theo tên, SDT
              </TextInput>

            <TouchableOpacity style={styles.ButtonSort}>
            <Icon name='sort-calendar-ascending' size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>



          <FlatList style={styles.ListView} 
          data={Contracts}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (
            <View style={styles.View}>
              <View style={[styles.item,{borderBottomWidth: 0, height: 40}]}>
                <Text style={{fontWeight: 'bold', }}>{item.fullName} </Text>
                <TouchableOpacity onPress={handleRegister}><Icon name='arrow-right' size={30}/></TouchableOpacity>
              </View>
              <View style={[styles.item, {height: 40}]}>
                <Text>Ngày Thuê</Text>
                <Text>{item.DateHire} </Text>
              </View>
              <View style={styles.item}>
                <Text>Số tiền </Text>
                <Text>{item.Mount} </Text>
              </View>
              <View style={styles.item}>
                <Text>Đã trả</Text>
                <Text>{item.Paid} </Text>
              </View>
              <View style={styles.item}>
                <Text>Trạng thái</Text>
                <TouchableOpacity style={styles.statusButton}>
                  <Text>{item.Status}</Text>
                  <Icon name='chevron-down' size={20}/>
                </TouchableOpacity>
              </View>
            </View>
              )
            }
          />
          {/*Add new contract */}
          <TouchableOpacity style={styles.addButton}>
            <Icon name='plus' size={24} color="#FFF"/>
          </TouchableOpacity>
          {/* Footer */}
          <View style={styles.footer}>
            <Text>Tổng tiền: {formatNumber(totalAmount)} đ</Text>
            <TouchableOpacity>
              <Text style={{ color: "blue" }}>Chi tiết</Text>
            </TouchableOpacity>
          </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    header: {
        width: '100%',
        height: 35,
        marginTop: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    scoll: {
      marginVertical: 10,
    },
    items: {
      width: 120,
      height: 30,
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 5,
    },
    activeTab: {
      borderBottomWidth: 2,
      borderBottomColor: 'blue',
    },
    text: {
      color: "#000",
      fontSize: 12,
      fontWeight: "bold",
    },
    Search: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    TIP: { flex: 1, height: 40, fontSize: 16, },
    ButtonSort: {
      marginRight: 15,
      width: 50, 
      backgroundColor:'#fff', 
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    ListView: {
      height: '83%',
      
    },
    View: {
      paddingVertical: 10,
    },
    item: {
      height: 70,
      paddingHorizontal: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: '#fff',
      borderBottomColor: 'gray',
      borderBottomWidth: 1,
      alignItems: 'center',
    },
    statusButton: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "gray",
      borderRadius: 5,
      padding: 5,
    },
    addButton: {
      position: 'absolute',
      bottom: 120, 
      right: 20,
      backgroundColor: 'blue',
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5, // Hiệu ứng bóng trên Android
      zIndex: 1000, // Đảm bảo nút nằm trên cùng
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 25,
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderTopColor: 'blue',
    }
})
export default AllContract;