import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, FlatList, TextInput, TouchableOpacity } from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { BASE_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";




const ListCus = ({navigation}) => {
    const [customers, setCustomers] = useState([]); 
    const [searchQuery, setSearchQuery] = useState(''); 

    // lấy dữ liệu khách hàng từ API
    useEffect(() => {
    const fetchCustomers = async () => {
        const token = AsyncStorage.getItem('token');
        try {
        const response = await axios.get(`${BASE_URL}/customers`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = response.data;
        setCustomers(data);
        } catch (error) {
        console.error('Error fetch customer:', error);
        }
    };
    fetchCustomers();
    }, []);


    // Lọc khách hàng dựa trên từ khóa tìm kiếm
    const filteredCustomers = customers.filter(customer =>
        (customer.first_name + ' ' + customer.last_name).toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone_number.includes(searchQuery)
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Icon name='arrow-left' size={35} />
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Danh sách khách hàng</Text>
                <Icon name="menu" size={35} />
            </View>

            <View style={styles.Search}>
                <Icon name='microphone' size={24} style={styles.icon} />
                <TextInput
                    style={styles.TIP}
                    placeholder="Tìm kiếm theo tên, SDT"
                    placeholderTextColor={'gray'}
                    value={searchQuery}           // Gắn giá trị tìm kiếm
                    onChangeText={setSearchQuery} // Cập nhật giá trị tìm kiếm khi người dùng nhập
                />
            </View>

            <FlatList
                data={filteredCustomers} 
                keyExtractor={(item) => item.customer_id.toString()} 
                renderItem={({ item }) => (
                    <View style={{ marginHorizontal: 10, marginVertical: 20, backgroundColor: "#FFF", }}>
                        <Text style={styles.TextName}>{item.first_name} {item.last_name}</Text>
                        <View style={styles.item}>
                            <Text style={styles.TextItems}>Số điện thoại</Text>
                            <Text style={{ fontSize: 15, fontWeight: '500' }}>{item.phone_number}</Text>
                        </View>
                        <View style={styles.item}>
                            <Text style={styles.TextItems}>Địa chỉ</Text>
                            <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{item.address}</Text>
                        </View>
                        <View style={styles.item}>
                            <Text style={styles.TextItems}>Số dư</Text>
                            <Text style={{ fontSize: 15, fontWeight: '400', color: 'green' }}>{item.balance} đ</Text>
                        </View>
                        <View style={styles.item}>
                            <Text style={styles.TextItems}>Tổng thuê</Text>
                            <Text style={{ fontSize: 15, fontWeight: '400', color: 'blue' }}>{item.total_rent} đ</Text>
                        </View>
                        <View style={styles.buttons}>
                            <TouchableOpacity style={[styles.button,{backgroundColor: '#62A7F6'}]}><Icon name="skull" size={20} color={'blue'} /><Text>Sửa</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.button}><Icon name="delete" size={20} color={'red'} /><Text>Xóa</Text></TouchableOpacity>
                        </View>
                    </View>
                )}
            />

            <TouchableOpacity style={styles.addButton} onPress={ () => navigation.navigate("AddNewCustomer")}>
                <Icon name='plus' size={24} color="#FFF" />
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({
    container: { flex: 1, padding: 10 },
    header: { width: '100%', height: 35, marginTop: 25, flexDirection: 'row', justifyContent: 'space-between' },
    Search: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ccc', borderRadius: 10, paddingHorizontal: 10, margin: 10 },
    TIP: { flex: 1, height: 40, fontSize: 16 },
    icon: { marginLeft: 10 },
    item: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: 'gray', padding: 20 },
    TextName: { fontSize: 15, fontWeight: '500', paddingLeft: 30, paddingBottom: 5, paddingTop: 30 },
    TextItems: { color: '#AAA', fontSize: 15 },
    buttons: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 70 },
    button: { flexDirection: 'row', width: 80, height: 35, backgroundColor: '#FF8284', justifyContent: 'center', alignItems: 'center', borderRadius: 20 },
    addButton: { position: 'absolute', bottom: 120, right: 20, backgroundColor: 'blue', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', elevation: 5, zIndex: 1000 },
});

export default ListCus;
