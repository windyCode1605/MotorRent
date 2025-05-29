import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";


import HomeScreen from "../pages/HomeScreen";
import TaskScreen from "../pages/TaskScreen";
import WarningScreen from "../pages/WarningScreen";
import HomeScreenCus from "../pages/motor/HomeScreenCus";
import ReservationHistoryScreen from "../pages/motor/ReservationHistoryScreen";
import PersonalScreen from "../pages/acount/ProfileScreen";
const Tab = createBottomTabNavigator();

const screenOptions = ({ route }) => ({
  tabBarIcon: ({ color, size }) => {
    let iconName;
    switch (route.name) {
      case "Trang chủ":
        iconName = "home";
        break;
      case "Đơn hàng":
        iconName = "clipboard-text-outline";
        break;
      case "Cá nhân":
        iconName = "account-circle-outline";
        break;
      case "Chi nhánh":
        iconName = "map-marker-radius";
        break;
      case "Chức năng":
        iconName = "view-dashboard-outline";
        break;
      case "Cảnh báo":
        iconName = "alert-circle-outline";
        break;
      default:
        iconName = "dots-horizontal";
    }
    return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
  },
  tabBarActiveTintColor: "#3b82f6",
  tabBarInactiveTintColor: "#9ca3af",
  tabBarStyle: {
    backgroundColor: "#ffffff",
    height: 60,
    paddingBottom: 5,
    borderTopWidth: 0.3,
    borderTopColor: "#e5e7eb",
  },
  tabBarLabelStyle: {
    fontSize: 12,
  },
  headerShown: false,
});

const CustomerTabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name="Trang chủ" component={HomeScreenCus} />
      <Tab.Screen name="Đơn đặt" component={ReservationHistoryScreen} />
      <Tab.Screen name="Cá nhân" component={PersonalScreen} />
    </Tab.Navigator>
  );
};


const AdminTabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={screenOptions}>      
      <Tab.Screen name="Chi nhánh" component={HomeScreen} />
      <Tab.Screen name="Chức năng" component={TaskScreen} />
      <Tab.Screen name="Cảnh báo" component={WarningScreen} />
      <Tab.Screen name="Cá nhân" component={PersonalScreen} />
    </Tab.Navigator>
  );
};
export { CustomerTabNavigator, AdminTabNavigator };
