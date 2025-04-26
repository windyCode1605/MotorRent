import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";


import HomeScreen from "../pages/HomeScreen";
import TaskScreen from "../pages/TaskScreen";
import LoginScreen from "../pages/LoginScreen";
import WarningScreen from "../pages/WarningScreen";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    
        <Tab.Navigator 
        screenOptions={({route}) => 
            (
                {
                    TabBarIcon: ({color, size}) => {
                        let Icon;
                        switch (route.name) {
                            case "Chi nhánh":
                                Icon = "office-building";
                                break;

                            case "Chức năng":
                                Icon = "tools";
                                break;
                                
                            case "Cảnh báo":
                                Icon = "warning";
                                break;
                             
    
                            default:
                                break;
                        }
                        return <MaterialIcons name={Icon} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: "blue",
                    tabBarInactiveTintColor: "#007AFF",
                    tabBarStyle: {
                        backgroundColor: "#fefefe",
                        height: 60,
                        paddingBottom: 5,
                        },
                    tabBarLabelStyle: {
                         fontSize: 12,
                         },
                    headerShown: false,
                }
            )
        }
        >
        <Tab.Screen name="Chi nhánh" component={HomeScreen} />
        <Tab.Screen name="Chức năng" component={TaskScreen} />
        <Tab.Screen name="Cảnh báo" component={WarningScreen} />
      
        </Tab.Navigator>

  );
};

export default TabNavigator;
