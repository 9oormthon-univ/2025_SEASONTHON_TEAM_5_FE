import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, View, StyleSheet } from "react-native";
import MainHeader from "../components/MainHeader";
import MonthSummary from "../components/MonthSummary";
import RecentExpenses from "../components/RecentExpenses";
import useMonthlyBudget from "../hooks/useMonthlyBudget";
import { useNavigation } from "@react-navigation/native";

export default function MainScreen() {
  const nav = useNavigation();
  const { monthTotal, remain, recent } = useMonthlyBudget();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <MainHeader
          onAdd={() => nav.navigate("메인화면", { screen: "AddExpense" })}
        />
        <View style={{ height: 6 }} />
        <MonthSummary total={monthTotal} remain={remain} />
        <RecentExpenses items={recent} />
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8FAFC" },
  container: { 
    flex: 1, 
    backgroundColor: "#F8FAFC", 
    paddingHorizontal: 16, 
    paddingTop: 8 
  },
});