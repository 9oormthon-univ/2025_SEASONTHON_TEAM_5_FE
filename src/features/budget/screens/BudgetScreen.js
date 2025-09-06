import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, View, StyleSheet } from "react-native";
import BudgetHeader from "../components/BudgetHeader";
import BudgetSetup from "../components/BudgetSetup";
import FoodRegister from "../components/FoodRegister";

export default function BudgetScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <BudgetHeader />
        <BudgetSetup />
        <FoodRegister />
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