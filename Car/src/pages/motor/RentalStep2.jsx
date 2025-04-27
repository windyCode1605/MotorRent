import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList , ActivityIndicator} from 'react-native';
import axios from 'axios';
import { BASE_URL } from '@env';

const RentalStep2 = ({ route, navigation }) => {
    const { motorcycle, pickupLocation, pickupTime, returnLocation, returnTime } = route.params;
    const [services, setServices] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [loading, setLoading] = useState(true);
    

    useEffect(() => {
        axios.get(`${BASE_URL}/rentaladdons/getService`)
            .then(res => setServices(res.data))
            .catch(err => console.error("ERR", err))
            .finally(() => setLoading(false));
    }, []);

    const toggleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleNext = () => {
        navigation.navigate('RentalStep3', { motorcycle, pickupLocation, pickupTime, returnLocation, returnTime, selectedIds, services });
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.card, selectedIds.includes(item.addon_id) && styles.cardSelected]}
            onPress={() => toggleSelect(item.addon_id)}
        >
            <Text style={[styles.name, selectedIds.includes(item.addon_id) && styles.textSelected]}>{item.addon_name}</Text>
            <Text style={[styles.price, selectedIds.includes(item.addon_id) && styles.textSelected]}>{item.addon_price}₫</Text>
        </TouchableOpacity>
    );
    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#27ae60" />
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Chọn dịch vụ bổ sung</Text>
            <FlatList
                data={services}
                keyExtractor={(item) => item.addon_id.toString()}
                renderItem={renderItem}
                numColumns={2}
                columnWrapperStyle={styles.row}
            />
            <TouchableOpacity style={styles.button} onPress={handleNext}>
                <Text style={styles.buttonText}>Tiếp theo</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f7f9fb' },
    header: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, textAlign: 'center', color: '#0a3d62' },
    row: { justifyContent: 'space-between' },
    card: { flex: 1, margin: 5, padding: 16, backgroundColor: '#f0f0f0', borderRadius: 8, alignItems: 'center' },
    cardSelected: { backgroundColor: '#27ae60' },
    name: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    price: { fontSize: 14, color: '#333' },
    textSelected: { color: '#fff' },
    button: { backgroundColor: '#1abc9c', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 20 },
    buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});

export default RentalStep2;