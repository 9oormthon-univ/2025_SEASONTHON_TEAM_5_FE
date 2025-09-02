import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useExpenseStore } from "../store/expenseStore";
import { colors } from "../../../theme/colors";

export default function AddExpenseScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const presetDate = route.params?.date; // YYYY-MM-DD
  const addExpense = useExpenseStore((s) => s.addExpense);

  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(presetDate || new Date().toISOString().slice(0, 10));
  const [method, setMethod] = useState("");
  const [memo, setMemo] = useState("");

  const goMain = () => navigation.navigate("메인화면", { screen: "MainHome" });

  const onSubmit = () => {
    const n = Number((amount || "").replaceAll(",", ""));
    if (!title.trim()) return Alert.alert("항목을 입력하세요");
    if (!n || n <= 0) return Alert.alert("금액을 올바르게 입력하세요");

    addExpense({
      title: title.trim(),
      category: "식사",
      amount: n,
      date: new Date(date).toISOString(),
      method: method.trim(),
      memo: memo.trim(),
    });
    goMain(); // 저장 후 메인으로 이동
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        {/* 헤더 (SafeArea 적용됨) */}
        <View style={styles.header}>
          <Pressable onPress={goMain} hitSlop={8}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>지출 내역 추가</Text>
          <View style={{ width: 24 }} />
        </View>

        <TextInput
          placeholder="금액"
          keyboardType="number-pad"
          value={amount}
          onChangeText={setAmount}
          style={styles.input}
          placeholderTextColor={colors.accent}
        />
        <TextInput
          placeholder="항목"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          placeholderTextColor={colors.accent}
        />
        <TextInput
          placeholder="날짜 (YYYY-MM-DD)"
          value={date}
          onChangeText={setDate}
          style={styles.input}
          placeholderTextColor={colors.accent}
        />
        <TextInput
          placeholder="결제 수단"
          value={method}
          onChangeText={setMethod}
          style={styles.input}
          placeholderTextColor={colors.accent}
        />
        <TextInput
          placeholder="메모"
          value={memo}
          onChangeText={setMemo}
          style={[styles.input, { height: 100 }]}
          multiline
          placeholderTextColor={colors.accent}
        />

        <Pressable style={styles.btn} onPress={onSubmit}>
          <Text style={styles.btnText}>추가</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, paddingHorizontal: 16, paddingBottom: 16, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 6,
    paddingBottom: 10,
  },
  headerTitle: { fontSize: 16, fontWeight: "800", color: colors.text },
  input: {
    backgroundColor: colors.card,
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  btn: {
    marginTop: "auto",
    backgroundColor: "#22C55E",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
