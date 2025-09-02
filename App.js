import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import AppTabs from "./src/navigations/AppTabs";

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <AppTabs />
    </NavigationContainer>
  );
}
