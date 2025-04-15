import React from "react";
import { View , StyleSheet , TouchableOpacity, Text , Image} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const SelectLocation = () => {
    






    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.header}>
                <Icon name="bell-outline" size={24} style={styles.IconBell} />
                <Text style={styles.TextHead}>Thuê xe máy</Text>
            </View>
           
            <View style={styles.MotorHead}>
                <Image source={require("../../assets/ab2021.jpg")}  style={styles.Img}/>
                <View style={styles.MotorInf}>
                    <Text style={styles.TextNameMotor}>Ten xe</Text>
                    <Text style={{color: '#A6A6A6'}}>Mo ta xe hmm....... </Text>
                </View>
            </View>
            <Text style={[styles.TextNameMotor,{marginLeft: 10}]}>Thông tin cần nhập</Text>
            <TouchableOpacity ><Text style={styles.Button}>Chọn vị trí nhận xe</Text></TouchableOpacity>
            <Text style={styles.TextDescript}>Vị trí nhận xe *</Text>
            <Text style={styles.TextDescript}>Thời gian thuê</Text>
            
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
        backgroundColor: "#ccc"
      },
      TextHead: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        alignSelf: 'center',
        marginRight: 100,
      },
      MotorHead: {margin: 5, flexDirection: 'row', justifyContent: 'space-between'},
      Img: {marginLeft: 10, width: 120, height: 120},
      MotorInf: { paddingTop: 10, justifyContent: 'flex_start', paddingRight: 120},
      TextNameMotor: { fontSize: 20, fontWeight: '600'},
      TextDescript: { margin: 10, color: '#A6A6A6'},
      Button: { paddingHorizontal: 90,paddingVertical: 15, margin: 15, backgroundColor: '#12B000', color: '#FFF', alignSelf: "center", borderRadius: 10,},


})


export default SelectLocation;