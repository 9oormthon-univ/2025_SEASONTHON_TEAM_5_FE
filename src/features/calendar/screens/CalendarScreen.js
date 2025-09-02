import React, { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StyleSheet, Pressable, Text } from "react-native";
import { Calendar } from "react-native-calendars";
import Ionicons from "@expo/vector-icons/Ionicons";

import CalendarHeader from "../components/CalendarHeader";
import ExpensesOfDay from "../components/ExpensesOfDay";
import { useExpenseStore } from "../../main/store/expenseStore";
import { colors } from "../../../theme/colors";
import { useNavigation } from "@react-navigation/native";

const todayStr = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD

export default function CalendarScreen() {
  const navigation = useNavigation();
  const expenses = useExpenseStore((s) => s.expenses);
  const [selected, setSelected] = useState(todayStr());

  // 날짜별 마킹(점/선택) 생성
  const markedDates = useMemo(() => {
    const marks = {};
    // 지출 있는 날 dot 표시
    expenses.forEach((e) => {
      const key = (e.date || "").slice(0, 10);
      if (!key) return;
      marks[key] = { ...(marks[key] || {}), marked: true, dotColor: "#10B981" };
    });
    // 선택된 날 하이라이트
    marks[selected] = {
      ...(marks[selected] || {}),
      selected: true,
      selectedColor: "#10B981",
      selectedTextColor: "#fff",
    };
    return marks;
  }, [expenses, selected]);

  // 선택 날짜의 지출만 필터
  const itemsOfDay = useMemo(
    () =>
      expenses
        .filter((e) => (e.date || "").slice(0, 10) === selected)
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [expenses, selected]
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <CalendarHeader />

        <Calendar
          current={selected}
          onDayPress={(d) => setSelected(d.dateString)}
          markedDates={markedDates}
          enableSwipeMonths
          theme={{
            todayTextColor: "#10B981",
            arrowColor: colors.text,
            monthTextColor: colors.text,
            textMonthFontWeight: "800",
            textDayFontWeight: "600",
            textDayHeaderFontWeight: "700",
          }}
          style={styles.calendar}
        />

        <ExpensesOfDay dateString={selected} items={itemsOfDay} />

        {/* 플로팅 + 버튼 → 지출 추가(선택 날짜 프리필) */}
        <Pressable
          style={styles.fab}
          onPress={() => navigation.navigate("메인화면", { screen: "AddExpense", params: { date: selected } })}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8FAFC" },
  container: { flex: 1, backgroundColor: "#F8FAFC", paddingHorizontal: 16, paddingTop: 8 },
  calendar: {
    borderRadius: 12,
    backgroundColor: "#fff",
    paddingBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 28,
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10B981",
    elevation: 3,
  },
});
