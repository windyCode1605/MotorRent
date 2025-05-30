import { View, StyleSheet, Text, FlatList, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "@env";
console.log("BASE URL ListCus:", BASE_URL);



const ListCus = ({navigation}) => {
    const [customers, setCustomers] = useState([]); 
    const [searchQuery, setSearchQuery] = useState(''); 
    const [loading, setLoading] = useState(false);

    // lấy dữ liệu khách hàng từ API
    const fetchCustomers = async () => {
        const token = await AsyncStorage.getItem('token');
        console.log("Token in ListCus:", token);
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
            Alert.alert('Lỗi', 'Không thể tải danh sách khách hàng');
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleDeleteCustomer = async (customerId) => {
        Alert.alert(
            "Xác nhận",
            "Bạn có chắc chắn muốn xóa khách hàng này?",
            [
                {
                    text: "Hủy",
                    style: "cancel"
                },
                {
                    text: "Xóa",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem('token');
                            await axios.delete(`${BASE_URL}/customers/${customerId}`, {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                            
                            Alert.alert("Thành công", "Đã xóa khách hàng!");
                            // Refresh danh sách
                            fetchCustomers();
                        } catch (error) {
                            Alert.alert(
                                "Lỗi",
                                error.response?.data?.message || "Không thể xóa khách hàng"
                            );
                        }
                    }
                }
            ]
        );
    };

    // Lọc khách hàng dựa trên từ khóa tìm kiếm
    const filteredCustomers = customers.filter(customer =>
        (customer.first_name + ' ' + customer.last_name).toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone_number.includes(searchQuery)
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name='arrow-left' size={35} />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Danh sách khách hàng</Text>
                <Icon name="menu" size={35} />
            </View>

            <View style={styles.Search}>
                <Icon name='microphone' size={24} style={styles.icon} />
                <TextInput
                    style={styles.TIP}
                    placeholder="Tìm kiếm theo tên, SDT"
                    placeholderTextColor={'gray'}
                    value={searchQuery}           
                    onChangeText={setSearchQuery} 
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
                        </View>                        <View style={styles.buttons}>
                            <TouchableOpacity 
                                style={[styles.button, {backgroundColor: '#62A7F6'}]}
                                onPress={() => navigation.navigate('EditCustomer', { customer: item })}
                            >
                                <Icon name="pencil" size={20} color={'white'} />
                                <Text style={styles.buttonText}>Sửa</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.button}
                                onPress={() => handleDeleteCustomer(item.customer_id)}
                            >
                                <Icon name="delete" size={20} color={'white'} />
                                <Text style={styles.buttonText}>Xóa</Text>
                            </TouchableOpacity>
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
    container: { 
        flex: 1, 
        padding: 10 
    },
    header: { 
        inlineSize: '100%', 
        blockSize: 35, 
        marginBlockStart: 25, 
        flexDirection: 'row', 
        justifyContent: 'space-between' 
    },
    Search: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        borderInlineSize: 1, 
        borderColor: '#ccc', 
        borderRadius: 10, 
        paddingHorizontal: 10, 
        margin: 10 
    },
    TIP: { 
        flex: 1, 
        blockSize: 40, 
        fontSize: 16 
    },
    icon: { 
        marginInlineStart: 10 
    },
    item: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        backgroundColor: '#FFF', 
        borderBlockEndSize: 1, 
        borderBlockEndColor: 'gray', 
        padding: 20 
    },
    TextName: { 
        fontSize: 15, 
        fontWeight: '500', 
        paddingInlineStart: 30, 
        paddingBlockEnd: 5, 
        paddingBlockStart: 30 
    },
    TextItems: { 
        color: '#AAA', 
        fontSize: 15 
    },    
    buttons: { 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        alignItems: 'center', 
        paddingVertical: 10, 
        paddingHorizontal: 70 
    },
    button: { 
        flexDirection: 'row', 
        inlineSize: 90, 
        blockSize: 40, 
        backgroundColor: '#FF8284', 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderRadius: 20,
        gap: 5
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
        marginInlineStart: 4
    },
    addButton: { 
        position: 'absolute', 
        insetBlockEnd: 120, 
        insetInlineEnd: 20, 
        backgroundColor: 'blue', 
        inlineSize: 50, 
        blockSize: 50, 
        borderRadius: 25, 
        justifyContent: 'center', 
        alignItems: 'center', 
        elevation: 5, 
        zIndex: 1000 
    },
});

export default ListCus;
