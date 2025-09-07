// src/features/budget/screens/BudgetSetup.js
import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, Alert } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { colors } from "../../../theme/colors";
import { useBudgetCreate } from "../hooks/useBudgetCreate";

export default function BudgetSetup({ onClose }) {
  const { loading, error, setError, createBudget, buildPayloadFromUI } = useBudgetCreate();

  const [budgetInput, setBudgetInput] = useState("");

  // 📌 날짜 상태
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // 📌 Picker 표시 여부
  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState(false);

  const onSave = async () => {
    setError("");

    const payload = buildPayloadFromUI(budgetInput, startDate, endDate);
    console.log("🧾 [UI] Budget payload:", payload);

    const result = await createBudget(payload);
    if (!result) {
      return Alert.alert("저장 실패", error || "다시 시도해주세요.");
    }

    // 일수 계산은 안내용으로만 표시
    const s = new Date(payload.startAt);
    const e = new Date(payload.endAt);
    const diffDays = Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;

    Alert.alert(
      "저장됨",
      `예산: ${payload.amount.toLocaleString()}원\n기간: ${diffDays}일\n(${s.toLocaleDateString()} ~ ${e.toLocaleDateString()})`,
      [
        {
          text: "확인",
          onPress: () => {
            // 모달 닫기
            if (onClose) onClose();
          }
        }
      ]
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
      <Pressable
        style={[styles.saveBtn, loading && { opacity: 0.7 }]}
        onPress={onSave}
        disabled={loading}
      >
        <Text style={styles.saveText}>{loading ? "저장 중..." : "저장하기"}</Text>
      </Pressable>

      {!!error && <Text style={{ color: "#ef4444", marginTop: 8 }}>{error}</Text>}
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
