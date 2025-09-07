// src/features/main/screens/MainScreen.js
import React, { useCallback, useMemo, useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, View, StyleSheet, RefreshControl, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import MainHeader from "../components/MainHeader";
import MonthSummary from "../components/MonthSummary";
import { useExpenseStore } from "../store/expenseStore";
import MonthlyExpenseChart from "../components/MonthlyExpenseChart";

import { useBudgetStore } from "../../budget/store/budgetStore";


export default function MainScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const route = useRoute();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // 로컬 스토어만 사용하므로 단순히 새로고침 완료
      console.log("🔄 [MAIN] Local refresh completed");
    } catch (e) {
      console.warn(e);
    } finally {
      setRefreshing(false);
    }
  }, []);

  // 지출 추가 후 돌아올 때 강제 새로고침
  useEffect(() => {
    if (route.params?.refresh) {
      console.log("🔄 [MAIN] Force refresh from AddExpenseScreen");
      onRefresh();
    }
  }, [route.params?.refresh, onRefresh]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <MainHeader />
        <View style={{ height: 6 }} />
        <MonthSummary />
        <MonthlyExpenseChart />
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
    paddingTop: 8,
  },
});
