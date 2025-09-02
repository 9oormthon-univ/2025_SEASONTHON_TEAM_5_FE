import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

import BudgetScreen from "../features/budget/screens/BudgetScreen";
import CalendarScreen from "../features/calendar/screens/CalendarScreen";
import RecipeStack from "../features/recipe/navigations/RecipeStack";
import MypageScreen from "../features/mypage/screens/MypageScreen";
import MainStack from "../features/main/navigations/MainStack";
const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#0F766E",
        tabBarInactiveTintColor: "#6B7280",
        tabBarIcon: ({ color, size }) => {
          const iconMap = {
            예산관리: "cash-outline",
            캘린더: "calendar-outline",
            "레시피 추천": "list-outline",
            메인화면: "home-outline",
            마이페이지: "person-circle-outline",
          };
          return <Ionicons name={iconMap[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="예산관리" component={BudgetScreen} />
      <Tab.Screen name="캘린더" component={CalendarScreen} />
      <Tab.Screen name="레시피 추천" component={RecipeStack} />
      <Tab.Screen name="메인화면" component={MainStack} />
      <Tab.Screen name="마이페이지" component={MypageScreen} />
    </Tab.Navigator>
  );
}
