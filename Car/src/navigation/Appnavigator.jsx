import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../pages/HomeScreen";
import LoginScreen from "../pages/LoginScreen";
import RegisterScreen from "../pages/RegisterScreen";
import TaskScreen from "../pages/TaskScreen";
import WarningScreen from "../pages/WarningScreen";
import HoiSo from "../pages/HoiSo";
import VehicleManagementScreen from "../pages/motor/VehicleManagementScreen";


import AllContract from "../pages/ContractDate/AllContract";

import SplashScreen from "../pages/SplashScreen";
import HomeScreenCus from "../pages/motor/HomeScreenCus";
import MotorcycleDetailScreen from "../pages/motor/MotorcycleDetailScreen";
import BookingScreen from "../pages/motor/BookingScreen";
import RentalStep1 from "../pages/motor/RentalStep1";
import RentalStep2 from "../pages/motor/RentalStep2";
import RentalStep3 from "../pages/motor/RentalStep3";
import PaymentScreen from "../pages/motor/Payment";
import PaymentSuccessScreen from "../pages/motor/PaymentSuccessScreen";
import MoMoWebViewScreen from "../pages/motor/MoMoWebViewScreen";

import { CustomerTabNavigator, AdminTabNavigator } from "./RouterTab";
import Cofirmed from "../pages/ContractDate/Cofirmed";
import ListCus from "../pages/Customer/ListCus";
import AddNewCustomer from "../pages/Customer/AddNewCustomer";
import VerifyBookingScreen from "../pages/Booking/VerifyBookingScreen";
import VehicleListScreen from "../pages/Lists/VehicleListScreen";

import MaintenanceItem from "../pages/maintenance/maintenance";
import NewMaintenance from "../pages/maintenance/newMaintenance";
import serviceForm from "../pages/maintenance/ServiceForm";
import EditServiceScreen from "../pages/maintenance/EditServiceScreen";
import NewServiceScreen from "../pages/maintenance/NewServiceScreen";

import personalScreen from "../pages/acount/ProfileScreen";
import ChangePasswordScreen from "../pages/acount/ChangePasswordScreen";
import LoginHistoryScreen from "../pages/acount/LoginHistoryScreen";
import NotificationSettingsScreen from "../pages/acount/NotificationSettingsScreen";
import ForgotPasswordScreen from "../pages/acount/ForgotPasswordScreen";
import ResetPassword from "../pages/acount/ResetPasswordScreen";


import ListSelector from "../pages/Lists/ListSelector";

import ListEmployeeScreen from "../pages/Employee/ListEmployeeScreen";
import AddEmployeeScreen from "../pages/Employee/AddEmployeeScreen";
import EditEmployeeScreen from "../pages/Employee/EditEmployeeScreen";
const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerBackTitle: ""}} initialRouteName="SplashScreen">      
      <Stack.Screen name="SplashScreen" component={SplashScreen} options={{headerShown: false}}/>
      <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{headerShown: false}}/>
      <Stack.Screen name="CustomerHome" component={CustomerTabNavigator} options={{headerShown: false}}/>
      <Stack.Screen name="AdminHome" component={AdminTabNavigator} options={{headerShown: false}}/>

      <Stack.Screen name='ListCus' component={ListCus} options={{headerShown: false}}/>
      <Stack.Screen name='AddNewCustomer' component={AddNewCustomer} options={{headerShown: false}}/>
      <Stack.Screen name='AllCT' component={AllContract} options={{headerShown: false}}/>
      <Stack.Screen name='TaskScreen' component={TaskScreen} options={{headerShown: false}}/>
      <Stack.Screen name='WarningScreen' component={WarningScreen} options={{headerShown: false}}/>
      <Stack.Screen name='ListSelector' component={ListSelector} options={{headerShown: false}}/>
      <Stack.Screen name='VehicleListScreen' component={VehicleListScreen} options={{headerShown: false}}/>
     
      <Stack.Screen name='maintenance' component={MaintenanceItem} options={{headerShown: false}}/>
      <Stack.Screen name='newMaintenance' component={NewMaintenance} options={{headerShown: false}}/>
      <Stack.Screen name='serviceForm' component={serviceForm} options={{headerShown: false}}/>
      <Stack.Screen name='EditServiceScreen' component={EditServiceScreen} options={{headerShown: false}}/>
      <Stack.Screen name='NewServiceScreen' component={NewServiceScreen} options={{headerShown: false}}/>
      
      <Stack.Screen name='personalScreen' component={personalScreen} options={{headerShown: false}}/>
      <Stack.Screen name='ChangePasswordScreen' component={ChangePasswordScreen} options={{headerShown: false}}/>
      <Stack.Screen name='LoginHistory' component={LoginHistoryScreen} options={{headerShown: false}}/>
      <Stack.Screen name='NotificationSettingsScreen' component={NotificationSettingsScreen} options={{headerShown: false}}/>
      <Stack.Screen name='ForgotPasswordScreen' component={ForgotPasswordScreen} options={{headerShown: false}}/>
      <Stack.Screen name='ResetPassword' component={ResetPassword} options={{headerShown: false}}/>
      
      <Stack.Screen name='MotorScreen' component={HomeScreenCus} options={{headerShown: false}}/>
      <Stack.Screen name='MotorDetail' component={MotorcycleDetailScreen} options={{headerShown: false}}/>
      <Stack.Screen name='Booking' component={BookingScreen} options={{headerShown: false}}/>
      <Stack.Screen name='RentalStep1' component={RentalStep1} options={{headerShown: false}}/>
      <Stack.Screen name='RentalStep2' component={RentalStep2} options={{headerShown: false}}/>      
      <Stack.Screen name='RentalStep3' component={RentalStep3} options={{headerShown: false}}/>
      <Stack.Screen name='Payment' component={PaymentScreen} options={{headerShown: false}}/>
      <Stack.Screen name='MoMoWebView' component={MoMoWebViewScreen} options={{headerShown: false}}/>
      <Stack.Screen name='PaymentSuccess' component={PaymentSuccessScreen} options={{headerShown: false}}/>
      <Stack.Screen name='Cofirmed' component={Cofirmed} options={{headerShown: false}}/>      
      <Stack.Screen name='HoiSo' component={HoiSo} options={{headerShown: false}}/>
      <Stack.Screen name='VerifyBooking' component={VerifyBookingScreen} options={{headerShown: false}}/>
      <Stack.Screen name='ListEmployee' component={ListEmployeeScreen} options={{headerShown: false}}/>
      <Stack.Screen name='AddEmployee' component={AddEmployeeScreen} options={{headerShown: false}}/>
      <Stack.Screen name='EditEmployee' component={EditEmployeeScreen} options={{headerShown: false}}/>
      <Stack.Screen name="VehicleManagement" component={VehicleManagementScreen} options={{headerShown: false}}/>
    </Stack.Navigator>
  );
}
export default AppNavigator;
