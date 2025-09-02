import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, Alert } from "react-native";
import { useBudgetStore } from "../store/budgetStore";
import { colors } from "../../../theme/colors";

export default function BudgetSetup() {
  const monthlyBudget = useBudgetStore((s) => s.monthlyBudget);
  const periodDays = useBudgetStore((s) => s.periodDays);
  const setMonthlyBudget = useBudgetStore((s) => s.setMonthlyBudget);
  const setPeriodDays = useBudgetStore((s) => s.setPeriodDays);

  const [budgetInput, setBudgetInput] = useState(
    monthlyBudget ? String(monthlyBudget) : ""
  );
  const [periodInput, setPeriodInput] = useState(
    periodDays ? String(periodDays) : ""
  );

  const onSave = () => {
    const b = Number((budgetInput || "").replaceAll(",", ""));
    const p = Number(periodInput || 30);
    if (!b || b <= 0) return Alert.alert("예산 금액을 입력하세요");
    if (!p || p <= 0) return Alert.alert("사용 기한(일수)을 입력하세요");
    setMonthlyBudget(b);
    setPeriodDays(p);
    Alert.alert("저장됨", "이번 달 예산과 사용 기한이 저장되었습니다.");
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.sectionTitle}>예산 설정</Text>
      <TextInput
        placeholder="예산 금액을 입력하세요"
        keyboardType="number-pad"
        value={budgetInput}
        onChangeText={setBudgetInput}
        style={styles.input}
        placeholderTextColor={colors.accent}
      />
      <TextInput
        placeholder="예산 사용 기한을 입력하세요(일)"
        keyboardType="number-pad"
        value={periodInput}
        onChangeText={setPeriodInput}
        style={styles.input}
        placeholderTextColor={colors.accent}
      />
      <Pressable style={styles.saveBtn} onPress={onSave}>
        <Text style={styles.saveText}>저장하기</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 16, fontWeight: "800", color: colors.text, marginBottom: 10 },
  input: {
    backgroundColor: colors.card, padding: 14, borderRadius: 12, marginBottom: 12,
  },
  saveBtn: {
    alignSelf: "flex-start", backgroundColor: "#10B981",
    paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10,
  },
  saveText: { color: "#fff", fontWeight: "800" },
});
