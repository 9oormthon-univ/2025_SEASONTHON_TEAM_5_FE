// 📂 src/features/budget/screens/BudgetSetup.js
import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, Alert } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useBudgetStore } from "../store/budgetStore";
import { colors } from "../../../theme/colors";

export default function BudgetSetup() {
  const monthlyBudget = useBudgetStore((s) => s.monthlyBudget);
  const setMonthlyBudget = useBudgetStore((s) => s.setMonthlyBudget);
  const setPeriodDays = useBudgetStore((s) => s.setPeriodDays);

  const [budgetInput, setBudgetInput] = useState(
    monthlyBudget ? String(monthlyBudget) : ""
  );

  // 📌 날짜 상태
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // 📌 Picker 표시 여부
  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState(false);

  const onSave = () => {
    const b = Number((budgetInput || "").replaceAll(",", ""));
    if (!b || b <= 0) return Alert.alert("예산 금액을 입력하세요");
    if (!startDate || !endDate) return Alert.alert("시작일과 마감일을 선택하세요");

    setMonthlyBudget(b);

    // 📌 기간 계산 (일수)
    const diffDays =
      Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    setPeriodDays(diffDays);

    Alert.alert(
      "저장됨",
      `예산: ${b}원\n기간: ${diffDays}일\n(${startDate.toLocaleDateString()} ~ ${endDate.toLocaleDateString()})`
    );
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.sectionTitle}>예산 설정</Text>

      {/* 예산 입력 */}
      <TextInput
        placeholder="예산 금액을 입력하세요"
        keyboardType="number-pad"
        value={budgetInput}
        onChangeText={setBudgetInput}
        style={styles.input}
        placeholderTextColor={colors.accent}
      />

      {/* 시작일 선택 */}
      <Pressable style={styles.input} onPress={() => setStartPickerVisible(true)}>
        <Text style={{ color: startDate ? colors.text : colors.accent }}>
          {startDate ? startDate.toLocaleDateString() : "예산 사용 시작 날짜 선택"}
        </Text>
      </Pressable>
      <DateTimePickerModal
        isVisible={isStartPickerVisible}
        mode="date"
        onConfirm={(date) => {
          setStartDate(date);
          setStartPickerVisible(false);
        }}
        onCancel={() => setStartPickerVisible(false)}
      />

      {/* 마감일 선택 */}
      <Pressable style={styles.input} onPress={() => setEndPickerVisible(true)}>
        <Text style={{ color: endDate ? colors.text : colors.accent }}>
          {endDate ? endDate.toLocaleDateString() : "예산 사용 마감 날짜 선택"}
        </Text>
      </Pressable>
      <DateTimePickerModal
        isVisible={isEndPickerVisible}
        mode="date"
        onConfirm={(date) => {
          setEndDate(date);
          setEndPickerVisible(false);
        }}
        onCancel={() => setEndPickerVisible(false)}
      />

      {/* 저장 버튼 */}
      <Pressable style={styles.saveBtn} onPress={onSave}>
        <Text style={styles.saveText}>저장하기</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 10,
  },
  input: {
    backgroundColor: colors.card,
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  saveBtn: {
    alignSelf: "flex-start",
    backgroundColor: "#10B981",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  saveText: { color: "#fff", fontWeight: "800" },
});
