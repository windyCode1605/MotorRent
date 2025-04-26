import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/Appnavigator";
import TabNavigator from "./src/navigation/RouterTab";


export default function App() {
  return ( 
    <NavigationContainer>
      <AppNavigator/>
    </NavigationContainer>
  );
}
