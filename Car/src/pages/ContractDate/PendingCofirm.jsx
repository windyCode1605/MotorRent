import React from "react";
import {View, Text, FlatList, ScrollView, StyleSheet, TouchableOpacity} from "react-native";
import { Icon } from "react-native-paper";

const PendingCofirm = () => {
    return(
        <View style={styles.container}>  
            <View>
                <Icon name='arrow-left' size={40} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'blue',
    }
})
export default PendingCofirm;