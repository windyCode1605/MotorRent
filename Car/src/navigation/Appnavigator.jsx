import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../pages/HomeScreen";
import LoginScreen from "../pages/LoginScreen";
import RegisterScreen from "../pages/RegisterScreen";
import TaskScreen from "../pages/TaskScreen";
import WarningScreen from "../pages/WarningScreen";
import HoiSo from "../pages/HoiSo";


import AllContract from "../pages/ContractDate/AllContract";

import HomeScreenCus from "../pages/motor/HomeScreenCus";
import MotorcycleDetailScreen from "../pages/motor/MotorcycleDetailScreen";
import BookingScreen from "../pages/motor/BookingScreen";
import RentalForm from "../pages/motor/RentalForm"; 
import RentalStep1 from "../pages/motor/RentalStep1";
import RentalStep2 from "../pages/motor/RentalStep2";
import RentalStep3 from "../pages/motor/RentalStep3";
import PaymentScreen from "../pages/motor/Payment";

import TabNavigator from "./RouterTab";
import Cofirmed from "../pages/ContractDate/Cofirmed";
import ListCus from "../pages/Customer/ListCus";
import AddNewCustomer from "../pages/Customer/AddNewCustomer";


import MaintenanceItem from "../pages/maintenance/maintenance";
import newMaintenance from "../pages/maintenance/newMaintenance";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerBackTitle: ""}} initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{headerShown: false}}/>
      <Stack.Screen name='Main'component={TabNavigator} options={{headerShown: false}}/>



      {/** Của admin */}
      <Stack.Screen name='ListCus' component={ListCus} options={{headerShown: false}}/>
      <Stack.Screen name='AddNewCustomer' component={AddNewCustomer} options={{headerShown: false}}/>
      <Stack.Screen name='AllCT' component={AllContract} options={{headerShown: false}}/>
      <Stack.Screen name='TaskScreen' component={TaskScreen} options={{headerShown: false}}/>
      <Stack.Screen name='WarningScreen' component={WarningScreen} options={{headerShown: false}}/>
      {/** Của maintain */}
      <Stack.Screen name='maintenance' component={MaintenanceItem} options={{headerShown: false}}/>
      <Stack.Screen name='newMaintenance' component={newMaintenance} options={{headerShown: false}} />



      {/**của KH */}
      <Stack.Screen name='MotorScreen' component={HomeScreenCus} options={{headerShown: false}}/>
      <Stack.Screen name='MotorDetail' component={MotorcycleDetailScreen} options={{headerShown: false}}/>
      <Stack.Screen name='Booking' component={BookingScreen} options={{headerShown: false}}/>
      <Stack.Screen name='RentalForm' component={RentalForm} options={{headerShown: false}}/>
      <Stack.Screen name='RentalStep1' component={RentalStep1} options={{headerShown: false}}/>
      <Stack.Screen name='RentalStep2' component={RentalStep2} options={{headerShown: false}}/>      
      <Stack.Screen name='RentalStep3' component={RentalStep3} options={{headerShown: false}}/>
      <Stack.Screen name='Payment' component={PaymentScreen} options={{headerShown: false}}/>
      <Stack.Screen name='Cofirmed' component={Cofirmed} options={{headerShown: false}}/>

    </Stack.Navigator>
  );
}

export default AppNavigator;
