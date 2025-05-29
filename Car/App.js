import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/Appnavigator";
import * as Linking from 'expo-linking';
import { UserProvider } from './src/components/hooks/UserContext';
import NotificationPopup from './src/components/NotificationPopup';

const linking = {
  prefixes: ['carvip1://'],
  config: {
    screens: {
      PaymentSuccess: 'payment-success',
      // thêm các screens khác nếu muốn
    },
  },
};

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer linking={linking}>
        <AppNavigator />
        <NotificationPopup />
      </NavigationContainer>
    </UserProvider>
  );
}
