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
import SelectLocation from "../pages/motor/SelectLocation";
import RentalForm from "../pages/motor/RentalForm"; 
import SelectExtraServicesScreen from "../pages/motor/SelectExtraServicesScreen";
import ExtraServiceSummary from "../pages/motor/ExtraServiceSummary";


import TabNavigator from "./RouterTab";
import Cofirmed from "../pages/ContractDate/Cofirmed";
import ListCus from "../pages/Customer/ListCus";
import AddNewCustomer from "../pages/Customer/AddNewCustomer";  



const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerBackTitle: ""}} initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{headerShown: false}}/>
      <Stack.Screen name='Main'component={TabNavigator} options={{headerShown: false}}/>

      {/** Của AdminAdmin */}
      <Stack.Screen name='ListCus' component={ListCus} options={{headerShown: false}}/>
      <Stack.Screen name='AddNewCustomer' component={AddNewCustomer} options={{headerShown: false}}/>
      <Stack.Screen name='AllCT' component={AllContract} options={{headerShown: false}}/>

      {/**của KH */}
      <Stack.Screen name='MotorScreen' component={HomeScreenCus} options={{headerShown: false}}/>
      <Stack.Screen name='MotorDetail' component={MotorcycleDetailScreen} options={{headerShown: false}}/>
      <Stack.Screen name='Booking' component={BookingScreen} options={{headerShown: false}}/>
      <Stack.Screen name='SelectLocation' component={SelectLocation} options={{headerShown: false}}/>
      <Stack.Screen name='RentalForm' component={RentalForm} options={{headerShown: false}}/>
      <Stack.Screen name='SelectExtraServicesScreen' component={SelectExtraServicesScreen} options={{headerShown: false}}/>
      <Stack.Screen name='ExtraServiceSummary' component={ExtraServiceSummary} options={{headerShown: false}}/>

    </Stack.Navigator>
  );
}

export default AppNavigator;
