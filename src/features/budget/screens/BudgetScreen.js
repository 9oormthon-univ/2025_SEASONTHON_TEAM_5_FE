import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, View, StyleSheet } from "react-native";
import BudgetHeader from "../components/BudgetHeader";
import BudgetSetup from "../components/BudgetSetup";
import FoodRegister from "../components/FoodRegister";
import GotoRecipe from "../components/GotoRecipe";

export default function BudgetScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <BudgetHeader />
        <BudgetSetup />
        <FoodRegister />
        <GotoRecipe />
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },
  container: { paddingHorizontal: 16, paddingBottom: 24, backgroundColor: "#FFFFFF" },
});
